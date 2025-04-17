<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Appel des autres seeders
        $this->call([
            
            
            AdminSeeder::class, // Ajoutez ceci pour appeler le seeder de l'administrateur
        ]);
    }
}
