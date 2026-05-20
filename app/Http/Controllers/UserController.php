<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        // Traemos a todos los usuarios ordenados por el más reciente
        $usuarios = User::orderBy('id', 'desc')->get();

        return Inertia::render('Admin/Usuarios/Index', [
            'usuarios' => $usuarios
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users', // <-- Validamos que no se repita
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:Administrador,Gerente,Vendedor'
        ]);

        User::create([
            'name' => $request->name,
            'username' => $request->username, // <-- Lo guardamos
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'role' => $request->role,
        ]);

        return back()->with('success', 'Cuenta de empleado creada exitosamente.');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $rules = [
            'name' => 'required|string|max:255',
            // Validamos que el username y correo sean únicos, excepto para este mismo usuario
            'username' => 'required|string|max:255|unique:users,username,'.$id,
            'email' => 'required|string|email|max:255|unique:users,email,'.$id,
            'role' => 'required|string|in:Administrador,Gerente,Vendedor'
        ];

        if ($request->filled('password')) {
            $rules['password'] = 'required|string|min:8';
            $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
        }

        $request->validate($rules);

        $user->name = $request->name;
        $user->username = $request->username; // <-- Lo actualizamos
        $user->email = $request->email;
        $user->role = $request->role;
        $user->save();

        return back()->with('success', 'Datos del empleado actualizados correctamente.');
    }
}