
import React, { useState, useRef, useEffect } from 'react';
import { TextElement } from '../types';

interface DraggableTextProps {
  element: TextElement;
  onPositionChange: (id: number, position: { x: number; y: number }) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const DraggableText: React.FC<DraggableTextProps> = ({ element, onPositionChange, containerRef }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragRef.current || !containerRef.current) return;
    setIsDragging(true);
    const textRect = dragRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - textRect.left,
      y: e.clientY - textRect.top,
    });
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current || !dragRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - containerRect.left - offset.x;
    const newY = e.clientY - containerRect.top - offset.y;
    
    // Boundary checks
    const textWidth = dragRef.current.offsetWidth;
    const textHeight = dragRef.current.offsetHeight;
    const boundedX = Math.max(0, Math.min(newX, containerRect.width - textWidth));
    const boundedY = Math.max(0, Math.min(newY, containerRect.height - textHeight));

    onPositionChange(element.id, { x: boundedX, y: boundedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  return (
    <div
      ref={dragRef}
      onMouseDown={handleMouseDown}
      className="absolute cursor-move select-none p-1 border border-dashed border-transparent hover:border-blue-500"
      style={{
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        color: element.color,
        fontSize: `${element.fontSize}px`,
        fontFamily: element.fontFamily,
        whiteSpace: 'nowrap',
      }}
    >
      {element.text || 'Văn bản mẫu'}
    </div>
  );
};

interface CertificatePreviewProps {
  templateUrl: string | null;
  textElements: TextElement[];
  onTextPositionChange: (id: number, position: { x: number; y: number }) => void;
  previewRef: React.RefObject<HTMLDivElement>;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  templateUrl,
  textElements,
  onTextPositionChange,
  previewRef
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-gray-200">
      <div
        ref={previewRef}
        className="relative shadow-lg"
        style={{
            width: '800px',
            height: '566px',
            backgroundImage: `url(${templateUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#fff'
        }}
      >
        {!templateUrl && (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                Xem trước mẫu chứng chỉ
            </div>
        )}
        {templateUrl && textElements.map(el => (
          <DraggableText
            key={el.id}
            element={el}
            onPositionChange={onTextPositionChange}
            containerRef={previewRef}
          />
        ))}
      </div>
    </div>
  );
};
