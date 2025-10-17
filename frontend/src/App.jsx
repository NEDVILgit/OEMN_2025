import React, { useState } from 'react';
import EditorUI from './components/EditorUI';
import Canvas3D from './components/Canvas3D';
import DrawingCanvas from './components/DrawingCanvas';

export default function App() {
  const [productType, setProductType] = useState('backpack');
  const [colors, setColors] = useState({
    body: '#ffffff',
    adjustmentStraps: '#333333',
    loadStraps: '#555555',
    sidePockets: '#cccccc',
  });
  const [texture, setTexture] = useState('none');
  
  // Estado del texto simplificado, sin la propiedad 'font'
  const [customText, setCustomText] = useState({
    content: 'OEMN',
    color: '#000000',
    size: 2.5,
    positionX: 0, 
    positionY: 0.25,
  });

  const [drawingTexture, setDrawingTexture] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleColorChange = (part, color) => {
    setColors(prev => ({ ...prev, [part]: color }));
  };

  const handleApplyDrawing = (dataUrl) => {
    setDrawingTexture(dataUrl);
    setTexture('custom');
    setIsDrawing(false);
  };
  
  const handleSaveDesign = async () => {
    const designData = {
      productType,
      colors,
      texture,
      customText,
      drawingDataUrl: texture === 'custom' ? drawingTexture : null,
    };

    try {
      const response = await fetch('http://localhost:5001/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(designData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const savedDesign = await response.json();
      console.log('Diseño guardado:', savedDesign);
      alert('¡Tu diseño ha sido guardado con éxito!');
    } catch (error) {
      console.error('Error al guardar el diseño:', error);
      alert('Hubo un problema al guardar tu diseño. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-3 font-sans">
      <div className="lg:col-span-1 bg-white p-6 overflow-y-auto">
        <EditorUI
          productType={productType}
          setProductType={setProductType}
          colors={colors}
          handleColorChange={handleColorChange}
          texture={texture}
          setTexture={setTexture}
          customText={customText}
          setCustomText={setCustomText}
          onSaveDesign={handleSaveDesign}
          onOpenDrawing={() => setIsDrawing(true)}
        />
      </div>
      <div className="lg:col-span-2 bg-gray-100 relative">
        <Canvas3D 
          productType={productType}
          colors={colors}
          texture={texture}
          customText={customText}
          drawingTexture={drawingTexture}
        />
      </div>
      {isDrawing && (
        <DrawingCanvas 
          onClose={() => setIsDrawing(false)}
          onApply={handleApplyDrawing}
        />
      )}
    </div>
  );
}

