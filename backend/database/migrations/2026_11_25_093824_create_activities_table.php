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
        Schema::create('activities', function (Blueprint $table) {
    $table->id();

    $table->foreignId('organization_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->foreignId('created_by')
        ->nullable()
        ->constrained('users')
        ->nullOnDelete();

    $table->foreignId('lead_id')
        ->nullable()
        ->constrained()
        ->nullOnDelete();

    $table->foreignId('customer_id')
        ->nullable()
        ->constrained()
        ->nullOnDelete();

    $table->foreignId('contact_id')
        ->nullable()
        ->constrained()
        ->nullOnDelete();

    $table->foreignId('task_id')
        ->nullable()
        ->constrained()
        ->nullOnDelete();

    $table->string('type')->default('note');
    $table->string('subject');
    $table->text('description')->nullable();
    $table->dateTime('activity_at')->useCurrent();

    $table->timestamps();

    $table->index(['organization_id', 'type']);
    $table->index(['customer_id', 'activity_at']);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
