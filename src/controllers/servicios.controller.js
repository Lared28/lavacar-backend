const pool = require('../config/db');

const TIPOS_PERMITIDOS = ['Sedán', 'SUV / 4x4', 'Motocicleta', 'Todos'];

// GET /api/servicios - Consultar todos los servicios activos
const obtenerServicios = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM servicios WHERE activo = 1 ORDER BY id DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ message: 'Error interno al consultar los servicios.' });
  }
};

// GET /api/servicios/:id - Consultar un servicio por ID
const obtenerServicioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM servicios WHERE id = ? AND activo = 1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado.' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    res.status(500).json({ message: 'Error interno al consultar el servicio.' });
  }
};

// POST /api/servicios - Crear un nuevo servicio
const crearServicio = async (req, res) => {
  try {
    const { nombre, descripcion, tipo_vehiculo, precio, duracion_minutos } = req.body;

    // Validaciones obligatorias
    if (!nombre || !descripcion || precio === undefined || duracion_minutos === undefined) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
    if (Number(precio) <= 0 || isNaN(Number(precio))) {
      return res.status(400).json({ message: 'El precio debe ser un número mayor a 0.' });
    }
    if (Number(duracion_minutos) <= 0 || !Number.isInteger(Number(duracion_minutos))) {
      return res.status(400).json({ message: 'La duración debe ser un número entero de minutos mayor a 0.' });
    }

    const tipoFinal = tipo_vehiculo && TIPOS_PERMITIDOS.includes(tipo_vehiculo) ? tipo_vehiculo : 'Todos';

    const [result] = await pool.query(
      'INSERT INTO servicios (nombre, descripcion, tipo_vehiculo, precio, duracion_minutos) VALUES (?, ?, ?, ?, ?)',
      [nombre.trim(), descripcion.trim(), tipoFinal, Number(precio), Number(duracion_minutos)]
    );

    res.status(201).json({
      message: 'Servicio creado exitosamente.',
      id: result.insertId,
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      tipo_vehiculo: tipoFinal,
      precio: Number(precio),
      duracion_minutos: Number(duracion_minutos),
      activo: 1
    });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({ message: 'Error interno al crear el servicio.' });
  }
};

// PUT /api/servicios/:id - Actualizar un servicio existente
const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, tipo_vehiculo, precio, duracion_minutos } = req.body;

    if (!nombre || !descripcion || precio === undefined || duracion_minutos === undefined) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
    if (Number(precio) <= 0 || isNaN(Number(precio))) {
      return res.status(400).json({ message: 'El precio debe ser un número mayor a 0.' });
    }
    if (Number(duracion_minutos) <= 0 || !Number.isInteger(Number(duracion_minutos))) {
      return res.status(400).json({ message: 'La duración debe ser un número entero de minutos mayor a 0.' });
    }

    const tipoFinal = tipo_vehiculo && TIPOS_PERMITIDOS.includes(tipo_vehiculo) ? tipo_vehiculo : 'Todos';

    const [result] = await pool.query(
      'UPDATE servicios SET nombre = ?, descripcion = ?, tipo_vehiculo = ?, precio = ?, duracion_minutos = ? WHERE id = ? AND activo = 1',
      [nombre.trim(), descripcion.trim(), tipoFinal, Number(precio), Number(duracion_minutos), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado para actualizar.' });
    }

    res.status(200).json({
      message: 'Servicio actualizado exitosamente.',
      id: Number(id),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      tipo_vehiculo: tipoFinal,
      precio: Number(precio),
      duracion_minutos: Number(duracion_minutos)
    });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({ message: 'Error interno al actualizar el servicio.' });
  }
};

// DELETE /api/servicios/:id - Desactivar (borrado lógico) un servicio
const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('UPDATE servicios SET activo = 0 WHERE id = ? AND activo = 1', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado o ya eliminado.' });
    }

    res.status(200).json({ message: 'Servicio eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({ message: 'Error interno al eliminar el servicio.' });
  }
};

module.exports = {
  obtenerServicios,
  obtenerServicioPorId,
  crearServicio,
  actualizarServicio,
  eliminarServicio
};