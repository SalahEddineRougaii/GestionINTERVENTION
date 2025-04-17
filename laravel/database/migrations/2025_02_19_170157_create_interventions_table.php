<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interventions', function (Blueprint $table) {
            $table->id();
            $table->text('description');
            $table->enum('status', ['pending', 'assigned', 'completed'])->default('pending');
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('employee_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('priority', ['haute', 'moyenne', 'basse'])->default('moyenne');
            $table->string('location');
            $table->date('desired_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interventions');
    }
};
