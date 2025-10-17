import React, { useRef, useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

// Este es el nuevo componente para el lienzo de dibujo.
export default function DrawingCanvas({ onClose, onApply }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  // Inicializa el canvas cuando el componente se monta
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 512; // Tamaño de la textura
    canvas.height = 512;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    contextRef.current = context;
  }, []);
  
  // Actualiza el color y tamaño del pincel cuando cambian
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = brushColor;
      contextRef.current.lineWidth = brushSize;
    }
  }, [brushColor, brushSize]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };
  
  const handleApplyClick = () => {
    const dataUrl = canvasRef.current.toDataURL('image/png'); // Convierte el dibujo a una imagen
    onApply(dataUrl);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 flex flex-col md:flex-row gap-6 max-w-4xl w-full">
        {/* Panel de Herramientas */}
        <div className="flex-shrink-0 w-full md:w-64">
          <h3 className="text-xl font-bold mb-4">Herramientas de Dibujo</h3>
          <div className="space-y-4">
            <div>
              <label className="font-semibold">Color del Pincel</label>
              <HexColorPicker color={brushColor} onChange={setBrushColor} className="!w-full mt-2" />
            </div>
            <div>
              <label className="font-semibold">Tamaño: {brushSize}px</label>
              <input type="range" min="1" max="50" value={brushSize} onChange={e => setBrushSize(e.target.value)} className="w-full mt-2" />
            </div>
            <button onClick={clearCanvas} className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300">Limpiar Lienzo</button>
          </div>
        </div>
        
        {/* Lienzo de Dibujo */}
        <div className="flex-grow flex flex-col items-center">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            onMouseLeave={finishDrawing}
            className="border-2 border-gray-300 rounded-md cursor-crosshair bg-white"
          />
        </div>

        {/* Acciones */}
        <div className="flex flex-col space-y-3 self-start">
            <button onClick={handleApplyClick} className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600">Aplicar</button>
            <button onClick={onClose} className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600">Cancelar</button>
        </div>
      </div>
    </div>
  );
}
