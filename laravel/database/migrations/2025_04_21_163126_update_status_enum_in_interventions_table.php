<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateStatusEnumInInterventionsTable extends Migration
{
    public function up(): void
    {
        Schema::table('interventions', function (Blueprint $table) {
            // تعديل العمود 'status' لإضافة القيمة 'annulée'
            $table->enum('status', ['pending', 'assigned', 'completed', 'annulée'])->default('pending')->change();
        });
    }

    public function down(): void
    {
        Schema::table('interventions', function (Blueprint $table) {
            // الرجوع إلى النسخة القديمة بدون 'annulée'
            $table->enum('status', ['pending', 'assigned', 'completed'])->default('pending')->change();
        });
    }
}
