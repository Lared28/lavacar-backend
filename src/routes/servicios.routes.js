const express = require('express');
const router = express.Router();
const {
  obtenerServicios,
  obtenerServicioPorId,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} = require('../controllers/servicios.controller');

router.get('/', obtenerServicios);
router.get('/:id', obtenerServicioPorId);
router.post('/', crearServicio);
router.put('/:id', actualizarServicio);
router.delete('/:id', eliminarServicio);

module.exports = router;