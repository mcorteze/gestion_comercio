-- Clientes
INSERT INTO clientes (nombre, email, telefono, direccion) VALUES
('Comercial Andina S.A.', 'contacto@andina.cl', '+56 9 1234 5678', 'Av. Los Leones 123, Santiago'),
('TecnoImport Ltda.', 'ventas@tecnoimport.cl', '+56 9 8765 4321', 'Av. Apoquindo 4567, Las Condes'),
('Distribuciones del Sur', 'admin@delsur.cl', '+56 2 2222 3333', 'Ruta 5 Sur KM 200, Talca');

-- Proveedores
INSERT INTO proveedores (nombre, email, pais, condicion_pago_dias) VALUES
('Shenzhen Tech Co.', 'export@shenzhen.com.cn', 'China', 30),
('Global Freight LLC', 'ops@globalfreight.com', 'EEUU', 45),
('LogiTrans S.A.', 'logistica@logitrans.com.ar', 'Argentina', 60);

-- Operaciones
INSERT INTO operaciones (
    numero_orden_compra, carpeta_onedrive, cliente_id, proveedor_id, f_envio_soc, 
    numero_doc_solicitud, numero_factura_proveedor, incoterm, moneda, comentarios, calidad, estado
) VALUES
('OC-001', 'onedrive:/importaciones/oc001', 1, 1, '2025-04-01', 
 'SOC-1001', 'INV-789', 'FOB', 'USD', 'Primera importación del año', 'A', 'En tránsito'),
('OC-002', 'onedrive:/importaciones/oc002', 2, 2, '2025-04-10',
 'SOC-1002', 'INV-790', 'CIF', 'EUR', 'Equipos electrónicos', 'B', 'Pendiente');

-- Productos de las operaciones
INSERT INTO productos_operacion (
    operacion_id, codigo_sku, descripcion_producto, categoria_area, tipo_producto,
    unidad_medida, cantidad_solicitada, cantidad_facturada, precio_unitario, total
) VALUES
(1, 'PRD001', 'Router industrial 5G', 'Redes', 'Electrónico', 'UN', 100, 100, 120.00, 12000.00),
(1, 'PRD002', 'Switch PoE 24 puertos', 'Redes', 'Electrónico', 'UN', 50, 48, 180.00, 8640.00),
(2, 'PRD003', 'Antena parabólica', 'Comunicaciones', 'Accesorio', 'UN', 20, 20, 95.00, 1900.00);

-- Logística
INSERT INTO logistica_operacion (
    operacion_id, tipo_transporte, numero_bl_awb_crt, puerto_embarque, puerto_destino,
    f_etd, f_eta, f_envio_dctos_intercomex, f_pago_proveedor, f_pago_derechos, dias_libres,
    condicion_pago_dias, comentarios
) VALUES
(1, 'Marítimo', 'BL123456789', 'Puerto de Shanghai', 'Puerto de San Antonio', 
 '2025-04-05', '2025-05-01', '2025-04-06', '2025-04-10', '2025-04-15', 14, 30, 'Viaje sin novedad'),
(2, 'Aéreo', 'AWB987654321', 'Aeropuerto de Frankfurt', 'Aeropuerto de Santiago',
 '2025-04-12', '2025-04-16', '2025-04-13', '2025-04-14', '2025-04-18', 7, 45, 'Carga prioritaria');

-- Historial de cambios
INSERT INTO historial_cambios (
    operacion_id, campo_modificado, valor_anterior, valor_nuevo, f_cambio, usuario_id
) VALUES
(1, 'estado', 'Pendiente', 'En tránsito', '2025-04-05 10:00:00', 101),
(1, 'f_eta', '2025-04-30', '2025-05-01', '2025-04-15 09:00:00', 102),
(2, 'cantidad_facturada', '18', '20', '2025-04-14 15:30:00', 101);
