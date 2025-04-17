<?php

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        if (!User::where('role', 'admin')->exists()) {
            User::create([
                'name' => 'Admin Name',
                'email' => 'admin@example.com',
                'password' => Hash::make('admin_password'),
                'role' => 'admin',
            ]);
        }
    }
}
