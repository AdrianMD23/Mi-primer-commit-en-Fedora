<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte Semanal de Ventas</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #082052; margin: 0; padding: 0; }
        .header { background-color: #082052; color: #F8F0E5; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-style: italic; }
        .content { padding: 40px; }
        .fecha { text-align: right; font-size: 12px; margin-bottom: 20px; color: #666; }
        
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #F8F0E5; border: 1px solid #082052; padding: 10px; text-align: left; font-size: 13px; }
        td { border: 1px solid #ddd; padding: 10px; font-size: 12px; }
        
        .total-box { margin-top: 30px; text-align: right; background-color: #F8F0E5; padding: 15px; border-radius: 10px; border: 1px solid #082052; }
        .total-box p { margin: 5px 0; font-weight: bold; }
        .footer { position: fixed; bottom: 20px; width: 100%; text-align: center; font-size: 10px; color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Platería Adrián Matos</h1>
        <p>Reporte de Actividad Semanal</p>
    </div>

    <div class="content">
        <div class="fecha">
            Generado el: {{ date('d/m/Y H:i') }}
        </div>

        <h3>Resumen de Ventas de la Semana</h3>
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Vendedor</th>
                    <th>Método de Pago</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($ventas as $v)
                <tr>
                    <td>{{ $v->created_at->format('d/m/Y') }}</td>
                    <td>{{ $v->usuario->name ?? 'N/A' }}</td>
                    <td>{{ $v->metodo_pago }}</td>
                    <td>${{ number_format($v->total, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="total-box">
            <p>Ingresos Totales: ${{ number_format($ventas->sum('total'), 2) }}</p>
            <p>Gastos Registrados: ${{ number_format($gastos->sum('monto'), 2) }}</p>
            <hr style="border: 0; border-top: 1px solid #082052;">
            <p style="font-size: 18px;">Balance Neto: ${{ number_format($ventas->sum('total') - $gastos->sum('monto'), 2) }}</p>
        </div>
    </div>

    <div class="footer">
        Sistema de Gestión Interna - Valladolid, Yucatán.
    </div>
</body>
</html>