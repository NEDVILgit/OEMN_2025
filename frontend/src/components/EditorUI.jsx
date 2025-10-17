import React from 'react';

// Componente para una sección del editor
const EditorSection = ({ title, children }) => (
  <div className="border-b border-gray-300 pb-4 mb-4">
    <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
    {children}
  </div>
);

// Componente para un botón de opción
const OptionButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md'
        : 'bg-white text-gray-700 hover:bg-gray-100'
    }`}
  >
    {label}
  </button>
);

export default function EditorUI({
  productType,
  setProductType,
  colors,
  onColorChange,
  texture,
  onTextureChange,
  customText,
  onTextChange,
  onOpenDrawing,
  drawingTexture, // Recibimos la textura para pasarla al guardar
}) {
  const productOptions = [
    { id: 'backpack', label: 'Mochila' },
    { id: 'bag', label: 'Bolso' },
    { id: 'mateBag', label: 'Bolso Matero' },
  ];

  const colorOptions = [
    { id: 'body', label: 'Cuerpo Principal' },
    { id: 'straps', label: 'Tiras / Asas' },
    { id: 'pocket', label: 'Bolsillo / Detalles' },
  ];

  const textureOptions = [
    { id: 'none', label: 'Liso' },
    { id: 'canvas', label: 'Lona' },
    { id: 'leather', label: 'Cuero' },
    { id: 'geometric', label: 'Geométrico' },
  ];
  
  const handleSave = async () => {
    const designData = {
      productType,
      colors,
      texture,
      customText,
      drawingTexture, // Incluimos el dibujo en los datos a guardar
    };

    try {
      const response = await fetch('http://localhost:5001/api/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(designData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('¡Diseño guardado exitosamente!');
        console.log('Diseño guardado:', result.design);
      } else {
        throw new Error(result.message || 'Error al guardar el diseño.');
      }
    } catch (error) {
      console.error('Error en la petición de guardado:', error);
      alert(`Error: ${error.message}`);
    }
  };


  return (
    <div className="w-full md:w-96 bg-gray-100 p-6 overflow-y-auto shadow-lg h-1/2 md:h-full">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Diseña tu Estilo</h2>
        <p className="text-gray-600 mb-6">Personaliza cada detalle a tu gusto.</p>

        <EditorSection title="1. Elige tu Producto">
          <div className="flex space-x-2">
            {productOptions.map(opt => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                isActive={productType === opt.id}
                onClick={() => setProductType(opt.id)}
              />
            ))}
          </div>
        </EditorSection>

        <EditorSection title="2. Colores">
          <div className="space-y-3">
            {colorOptions.map(opt => (
              <div key={opt.id} className="flex items-center justify-between">
                <label htmlFor={`${opt.id}-color`} className="text-sm font-medium text-gray-700">{opt.label}</label>
                <input
                  id={`${opt.id}-color`}
                  type="color"
                  value={colors[opt.id]}
                  onChange={e => onColorChange(opt.id, e.target.value)}
                  className="w-10 h-10 rounded-full border-gray-300 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </EditorSection>

        <EditorSection title="3. Materiales y Estampados">
          <div className="grid grid-cols-2 gap-2">
            {textureOptions.map(opt => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                isActive={texture === opt.id}
                onClick={() => onTextureChange(opt.id)}
              />
            ))}
             <button
              onClick={onOpenDrawing}
              className={`col-span-2 mt-2 px-4 py-3 rounded-md text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                texture === 'custom' 
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-purple-500 text-white hover:bg-purple-700'
              }`}
            >
              Modo Creativo (Dibujar)
            </button>
          </div>
        </EditorSection>
        
        <EditorSection title="4. Grabado de Texto">
            <div className="space-y-3">
                 <input
                    type="text"
                    value={customText.content}
                    onChange={(e) => onTextChange('content', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Tu texto aquí"
                />
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Color</label>
                    <input
                        type="color"
                        value={customText.color}
                        onChange={(e) => onTextChange('color', e.target.value)}
                        className="w-10 h-10 rounded-full border-gray-300 cursor-pointer"
                    />
                </div>
                 <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Tamaño</label>
                    <input
                        type="range"
                        min="0.1"
                        max="0.5"
                        step="0.01"
                        value={customText.size}
                        onChange={(e) => onTextChange('size', parseFloat(e.target.value))}
                        className="w-1/2"
                    />
                </div>
            </div>
        </EditorSection>

        <div className="mt-8">
          <button
            onClick={handleSave}
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Guardar Diseño
          </button>
        </div>
      </div>
    </div>
  );
}

