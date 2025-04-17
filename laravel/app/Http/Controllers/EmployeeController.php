<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function getEmployeeDetails(Request $request)
    {
        $employee = $request->user();  // Récupère l'employé authentifié

        // Charger les assignations de l'employé
        $assignations = $employee->interventions;  // Assure-toi que la relation est définie dans le modèle Employé

        return response()->json([
            'employee' => $employee,
            'assignations' => $assignations
        ]);
    }
}

