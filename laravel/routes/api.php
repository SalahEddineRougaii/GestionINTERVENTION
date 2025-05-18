<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\InterventionController;

// Authentification
Route::post('/register', [UsersController::class, 'register']);
Route::post('/login', [UsersController::class, 'login']);

// Utilisateurs
Route::get('/users', [UsersController::class, 'getUsers']);
Route::delete('/users/{id}', [UsersController::class, 'deleteUser']);
Route::put('/users/{id}', [UsersController::class, 'updateUser']);

// Interventions
Route::get('/interventions', [InterventionController::class, 'getInterventions']);
Route::post('/interventions', [InterventionController::class, 'createIntervention']);
Route::put('/interventions/{id}', [InterventionController::class, 'assignIntervention']);
Route::put('/interventions/complete/{id}', [InterventionController::class, 'completeIntervention']);

Route::get('/interventions/client/{client_id}', function ($client_id) {
    return Intervention::where('client_id', $client_id)->get();
});

// Interventions
Route::get('/interventions/employee/{employee_id}', [InterventionController::class, 'getInterventionsByEmployee']);


// Route pour récupérer les interventions d'un client spécifique
Route::get('/interventions/client/{client_id}', [InterventionController::class, 'getInterventionsByClient']);
Route::put('/interventions/cancel/{id}', [InterventionController::class, 'cancel']);
// Annuler l'attribution d'une intervention
// Exemple d'appel via une route :
Route::put('/interventions/{id}/annuler', [InterventionController::class, 'annulerAttribution']);
