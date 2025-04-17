<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends User
{
    // Relation 1:N entre Employee et Intervention
    public function interventions()
    {
        return $this->hasMany(Intervention::class);
    }
}
