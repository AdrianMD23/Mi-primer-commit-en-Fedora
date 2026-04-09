<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Creamos al Administrador (Tú)
        User::create([
            'name' => 'Adrián Admin',
            'username' => 'admin',
            'email' => 'admin@silveart.com',
            'password' => Hash::make('12345678'), // Contraseña fácil para pruebas
            'role' => 'Administrador',
        ]);

        // 2. Creamos al Gerente (Iván)
        User::create([
            'name' => 'Iván Gerente',
            'username' => 'ivan',
            'email' => 'ivan@silveart.com',
            'password' => Hash::make('12345678'),
            'role' => 'Gerente',
        ]);

        // 3. Creamos al Vendedor (Marco)
        User::create([
            'name' => 'Marco Vendedor',
            'username' => 'marco',
            'email' => 'marco@silveart.com',
            'password' => Hash::make('12345678'),
            'role' => 'Vendedor',
        ]);

        // 4. Llamamos al sembrador de inventario que creamos hace rato
        $this->call([
            ProductoSeeder::class,
        ]);
    }
}