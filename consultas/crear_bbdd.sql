CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR,
    email VARCHAR,
    telefono VARCHAR,
    direccion TEXT
);

CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR,
    email VARCHAR,
    pais VARCHAR,
    condicion_pago_dias INT
);

CREATE TABLE operaciones (
    id SERIAL PRIMARY KEY,
    numero_orden_compra VARCHAR,
    carpeta_onedrive VARCHAR,
    cliente_id INT REFERENCES clientes(id),
    proveedor_id INT REFERENCES proveedores(id),
    f_envio_soc DATE,
    numero_doc_solicitud VARCHAR,
    numero_factura_proveedor VARCHAR,
    incoterm VARCHAR,
    moneda VARCHAR,
    comentarios TEXT,
    calidad VARCHAR,
    estado VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos_operacion (
    id SERIAL PRIMARY KEY,
    operacion_id INT REFERENCES operaciones(id),
    codigo_sku VARCHAR,
    descripcion_producto VARCHAR,
    categoria_area VARCHAR,
    tipo_producto VARCHAR,
    unidad_medida VARCHAR,
    cantidad_solicitada DECIMAL,
    cantidad_facturada DECIMAL,
    precio_unitario DECIMAL,
    total DECIMAL
);

CREATE TABLE logistica_operacion (
    id SERIAL PRIMARY KEY,
    operacion_id INT REFERENCES operaciones(id),
    tipo_transporte VARCHAR,
    numero_bl_awb_crt VARCHAR,
    puerto_embarque VARCHAR,
    puerto_destino VARCHAR,
    f_etd DATE,
    f_eta DATE,
    f_envio_dctos_intercomex DATE,
    f_pago_proveedor DATE,
    f_pago_derechos DATE,
    dias_libres INT,
    condicion_pago_dias INT,
    comentarios TEXT
);

CREATE TABLE historial_cambios (
    id SERIAL PRIMARY KEY,
    operacion_id INT REFERENCES operaciones(id),
    campo_modificado VARCHAR,
    valor_anterior TEXT,
    valor_nuevo TEXT,
    f_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT
);
