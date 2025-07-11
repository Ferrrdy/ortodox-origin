<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAddressesTable extends Migration
{
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('label', 50); 
            $table->string('receiver_name', 100);
            $table->string('phone', 20);
            $table->unsignedBigInteger('province_id');
            $table->string('province_name');
            $table->unsignedBigInteger('city_id');
            $table->string('city_name'); 
            $table->unsignedBigInteger('district_id');
            $table->string('district_name')->nullable(); 
            $table->string('postal_code')->nullable();
            $table->text('address_detail');
            $table->timestamps();
            $table->foreign('city_id')->references('id')->on('cities');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
}
