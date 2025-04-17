<?php

namespace Database\Factories;

use App\Models\Intervention;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class InterventionFactory extends Factory
{
    protected $model = Intervention::class;

    public function definition()
    {
        return [
            'description' => $this->faker->sentence,
            'status' => $this->faker->randomElement(['pending', 'assigned', 'completed']),
            'client_id' => User::factory(),  // Génère un utilisateur pour le client
            'employee_id' => User::factory(), // Génère un utilisateur pour l'employé (facultatif)
        ];
    }
}
