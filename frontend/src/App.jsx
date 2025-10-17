import React, { useState } from 'react';
import EditorUI from './components/EditorUI';
import Canvas3D from './components/Canvas3D';
import DrawingCanvas from './components/DrawingCanvas';

export default function App() {
  const [productType, setProductType] = useState('backpack');
  const [colors, setColors] = useState({
    body: '#ffffff',
    straps: '#555555',
    pocket: '#333333',
  });
  const [texture, setTexture] = useState('none');
  const [customText, setCustomText] = useState({
    content: 'TÖTÖ',
    color: '#000000',
    size: 0.25,
    positionY: 0,
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingTexture, setDrawingTexture] = useState(null);

  const handleColorChange = (part, value) => {
    setColors(prev => ({ ...prev, [part]: value }));
  };

  const handleTextChange = (key, value) => {
    setCustomText(prev => ({ ...prev, [key]: value }));
  };

  const handleTextureChange = (newTexture) => {
    setTexture(newTexture);
  };
  
  const handleApplyDrawing = (dataUrl) => {
    setDrawingTexture(dataUrl);
    setTexture('custom'); // Activa la textura custom automáticamente
    setIsDrawing(false);
  };

  return (
    <div className="w-screen h-screen bg-gray-200 flex flex-col md:flex-row">
      {isDrawing && (
        <DrawingCanvas 
          onClose={() => setIsDrawing(false)}
          onApply={handleApplyDrawing}
        />
      )}
      <EditorUI
        productType={productType}
        setProductType={setProductType} // CORRECCIÓN: Pasamos la función setProductType al EditorUI
        colors={colors}
        onColorChange={handleColorChange}
        texture={texture}
        onTextureChange={handleTextureChange}
        customText={customText}
        onTextChange={handleTextChange}
        drawingTexture={drawingTexture}
        onOpenDrawing={() => setIsDrawing(true)}
      />
      <div className="flex-grow h-1/2 md:h-full w-full md:w-auto">
        <Canvas3D 
          productType={productType}
          colors={colors}
          texture={texture}
          customText={customText}
          drawingTexture={drawingTexture}
        />
      </div>
    </div>
  );
}





