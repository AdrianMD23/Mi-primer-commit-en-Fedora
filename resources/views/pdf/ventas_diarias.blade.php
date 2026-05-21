<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte Diario de Ventas</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #1e1e24;
            margin: 0;
            padding: 0;
            font-size: 11px;
        }
        .header-box {
            background-color: #0f172a;
            color: #ffffff;
            padding: 20px;
            margin-bottom: 25px;
        }
        .header-box h1 {
            margin: 0;
            font-size: 20px;
            letter-spacing: 1px;
            font-style: italic;
        }
        .header-box p {
            margin: 5px 0 0 0;
            opacity: 0.7;
            font-size: 12px;
        }
        .summary-table {
            width: 100%;
            margin-bottom: 30px;
            border-collapse: collapse;
        }
        .summary-table td {
            padding: 10px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
        }
        .summary-title {
            font-weight: bold;
            color: #475569;
            text-transform: uppercase;
            font-size: 9px;
        }
        .summary-value {
            font-size: 16px;
            font-weight: bold;
            color: #0f172a;
        }
        .summary-value.total {
            color: #10b981;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .data-table th {
            background-color: #f1f5f9;
            color: #334155;
            text-transform: uppercase;
            font-size: 9px;
            font-weight: bold;
            padding: 8px 10px;
            border-bottom: 2px solid #cbd5e1;
            text-align: left;
        }
        .data-table td {
            padding: 8px 10px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
        }
        .data-table tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .badge {
            background-color: #e0e7ff;
            color: #4338ca;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 9px;
        }
        .text-right {
            text-align: right;
        }
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 9px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 5px;
        }
    </style>
</head>
<body>

    <div class="header-box">
        <h1>JOYERÍA Y ARTESANÍAS</h1>
        <p>Reporte Operativo Diario de Ventas — Sucursal Valladolid</p>
        <p style="font-size: 10px; font-weight: bold;">Fecha de Corte: {{ $fecha }}</p>
    </div>

    <table class="summary-table">
        <tr>
            <td>
                <span class="summary-title">Efectivo Recaudado</span><br>
                <span class="summary-value">${{ number_format($efectivo, 2) }}</span>
            </td>
            <td>
                <span class="summary-title">Pagos con Tarjeta</span><br>
                <span class="summary-value">${{ number_format($tarjeta, 2) }}</span>
            </td>
            <td>
                <span class="summary-title">Transferencias</span><br>
                <span class="summary-value">${{ number_format($transferencia, 2) }}</span>
            </td>
            <td style="background-color: #ecfdf5; border-left: 3px solid #10b981;">
                <span class="summary-title" style="color: #065f46;">Total en Ventas</span><br>
                <span class="summary-value total">${{ number_format($total_general, 2) }}</span>
            </td>
        </tr>
    </table>

    <h2 style="font-size: 14px; color: #0f172a; margin-bottom: 10px;">Desglose de Tickets Emitidos</h2>
    
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 10%;">Folio</th>
                <th style="width: 15%;">Hora</th>
                <th style="width: 45%;">Artículos Vendidos</th>
                <th style="width: 15%;">Método de Pago</th>
                <th style="width: 15%; text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($ventas as $venta)
            <tr>
                <td style="font-weight: bold;">#{{ str_pad($venta->id, 5, '0', STR_PAD_LEFT) }}</td>
                <td>{{ $venta->created_at->format('H:i:s A') }}</td>
                <td>
                    <div style="margin: 0; padding: 0;">
                        @foreach($venta->detalles as $detalle)
                            • [{{ $detalle->producto->clave ?? 'S/C' }}] {{ $detalle->producto->nombre ?? 'Producto Eliminado' }} (x{{ $detalle->cantidad }})<br>
                        @endforeach
                    </div>
                </td>
                <td><span class="badge">{{ $venta->metodo_pago }}</span></td>
                <td class="text-right" style="font-weight: bold;">${{ number_format($venta->total, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Sistema de Control Interno Platería - Generado de manera automática. Página 1 de 1
    </div>

</body>
</html>