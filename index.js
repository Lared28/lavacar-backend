const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./src/config/db');
const serviciosRoutes = require('./src/routes/servicios.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',').map(url => url.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  }
}));

app.use(express.json());

// Ruta raíz de verificación de estado
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API del Lavacar Apex Detailing funcionando correctamente.'
  });
});

// Ruta de verificación de conexión a MySQL
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS resultado');
    res.status(200).json({
      status: 'OK',
      message: 'Conexión exitosa a MySQL',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error de conexión a BD:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'No se pudo conectar a la base de datos MySQL'
    });
  }
});

// Rutas CRUD de servicios
app.use('/api/servicios', serviciosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});