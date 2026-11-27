<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lead;
use Illuminate\Validation\Rule;

class LeadController extends Controller
{
    // Get all leads with search and filters
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Lead::where('organization_id', $user->organization_id)
            ->with('assignedUser:id,name,email');

        // Search leads
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by source
        if ($request->filled('source')) {
            $query->where('source', $request->source);
        }

        // Filter by assigned user
        if ($request->filled('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        $leads = $query->latest()->paginate(10)->withQueryString();

        return response()->json([
            'status' => true,
            'message' => 'Leads retrieved successfully.',
            'data' => $leads,
        ]);
    }

    // Create new lead
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:30',
            'job_title' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'status' => [
                'nullable',
                Rule::in(['new', 'contacted', 'qualified', 'converted', 'lost']),
            ],
            'notes' => 'nullable|string',
            'assigned_to' => [
                'nullable',
                Rule::exists('users', 'id')->where(
                    fn ($query) => $query->where(
                        'organization_id',
                        $user->organization_id
                    )
                ),
            ],
        ]);

        $validated['organization_id'] = $user->organization_id;

        if (empty($validated['status'])) {
            $validated['status'] = 'new';
        }

        $lead = Lead::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Lead created successfully.',
            'data' => $lead->load('assignedUser:id,name,email'),
        ], 201);
    }

    // Get single lead
    public function show(Request $request, $id)
    {
        $lead = Lead::where('organization_id', $request->user()->organization_id)
            ->with('assignedUser:id,name,email')
            ->findOrFail($id);

        return response()->json([
            'status' => true,
            'message' => 'Lead retrieved successfully.',
            'data' => $lead,
        ]);
    }

    // Update lead
    public function update(Request $request, $id)
    {
        $user = $request->user();

        $lead = Lead::where('organization_id', $user->organization_id)
            ->findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:30',
            'job_title' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'status' => [
                'sometimes',
                'required',
                Rule::in(['new', 'contacted', 'qualified', 'converted', 'lost']),
            ],
            'notes' => 'nullable|string',
            'assigned_to' => [
                'nullable',
                Rule::exists('users', 'id')->where(
                    fn ($query) => $query->where(
                        'organization_id',
                        $user->organization_id
                    )
                ),
            ],
        ]);

        $lead->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Lead updated successfully.',
            'data' => $lead->fresh()->load('assignedUser:id,name,email'),
        ]);
    }

    // Delete lead
    public function destroy(Request $request, $id)
    {
        $lead = Lead::where('organization_id', $request->user()->organization_id)
            ->findOrFail($id);

        $lead->delete();

        return response()->json([
            'status' => true,
            'message' => 'Lead deleted successfully.',
        ]);
    }
}

