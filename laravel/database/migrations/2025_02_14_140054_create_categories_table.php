<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriesTable extends Migration
{
    /**
     * Exécute la migration.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();  // Clé primaire auto-incrémentée
            $table->string('name');  // Colonne pour le nom de la catégorie
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
        Schema::dropIfExists('categories');  // Supprime la table `categories`
    }
}
