import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Design from './models/Design.js';

// --- Configuración de la App ---
const app = express();
const port = 5001;
const mongoURI = process.env.MONGO_URI || 'mongodb://database:27017/disena_tu_estilo';

// --- Middlewares ---
// Habilita CORS para permitir que tu frontend (en localhost:5173) se comunique con el backend.
app.use(cors()); 
// Permite que Express entienda el formato JSON en el cuerpo de las peticiones. ¡Esta línea es crucial!
app.use(express.json({ limit: '5mb' })); // Aumentamos el límite para aceptar las imágenes del dibujo.

// --- Conexión a la Base de Datos ---
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB conectado exitosamente.'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// --- Rutas de la API ---

// Ruta de bienvenida para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.send('API para Diseña tu Estilo está corriendo...');
});

// Ruta para guardar un nuevo diseño
app.post('/api/designs', async (req, res) => {
  try {
    // Gracias al middleware express.json(), ahora req.body contiene los datos enviados.
    const { productType, colors, texture, customText, drawingTexture } = req.body;
    
    // Validación básica
    if (!productType || !colors) {
      return res.status(400).json({ message: 'El tipo de producto y los colores son requeridos.' });
    }

    const newDesign = new Design({
      productType,
      colors,
      texture,
      customText,
      drawingTexture
    });

    const savedDesign = await newDesign.save();
    
    res.status(201).json({ message: 'Diseño guardado exitosamente', design: savedDesign });

  } catch (error) {
    console.error('Error al guardar el diseño:', error);
    res.status(500).json({ message: 'Error interno del servidor al intentar guardar el diseño.' });
  }
});

// --- Iniciar el Servidor ---
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

