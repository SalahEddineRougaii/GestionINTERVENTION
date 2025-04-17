<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'category_id' => 1
        ]);

        User::create([
            'email' => 'employee@example.com',
            'password' => bcrypt('password'),
            'role' => 'employee',
            'category_id' => 2
        ]);
    }
}
