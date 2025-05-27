const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Para conectarse a la base de datos PostgreSQL

const app = express();
const port = 3001;

// Middleware para permitir solicitudes CORS
app.use(cors()); // Permite solicitudes desde cualquier origen

// Middleware para que Express entienda JSON
app.use(express.json());

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
  user: 'postgres',        // Tu usuario de PostgreSQL
  host: 'localhost',       // Dirección del servidor (localhost si estás corriendo localmente)
  database: 'gestion_comercio', // Nombre de la base de datos
  password: 'fec4a5n5',    // Tu contraseña de PostgreSQL
  port: 5432,              // Puerto de PostgreSQL
});

// ************************************************
//                   CLIENTES
// ************************************************

// Obtener todos los clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes ORDER BY id;');
    res.json(result.rows);
  } catch (error) {
    console.error('Error en la consulta a la base de datos', error);
    res.status(500).json({ error: 'Hubo un error al obtener los clientes' });
  }
});

// Obtener cliente por ID
app.get('/api/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener cliente por ID', error);
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
});

// Crear nuevo cliente
app.post('/api/clientes', async (req, res) => {
  try {
    const { nombre, email, telefono, direccion } = req.body;

    // Validar campos básicos
    if (!nombre || !email || !telefono || !direccion) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si ya existe un cliente con el mismo email
    const existente = await pool.query('SELECT * FROM clientes WHERE email = $1', [email]);
    if (existente.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe un cliente con ese email' });
    }

    const result = await pool.query(
      'INSERT INTO clientes (nombre, email, telefono, direccion) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, telefono, direccion]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear cliente', error);
    res.status(500).json({ error: 'Error al crear el cliente' });
  }
});

// Actualizar cliente
app.put('/api/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono, direccion } = req.body;

    if (!nombre || !email || !telefono || !direccion) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si otro cliente ya tiene ese email
    const conflicto = await pool.query('SELECT * FROM clientes WHERE email = $1 AND id != $2', [email, id]);
    if (conflicto.rows.length > 0) {
      return res.status(409).json({ error: 'Otro cliente ya utiliza ese email' });
    }

    const result = await pool.query(
      'UPDATE clientes SET nombre = $1, email = $2, telefono = $3, direccion = $4 WHERE id = $5 RETURNING *',
      [nombre, email, telefono, direccion, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar cliente', error);
    res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
});

// DELETE endpoint: eliminar cliente
app.delete('/api/clientes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM clientes WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json({
      mensaje: 'Cliente eliminado correctamente',
      cliente: result.rows[0],
    });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
});


// ************************************************
//                   PROVEEDORES
// ************************************************

// Obtener la lista de todos los proveedores
app.get('/api/proveedores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM proveedores');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ error: 'Error al obtener los proveedores' });
  }
});

// Obtener proveedor por ID
app.get('/api/proveedores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM proveedores WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener proveedor por ID:', error);
    res.status(500).json({ error: 'Error al obtener el proveedor' });
  }
});

// Crear nuevo proveedor
app.post('/api/proveedores', async (req, res) => {
  try {
    const { nombre, email, pais, condicion_pago_dias } = req.body;

    if (!nombre || !email || !pais || condicion_pago_dias == null) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const existente = await pool.query('SELECT * FROM proveedores WHERE email = $1', [email]);
    if (existente.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe un proveedor con ese email' });
    }

    const result = await pool.query(
      'INSERT INTO proveedores (nombre, email, pais, condicion_pago_dias) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, pais, condicion_pago_dias]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ error: 'Error al crear el proveedor' });
  }
});

// Actualizar proveedor
app.put('/api/proveedores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, pais, condicion_pago_dias } = req.body;

    if (!nombre || !email || !pais || condicion_pago_dias == null) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si otro proveedor tiene el mismo email
    const conflicto = await pool.query(
      'SELECT * FROM proveedores WHERE email = $1 AND id != $2',
      [email, id]
    );
    if (conflicto.rows.length > 0) {
      return res.status(409).json({ error: 'Otro proveedor ya utiliza ese email' });
    }

    const result = await pool.query(
      'UPDATE proveedores SET nombre = $1, email = $2, pais = $3, condicion_pago_dias = $4 WHERE id = $5 RETURNING *',
      [nombre, email, pais, condicion_pago_dias, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ error: 'Error al actualizar el proveedor' });
  }
});

