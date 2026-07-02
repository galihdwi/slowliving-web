<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('house_occupancies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('house_id')->constrained('houses')->cascadeOnDelete();
            $table->foreignId('resident_id')->constrained('residents')->cascadeOnDelete();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('fee_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->decimal('amount', 12, 2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('house_id')->constrained('houses')->cascadeOnDelete();
            $table->foreignId('resident_id')->constrained('residents')->cascadeOnDelete();
            $table->foreignId('house_occupancy_id')->nullable()->constrained('house_occupancies')->nullOnDelete();
            $table->date('period_month');
            $table->date('due_date')->nullable();
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->enum('status', ['unpaid', 'partial', 'paid'])->default('unpaid');
            $table->timestamps();

            $table->unique(['house_id', 'resident_id', 'period_month']);
        });

        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained('invoices')->cascadeOnDelete();
            $table->foreignId('fee_type_id')->constrained('fee_types')->restrictOnDelete();
            $table->string('description');
            $table->decimal('amount', 12, 2);
            $table->timestamps();
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->cascadeOnDelete();
            $table->foreignId('house_id')->constrained('houses')->cascadeOnDelete();
            $table->date('payment_date');
            $table->decimal('amount', 12, 2);
            $table->string('payment_method')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('payment_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained('payments')->cascadeOnDelete();
            $table->foreignId('invoice_item_id')->constrained('invoice_items')->cascadeOnDelete();
            $table->decimal('amount', 12, 2);
            $table->timestamps();
        });

        Schema::create('expense_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expense_category_id')->nullable()->constrained('expense_categories')->nullOnDelete();
            $table->date('expense_date');
            $table->decimal('amount', 12, 2);
            $table->text('description');
            $table->string('proof_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('expense_categories');
        Schema::dropIfExists('payment_allocations');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('invoice_items');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('fee_types');
        Schema::dropIfExists('house_occupancies');
    }
};
