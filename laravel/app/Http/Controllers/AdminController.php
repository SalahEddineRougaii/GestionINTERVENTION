<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Category;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Enregistrer un employé
    public function registerEmployee(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email',
            'password' => 'required|string|min:8',
            'categories' => 'required|array',
        ]);

        $employee = Employee::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        // Lier les catégories à l'employé
        $employee->categories()->sync($request->categories);

        return response()->json($employee, 201);
    }

    // Liste des employés
    public function getEmployees()
    {
        $employees = Employee::all();
        return response()->json($employees);
    }

    // Liste des catégories
    public function getCategories()
    {
        $categories = Category::all();
        return response()->json($categories);
    }
}