// Eliminar proveedor
app.delete('/api/proveedores/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM proveedores WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json({ mensaje: 'Proveedor eliminado', proveedor: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ error: 'Error al eliminar el proveedor' });
  }
});


// ************************************************
//                   OPERACIONES
// ************************************************
// Endpoint para obtener la lista de las operaciones
app.get('/api/operaciones', async (req, res) => {
  try {
    // Nueva consulta con JOIN entre operaciones, clientes y proveedores
    const result = await pool.query(`
    SELECT 
      o.*, 
      c.nombre as nombre_cliente, 
      e.nombre as nombre_proveedor
    FROM operaciones o
    JOIN clientes c ON c.id = o.cliente_id
    JOIN proveedores e ON e.id = o.proveedor_id
    ORDER BY o.created_at DESC;
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener las operaciones:', error);
    res.status(500).json({ error: 'Error al obtener las operaciones' });
  }
});

// Obtener operación por ID con nombre del cliente y proveedor
app.get('/api/operaciones/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        o.*, 
        c.nombre AS nombre_cliente, 
        e.nombre AS nombre_proveedor
      FROM operaciones o
      JOIN clientes c ON c.id = o.cliente_id
      JOIN proveedores e ON e.id = o.proveedor_id
      WHERE o.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Operación no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener operación por ID con join:', error);
    res.status(500).json({ error: 'Error al obtener la operación' });
  }
});


app.post('/api/operaciones', async (req, res) => {
  try {
    const {
      numero_orden_compra,
      carpeta_onedrive,
      cliente_id,
      proveedor_id,
      f_envio_soc,
      numero_doc_solicitud,
      numero_factura_proveedor,
      incoterm,
      moneda,
      calidad,
      estado,
      tipo_transporte,
      transporte,  // <-- nuevo campo
      numero_bl_awb_crt,
      puerto_embarque,
      puerto_destino,
      f_etd,
      f_eta,
      f_etb,
      f_envio_dctos_intercomex,
      f_pago_proveedor,
      f_pago_derechos,
      dias_libres,
      condicion_pago_dias,
      numero_confirmacion_orden,
      etd_confirmada,
      eta_confirmada,
      etb_confirmada
    } = req.body;

    if (!numero_orden_compra || !cliente_id || !proveedor_id || !estado) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: número de orden, cliente, proveedor y estado' });
    }

    const result = await pool.query(
      `INSERT INTO operaciones (
        numero_orden_compra,
        carpeta_onedrive,
        cliente_id,
        proveedor_id,
        f_envio_soc,
        numero_doc_solicitud,
        numero_factura_proveedor,
        incoterm,
        moneda,
        calidad,
        estado,
        tipo_transporte,
        transporte,            -- nuevo campo
        numero_bl_awb_crt,
        puerto_embarque,
        puerto_destino,
        f_etd,
        f_eta,
        f_etb,
        f_envio_dctos_intercomex,
        f_pago_proveedor,
        f_pago_derechos,
        dias_libres,
        condicion_pago_dias,
        numero_confirmacion_orden,
        etd_confirmada,
        eta_confirmada,
        etb_confirmada
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24, $25, $26, $27, $28
      )
      RETURNING *`,
      [
        numero_orden_compra,
        carpeta_onedrive,
        cliente_id,
        proveedor_id,
        f_envio_soc,
        numero_doc_solicitud,
        numero_factura_proveedor,
        incoterm,
        moneda,
        calidad,
        estado,
        tipo_transporte,
        transporte,             // nuevo valor
        numero_bl_awb_crt,
        puerto_embarque,
        puerto_destino,
        f_etd,
        f_eta,
        f_etb,
        f_envio_dctos_intercomex,
        f_pago_proveedor,
        f_pago_derechos,
        dias_libres,
        condicion_pago_dias,
        numero_confirmacion_orden,
        etd_confirmada,
        eta_confirmada,
        etb_confirmada
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear operación:', error);
    res.status(500).json({ error: 'Error al crear la operación' });
  }
});

app.put('/api/operaciones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      numero_orden_compra,
      carpeta_onedrive,
      cliente_id,
      proveedor_id,
      f_envio_soc,
      numero_doc_solicitud,
      numero_factura_proveedor,
      incoterm,
      moneda,
      calidad,
      estado,
      tipo_transporte,
      transporte,    // <-- nuevo campo
      numero_bl_awb_crt,
      puerto_embarque,
      puerto_destino,
      f_etd,
      f_eta,
      f_etb,
      f_envio_dctos_intercomex,
      f_pago_proveedor,
      f_pago_derechos,
      dias_libres,
      condicion_pago_dias,
      numero_confirmacion_orden,
      etd_confirmada,
      eta_confirmada,
      etb_confirmada
    } = req.body;

    if (!numero_orden_compra || !cliente_id || !proveedor_id || !estado) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const result = await pool.query(
      `UPDATE operaciones SET
        numero_orden_compra = $1,
        carpeta_onedrive = $2,
        cliente_id = $3,
        proveedor_id = $4,
        f_envio_soc = $5,
        numero_doc_solicitud = $6,
        numero_factura_proveedor = $7,
        incoterm = $8,
        moneda = $9,
        calidad = $10,
        estado = $11,
        tipo_transporte = $12,
        transporte = $13,            -- nuevo campo
        numero_bl_awb_crt = $14,
        puerto_embarque = $15,
        puerto_destino = $16,
        f_etd = $17,
        f_eta = $18,
        f_etb = $19,
        f_envio_dctos_intercomex = $20,
        f_pago_proveedor = $21,
        f_pago_derechos = $22,
        dias_libres = $23,
        condicion_pago_dias = $24,
        numero_confirmacion_orden = $25,
        etd_confirmada = $26,
        eta_confirmada = $27,
        etb_confirmada = $28,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $29
      RETURNING *`,
      [
        numero_orden_compra,
        carpeta_onedrive,
        cliente_id,
        proveedor_id,
        f_envio_soc,
        numero_doc_solicitud,
        numero_factura_proveedor,
        incoterm,
        moneda,
        calidad,
        estado,
        tipo_transporte,
        transporte,                 // nuevo valor
        numero_bl_awb_crt,
        puerto_embarque,
        puerto_destino,
        f_etd,
        f_eta,
        f_etb,
        f_envio_dctos_intercomex,
        f_pago_proveedor,
        f_pago_derechos,
        dias_libres,
        condicion_pago_dias,
        numero_confirmacion_orden,
        etd_confirmada,
        eta_confirmada,
        etb_confirmada,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Operación no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar operación:', error);
    res.status(500).json({ error: 'Error al actualizar la operación' });
  }
});



// Eliminar operación
app.delete('/api/operaciones/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM operaciones WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Operación no encontrada' });
    }

    res.json({ mensaje: 'Operación eliminada', operacion: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar operación:', error);
    res.status(500).json({ error: 'Error al eliminar la operación' });
  }
});

// Actualizar campo "destacado" de una operación
app.patch('/api/operaciones/:id/destacado', async (req, res) => {
  try {
    const { id } = req.params;
    const { destacado } = req.body;

    // Validación básica del valor recibido
    if (typeof destacado !== 'boolean') {
      return res.status(400).json({ error: '"destacado" debe ser true o false' });
    }

    // Verificamos que la operación exista
    const check = await pool.query('SELECT id FROM operaciones WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Operación no encontrada' });
    }

    // Actualizamos el campo "destacado"
    await pool.query(
      'UPDATE operaciones SET destacado = $1 WHERE id = $2',
      [destacado, id]
    );

    res.json({ message: 'Campo "destacado" actualizado correctamente', destacado });
  } catch (error) {
    console.error('Error al actualizar "destacado":', error);
    res.status(500).json({ error: 'Error al actualizar el campo "destacado"' });
  }
});

// ************************************************
//          OPERACIONES COMENTARIOS
// ************************************************
// Crear un nuevo comentario
app.post('/api/operaciones_comentarios', async (req, res) => {
  try {
    const { id_operacion, comentario, fecha_comentario } = req.body;

    if (!id_operacion || !comentario || !fecha_comentario) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const result = await pool.query(
      'INSERT INTO operaciones_comentarios (id_operacion, comentario, fecha_comentario) VALUES ($1, $2, $3) RETURNING *',
      [id_operacion, comentario, fecha_comentario]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear comentario', error);
    res.status(500).json({ error: 'Error al crear el comentario' });
  }
});

// Obtener comentarios por operación específica (para el muro de comentarios)
app.get('/api/operaciones/:id_operacion/comentarios', async (req, res) => {
  try {
    const { id_operacion } = req.params;
    const result = await pool.query(
      'SELECT * FROM operaciones_comentarios WHERE id_operacion = $1 ORDER BY fecha_comentario DESC',
      [id_operacion]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener comentarios de la operación', error);
    res.status(500).json({ error: 'Error al obtener los comentarios' });
  }
});

// Editar un comentario por ID (solo actualiza el texto)
app.put('/api/operaciones_comentarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { comentario } = req.body;

    if (!comentario) {
      return res.status(400).json({ error: 'Comentario es obligatorio' });
    }

    const result = await pool.query(
      'UPDATE operaciones_comentarios SET comentario = $1 WHERE id = $2 RETURNING *',
      [comentario, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar comentario', error);
    res.status(500).json({ error: 'Error al actualizar el comentario' });
  }
});


// Eliminar comentario por ID
app.delete('/api/operaciones_comentarios/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM operaciones_comentarios WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Comentario eliminado', comentario: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar comentario', error);
    res.status(500).json({ error: 'Error al eliminar el comentario' });
  }
});

// Contar comentarios por operación
app.get('/api/operaciones/:id/comentarios/count', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT COUNT(*) FROM operaciones_comentarios WHERE id_operacion = $1',
      [id]
    );

    res.status(200).json({ count: parseInt(result.rows[0].count, 10) });
  } catch (error) {
    console.error('Error al contar comentarios', error);
    res.status(500).json({ error: 'Error al contar comentarios' });
  }
});

// ************************************************
//          PRODUCTOS POR OPERACIÓN
// ************************************************

// Crear un nuevo producto
app.post('/api/productos', async (req, res) => {
  try {
    const {
      operacion_id,
      codigo_sku,
      descripcion_producto,
      categoria_area,
      tipo_producto,
      unidad_medida,
      cantidad_solicitada,
      cantidad_facturada,
      precio_unitario,
      costo_total
    } = req.body;

    if (
      !operacion_id || !codigo_sku || !descripcion_producto ||
      !categoria_area || !tipo_producto || !unidad_medida ||
      cantidad_solicitada == null || cantidad_facturada == null ||
      precio_unitario == null || costo_total == null
    ) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const result = await pool.query(
      `INSERT INTO productos (
        operacion_id, codigo_sku, descripcion_producto,
        categoria_area, tipo_producto, unidad_medida,
        cantidad_solicitada, cantidad_facturada,
        precio_unitario, costo_total
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`,
      [
        operacion_id, codigo_sku, descripcion_producto,
        categoria_area, tipo_producto, unidad_medida,
        cantidad_solicitada, cantidad_facturada,
        precio_unitario, costo_total
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear producto', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// Obtener productos por operación
app.get('/api/operaciones/:operacion_id/productos', async (req, res) => {
  try {
    const { operacion_id } = req.params;
    const result = await pool.query(
      'SELECT * FROM productos WHERE operacion_id = $1 ORDER BY id ASC',
      [operacion_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Editar un producto por ID
app.put('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      codigo_sku,
      descripcion_producto,
      categoria_area,
      tipo_producto,
      unidad_medida,
      cantidad_solicitada,
      cantidad_facturada,
      precio_unitario,
      costo_total
    } = req.body;

    const result = await pool.query(
      `UPDATE productos SET
        codigo_sku = $1,
        descripcion_producto = $2,
        categoria_area = $3,
        tipo_producto = $4,
        unidad_medida = $5,
        cantidad_solicitada = $6,
        cantidad_facturada = $7,
        precio_unitario = $8,
        costo_total = $9
      WHERE id = $10
      RETURNING *`,
      [
        codigo_sku,
        descripcion_producto,
        categoria_area,
        tipo_producto,
        unidad_medida,
        cantidad_solicitada,
        cantidad_facturada,
        precio_unitario,
        costo_total,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar producto', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Eliminar un producto por ID
app.delete('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM productos WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({ mensaje: 'Producto eliminado', producto: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar producto', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// Contar productos por operación
app.get('/api/operaciones/:id/productos/count', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT COUNT(*) FROM productos WHERE operacion_id = $1',
      [id]
    );

    res.status(200).json({ count: parseInt(result.rows[0].count, 10) });
  } catch (error) {
    console.error('Error al contar productos', error);
    res.status(500).json({ error: 'Error al contar productos' });
  }
});

// *********************************************
//            ALIAS CAMPOS
// *********************************************

// Obtener todos los alias
app.get('/api/alias-campos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alias_campos ORDER BY nombre_tabla, nombre_campo;');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener alias:', error);
    res.status(500).json({ error: 'Error al obtener los alias' });
  }
});

// Obtener alias por nombre de tabla
app.get('/api/alias-campos/tabla/:nombreTabla', async (req, res) => {
  try {
    const { nombreTabla } = req.params;
    const result = await pool.query('SELECT * FROM alias_campos WHERE nombre_tabla = $1', [nombreTabla]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener alias por tabla:', error);
    res.status(500).json({ error: 'Error al obtener los alias por tabla' });
  }
});

// Crear alias nuevo
app.post('/api/alias-campos', async (req, res) => {
  try {
    const { nombre_tabla, nombre_campo, alias } = req.body;

    if (!nombre_tabla || !nombre_campo || !alias) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const result = await pool.query(
      `INSERT INTO alias_campos (nombre_tabla, nombre_campo, alias)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nombre_tabla, nombre_campo, alias]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear alias:', error);
    res.status(500).json({ error: 'Error al crear el alias' });
  }
});

// Actualizar un alias
app.put('/api/alias-campos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { alias } = req.body;

    if (!alias) {
      return res.status(400).json({ error: 'El campo alias es obligatorio' });
    }

    const result = await pool.query(
      `UPDATE alias_campos
       SET alias = $1, fecha_actualizacion = NOW()
       WHERE id = $2
       RETURNING *`,
      [alias, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alias no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar alias:', error);
    res.status(500).json({ error: 'Error al actualizar el alias' });
  }
});

// Eliminar alias
app.delete('/api/alias-campos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM alias_campos WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alias no encontrado' });
    }

    res.json({ mensaje: 'Alias eliminado correctamente', alias: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar alias:', error);
    res.status(500).json({ error: 'Error al eliminar el alias' });
  }
});

