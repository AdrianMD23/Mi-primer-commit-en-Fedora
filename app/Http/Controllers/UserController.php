<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        // Traemos todos los usuarios ordenados por el más reciente
        $usuarios = User::latest()->get();

        // Los mandamos a una nueva vista que vamos a crear
        return Inertia::render('Admin/Usuarios/Index', [
            'usuarios' => $usuarios
        ]);
    }
}