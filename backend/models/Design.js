import mongoose from 'mongoose';

// Sub-esquema para el texto personalizado
const customTextSchema = new mongoose.Schema({
  content: { type: String, default: '' },
  color: { type: String, default: '#000000' },
  size: { type: Number, default: 0.3 },
  positionY: { type: Number, default: 0 },
}, { _id: false });

// Sub-esquema para los colores
const colorsSchema = new mongoose.Schema({
  body: { type: String, default: '#ffffff' },
  straps: { type: String, default: '#d4af37' },
  pocket: { type: String, default: '#808080' },
}, { _id: false });

// Esquema principal del diseño
const designSchema = new mongoose.Schema({
  productType: {
    type: String,
    required: true,
  },
  colors: {
    type: colorsSchema,
    required: true,
  },
  texture: {
    type: String,
    default: 'none',
  },
  customText: {
    type: customTextSchema,
  },
  // Campo para guardar el dibujo como un string largo (data URL base64)
  drawingTexture: {
    type: String, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Design = mongoose.model('Design', designSchema);

export default Design;

