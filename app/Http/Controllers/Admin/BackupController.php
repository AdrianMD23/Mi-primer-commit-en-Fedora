<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BackupController extends Controller
{
    public function download()
    {
        $dbName = env('DB_DATABASE');
        $dbUser = env('DB_USERNAME');
        $dbPass = env('DB_PASSWORD');
        $dbHost = env('DB_HOST');
        
        $fileName = "respaldo_plateria_" . date('Y-m-d_H-i-s') . ".sql";

        // Comando para generar el volcado de la base de datos
        // Nota: Asegúrate de tener 'mysqldump' instalado en el servidor
        $command = "mysqldump --user={$dbUser} --password='{$dbPass}' --host={$dbHost} {$dbName}";

        return new StreamedResponse(function () use ($command) {
            $handle = popen($command, 'r');
            while (!feof($handle)) {
                echo fread($handle, 1024);
            }
            pclose($handle);
        }, 200, [
            'Content-Type' => 'application/octet-stream',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
        ]);
    }
}