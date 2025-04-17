<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Intervention extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'status',
        'client_id',
        'employee_id',
        'priority',
        'location',
        'desired_date',  // Ajout de la colonne 'desired_date'
    ];

    // Relation avec le client
    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    // Relation avec l'employé
    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }
}