// *********************************************
//            VIEWS
// *********************************************
app.get('/api/operaciones_ultimamodificacion', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM operaciones_ultimamodificacion ORDER BY id;');
    res.json(result.rows);
  } catch (error) {
    console.error('Error en la consulta a la base de datos', error);
    res.status(500).json({ error: 'Hubo un error al obtener el informe resumensimple' });
  }
});
// Historial operación
app.get('/api/operacion_historial/:id', async (req, res) => {
  const idOperacion = parseInt(req.params.id, 10);
  if (isNaN(idOperacion)) {
    return res.status(400).json({ error: 'ID de operación inválido' });
  }

  try {
    const query = `
      SELECT h.*, 
             o.numero_orden_compra,
             o.carpeta_onedrive,
             o.proveedor_id,
             o.numero_bl_awb_crt,
             p.nombre as proveedor_nombre
      FROM historial_operacion($1) h
      JOIN operaciones o ON o.id = $1
      LEFT JOIN proveedores p ON p.id = o.proveedor_id
      ORDER BY h.f_cambio DESC;
    `;

    const result = await pool.query(query, [idOperacion]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error en la consulta a la base de datos', error);
    res.status(500).json({ error: 'Hubo un error al obtener el historial de la operación' });
  }
});

// ************************************************
// ************************************************
// ************************************************

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

// Iniciar el servidor en el puerto definido
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
