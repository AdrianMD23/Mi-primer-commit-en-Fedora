<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Auditoría - Platería</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #4a0e2e;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #4a0e2e;
            font-size: 28px;
            font-style: italic;
            margin: 0;
        }
        .header p {
            color: #bc430d;
            font-weight: bold;
            margin: 5px 0 0 0;
            font-size: 14px;
        }
        .meta-info {
            text-align: right;
            font-size: 12px;
            color: #666;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }
        th {
            background-color: #4a0e2e;
            color: #e8dcc8;
            padding: 10px;
            text-align: left;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }
        .tipo-entrada { color: #15803d; font-weight: bold; }
        .tipo-salida { color: #b91c1c; font-weight: bold; }
        .tipo-ajuste { color: #b45309; font-weight: bold; }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>Platería Adrián Matos</h1>
        <p>REPORTE DE AUDITORÍA DE INVENTARIO</p>
    </div>

    <div class="meta-info">
        Generado el: <strong>{{ now()->format('d/m/Y H:i') }}</strong><br>
        Frecuencia: <strong>Corte Semanal</strong>
    </div>

    <table>
        <thead>
            <tr>
                <th>Fecha y Hora</th>
                <th>Tipo</th>
                <th>Clave - Pieza</th>
                <th>Cant.</th>
                <th>Motivo Registrado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($movimientos as $mov)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($mov->fecha)->format('d/m/Y H:i') }}</td>
                    
                    <td>
                        @if($mov->tipo == 'Entrada')
                            <span class="tipo-entrada">ENTRADA</span>
                        @elseif($mov->tipo == 'Salida')
                            <span class="tipo-salida">SALIDA</span>
                        @else
                            <span class="tipo-ajuste">AJUSTE</span>
                        @endif
                    </td>
                    
                    <td>
                        <strong>{{ $mov->producto->clave }}</strong><br>
                        {{ $mov->producto->nombre }}
                    </td>
                    
                    <td style="text-align: center; font-weight: bold; font-size: 14px;">
                        {{ $mov->cantidad }}
                    </td>
                    
                    <td>{{ $mov->motivo }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Este documento es un comprobante oficial de movimientos internos de almacén.<br>
        Sistema de Gestión Platería Adrián Matos &copy; {{ now()->format('Y') }}
    </div>

</body>
</html>