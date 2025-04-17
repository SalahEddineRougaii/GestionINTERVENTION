<?php

namespace Database\Seeders;

use App\Models\Intervention;
use Illuminate\Database\Seeder;

class InterventionSeeder extends Seeder
{
    public function run()
    {
        // Crée 10 interventions factices
        \App\Models\Intervention::factory(10)->create();
    }
}
