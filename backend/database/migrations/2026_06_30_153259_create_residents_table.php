<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('residents', function (Blueprint $table) {
            $table->id();
            $table->string('full_name', 255);
            $table->string('ktp_photo_path')->nullable();
            $table->enum('resident_status', ['permanent', 'contract'])->default('permanent');
            $table->string('phone_number', 30);
            $table->enum('marital_status', ['single', 'married']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};
