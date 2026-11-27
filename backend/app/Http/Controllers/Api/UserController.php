<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
     public function index(Request $request)
    {
        $users = User::where(
            'organization_id',
            $request->user()->organization_id
        )
        ->select('id', 'name', 'email')
        ->orderBy('name')
        ->get();

        return response()->json([
            'status' => true,
            'data' => $users
        ]);
    }
}
