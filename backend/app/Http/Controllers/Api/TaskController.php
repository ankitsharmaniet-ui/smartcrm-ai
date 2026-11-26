<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $tasks = Task::with([
            'assignedUser:id,name',
            'creator:id,name',
        ])
            ->where('organization_id', $user->organization_id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'status' => true,
            'message' => 'Tasks fetched successfully',
            'data' => $tasks,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => [
                'required',
                Rule::in(['follow_up', 'call', 'meeting', 'other']),
            ],
            'priority' => [
                'required',
                Rule::in(['low', 'medium', 'high']),
            ],
            'due_at' => ['nullable', 'date'],
            'assigned_to' => [
                'nullable',
                Rule::exists('users', 'id')
                    ->where('organization_id', $user->organization_id),
            ],
            'lead_id' => [
                'nullable',
                Rule::exists('leads', 'id')
                    ->where('organization_id', $user->organization_id),
            ],
            'customer_id' => [
                'nullable',
                Rule::exists('customers', 'id')
                    ->where('organization_id', $user->organization_id),
            ],
        ]);

        $task = Task::create([
            ...$validated,
            'organization_id' => $user->organization_id,
            'created_by' => $user->id,
            'status' => 'pending',
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Task created successfully',
            'data' => $task,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();

        $task = Task::where('organization_id', $user->organization_id)
            ->findOrFail($id);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => [
                'sometimes',
                'required',
                Rule::in(['follow_up', 'call', 'meeting', 'other']),
            ],
            'priority' => [
                'sometimes',
                'required',
                Rule::in(['low', 'medium', 'high']),
            ],
            'status' => [
                'sometimes',
                'required',
                Rule::in(['pending', 'in_progress', 'completed', 'cancelled']),
            ],
            'due_at' => ['nullable', 'date'],
        ]);

        $task->update($validated);

        if (isset($validated['status'])) {
            $task->completed_at = $validated['status'] === 'completed'
                ? now()
                : null;

            $task->save();
        }

        return response()->json([
            'status' => true,
            'message' => 'Task updated successfully',
            'data' => $task,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        $task = Task::where('organization_id', $user->organization_id)
            ->findOrFail($id);

        $task->delete();

        return response()->json([
            'status' => true,
            'message' => 'Task deleted successfully',
        ]);
    }

}
