<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeesTable extends Migration
{
    /**
     * Exécute la migration.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();  // Clé primaire auto-incrémentée
            $table->string('name');  // Colonne pour le nom de l'employé
            $table->string('email')->unique();  // Colonne pour l'email de l'employé, unique
            $table->string('password');  // Colonne pour le mot de passe
            $table->timestamps();  // Colonnes pour `created_at` et `updated_at`
        });
    }

    /**
     * Annule la migration.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employees');  // Supprime la table `employees`
    }
}
