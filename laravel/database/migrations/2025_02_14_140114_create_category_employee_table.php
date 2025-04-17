<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoryEmployeeTable extends Migration
{
    /**
     * Exécute la migration.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('category_employee', function (Blueprint $table) {
            $table->id();  // Clé primaire auto-incrémentée
            $table->foreignId('category_id')  // Colonne pour la clé étrangère `category_id`
                  ->constrained()  // Cette colonne fait référence à la table `categories`
                  ->onDelete('cascade');  // Supprime les enregistrements liés si une catégorie est supprimée
            $table->foreignId('employee_id')  // Colonne pour la clé étrangère `employee_id`
                  ->constrained()  // Cette colonne fait référence à la table `employees`
                  ->onDelete('cascade');  // Supprime les enregistrements liés si un employé est supprimé
            $table->timestamps();  // Colonnes `created_at` et `updated_at`
        });
    }

    /**
     * Annule la migration.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('category_employee');  // Supprime la table pivot `category_employee`
    }
}
