<?php

namespace App\Http\Controllers;

use App\Models\Intervention;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InterventionController extends Controller
{
    public function getInterventions()
    {
        $interventions = Intervention::all();
        return response()->json($interventions);
    }

    public function createIntervention(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'description' => 'required|string',
            'client_id' => 'required|exists:users,id',
            'priority' => 'required|string|in:haute,moyenne,basse',
            'location' => 'required|string',
            'desired_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $intervention = Intervention::create([
            'description' => $request->description,
            'client_id' => $request->client_id,
            'priority' => $request->priority,
            'location' => $request->location,
            'desired_date' => $request->desired_date,
            'status' => 'pending',
        ]);

        return response()->json(['message' => 'Intervention créée avec succès', 'intervention' => $intervention]);
    }
    public function getInterventionsByEmployee($employee_id)
{
    // Récupérer les interventions assignées à un employé spécifique
    $interventions = Intervention::where('employee_id', $employee_id)->get();

    // Vérifier si l'employé a des interventions assignées
    if ($interventions->isEmpty()) {
        return response()->json(['message' => 'Aucune intervention assignée à cet employé.'], 404);
    }

    // Retourner la liste des interventions sous forme de réponse JSON
    return response()->json($interventions);
}


public function getInterventionsByClient($client_id)
{
    // Récupérer les interventions associées à un client spécifique
    $interventions = Intervention::where('client_id', $client_id)->get();

    // Vérifier si le client a des interventions
    if ($interventions->isEmpty()) {
        return response()->json(['message' => 'Aucune intervention trouvée pour ce client.'], 404);
    }

    // Retourner la liste des interventions sous forme de réponse JSON
    return response()->json($interventions);
}


    public function assignIntervention(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $intervention = Intervention::find($id);
        if (!$intervention) {
            return response()->json(['message' => 'Intervention non trouvée'], 404);
        }

        $intervention->employee_id = $request->employee_id;
        $intervention->status = 'assigned';
        $intervention->save();

        return response()->json(['message' => 'Intervention assignée avec succès', 'intervention' => $intervention]);
    }
    

    public function completeIntervention($id)
    {
        $intervention = Intervention::find($id);
        if (!$intervention) {
            return response()->json(['message' => 'Intervention non trouvée'], 404);
        }

        $intervention->status = 'completed';
        $intervention->save();

        return response()->json(['message' => 'Intervention complétée avec succès', 'intervention' => $intervention]);
    }
    public function cancel($id)
{
    $intervention = Intervention::find($id);
    if (!$intervention) {
        return response()->json(['error' => 'Not Found'], 404);
    }

    $intervention->status = 'annulée'; // تأكد من القيم المسموحة
    $intervention->save();

    return response()->json(['message' => 'Intervention annulée avec succès']);
}
public function annulerAttribution($id)
{
    // Récupérer l'intervention par son ID
    $intervention = Intervention::find($id);

    if (!$intervention) {
        return response()->json(['message' => 'Intervention non trouvée.'], 404);
    }

    // Vérifier si l'intervention a déjà été attribuée
    if (!$intervention->employee_id) {
        return response()->json(['message' => 'Cette intervention n\'a pas d\'attribution.'], 400);
    }

    // Annuler l'attribution (mettre employee_id à null)
    $intervention->employee_id = null;
    $intervention->status = 'pending';  // Mettre à jour le statut si nécessaire
    $intervention->save();

    return response()->json(['message' => 'Attribution annulée avec succès.'], 200);
}


  
}
