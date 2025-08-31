'use client';

import { useState } from 'react';

interface TextEditorProps {
  initialText: string;
  onTextChange: (text: string) => void;
}

export default function TextEditor({ initialText, onTextChange }: TextEditorProps) {
  const [text, setText] = useState(initialText);
  const [fontSize, setFontSize] = useState('large');
  const [color, setColor] = useState('#ffffff');
  const [position, setPosition] = useState('center');

  const handleTextChange = (newText: string) => {
    setText(newText);
    onTextChange(newText);
  };

  return (
    <div className="text-editor">
      <h3 className="editor-title">Editor de Texto</h3>
      
      <div className="editor-controls">
        <div className="control-group">
          <label>Tamaño de fuente:</label>
          <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
            <option value="small">Pequeño</option>
            <option value="medium">Mediano</option>
            <option value="large">Grande</option>
            <option value="x-large">Extra Grande</option>
          </select>
        </div>

        <div className="control-group">
          <label>Color:</label>
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>Posición:</label>
          <select value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="top">Superior</option>
            <option value="center">Centro</option>
            <option value="bottom">Inferior</option>
          </select>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        placeholder="Escribe tu texto aquí..."
        className="editor-textarea"
        rows={4}
      />

      <div className="editor-preview">
        <h4>Vista Previa:</h4>
        <div className={`text-preview ${fontSize} ${position}`} style={{ color }}>
          {text || 'Texto de ejemplo'}
        </div>
      </div>
    </div>
  );
}