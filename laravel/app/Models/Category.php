<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    // Relier les catégories aux employés
    public function employees()
    {
        return $this->belongsToMany(Employee::class);
    }
}
