<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        Category::create(['name' => 'Sales']);
        Category::create(['name' => 'Marketing']);
        Category::create(['name' => 'HR']);
    }
}
