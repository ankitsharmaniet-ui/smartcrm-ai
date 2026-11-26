<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Customer;
use App\Models\Task;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
     public function index(Request $request)
    {
        $user = $request->user();
        $organizationId = $user->organization_id;

        // Organization-wise lead count
        $totalLeads = Lead::where('organization_id', $organizationId)
            ->count();

        // Organization-wise customer count
        $totalCustomers = Customer::where('organization_id', $organizationId)
            ->count();

        // Pending and in-progress tasks
        $openTasks = Task::where('organization_id', $organizationId)
            ->whereIn('status', ['pending', 'in_progress'])
            ->count();
        
        $monthlyPerformance = [];

        for ($i = 6; $i >= 0; $i--) {
            $month = now()->startOfMonth()->subMonths($i);
            $nextMonth = $month->copy()->addMonth();

            $monthlyPerformance[] = [
                'month' => $month->format('M'),

                'leads' => Lead::where('organization_id', $organizationId)
                    ->where('created_at', '>=', $month)
                    ->where('created_at', '<', $nextMonth)
                    ->count(),

                'customers' => Customer::where('organization_id', $organizationId)
                    ->where('created_at', '>=', $month)
                    ->where('created_at', '<', $nextMonth)
                    ->count(),
            ];
        }


        $upcomingTasks = Task::with('assignedUser')
            ->where('organization_id', $organizationId)
            ->whereIn('status', ['pending', 'in_progress'])
            ->whereNotNull('due_at')
            ->where('due_at', '>=', now())
            ->orderBy('due_at', 'asc')
            ->limit(5)
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'due_at' => $task->due_at,
                    'priority' => $task->priority,
                    'status' => $task->status,
                    'assigned_to' => $task->assignedUser?->name,
                ];
            });

            $recentLeads = Lead::where('organization_id', $organizationId)
                ->latest()
                ->limit(5)
                ->get()
                ->map(function ($lead) {
                    return [
                        'id' => $lead->id,
                        'name' => trim($lead->first_name . ' ' . $lead->last_name),
                        'email' => $lead->email,
                        'company' => $lead->company,
                        'status' => $lead->status,
                        'source' => $lead->source,
                    ];
                });



        return response()->json([
            'status' => true,
            'message' => 'Dashboard data fetched successfully.',
            'data' => [
                'total_leads' => $totalLeads,
                'total_customers' => $totalCustomers,
                'open_tasks' => $openTasks,
                'monthly_performance' => $monthlyPerformance,
                'upcoming_tasks' => $upcomingTasks,
                'recent_leads' => $recentLeads,
            ],
        ]);
    }
}
