<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function usersIndex()
    {
        // Traemos todos los usuarios de la base de datos
        $users = User::all();
        return Inertia::render('Admin/UsersManage', [
            'users' => $users
        ]);
    }

    public function userUpdate(Request $request, User $user)
    {
        // Validamos y actualizamos el rol o datos
        $user->update($request->only('name', 'email', 'role'));
        return back()->with('message', 'Usuario actualizado con éxito');
    }

    public function cortesIndex()
    {
        // Datos simulados (Dummy data) para maquetar la vista.
        // Más adelante, esto vendrá de las tablas de 'ventas' y 'cortes'.
        $cortesSimulados = [
            ['id' => 1, 'fecha' => '2026-03-26', 'total_ventas' => 5, 'ingresos' => 4500.00, 'estado' => 'Abierto', 'encargado' => 'Marco Vendedor'],
            ['id' => 2, 'fecha' => '2026-03-25', 'total_ventas' => 8, 'ingresos' => 6200.00, 'estado' => 'Cerrado', 'encargado' => 'Iván Gerente'],
            ['id' => 3, 'fecha' => '2026-03-24', 'total_ventas' => 3, 'ingresos' => 1850.00, 'estado' => 'Cerrado', 'encargado' => 'Marco Vendedor'],
        ];

        return Inertia::render('Gerencia/Cortes/Index', [
            'cortes' => $cortesSimulados
        ]);
    }
}