<?php

namespace Database\Seeders;

use App\Models\ExpenseCategory;
use App\Models\FeeType;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        FeeType::firstOrCreate(
            ['code' => 'security'],
            ['name' => 'Satpam', 'amount' => 100000, 'is_active' => true],
        );

        FeeType::firstOrCreate(
            ['code' => 'cleaning'],
            ['name' => 'Kebersihan', 'amount' => 15000, 'is_active' => true],
        );

        foreach (['Gaji Satpam', 'Token Listrik', 'Perbaikan Jalan', 'Perbaikan Selokan', 'Lainnya'] as $name) {
            ExpenseCategory::firstOrCreate(['name' => $name]);
        }
    }
}
