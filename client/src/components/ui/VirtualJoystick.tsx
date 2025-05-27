import { useRef, useEffect, useState } from "react";

interface VirtualJoystickProps {
  onMove: (direction: string | null) => void;
  size?: number;
}

export default function VirtualJoystick({ onMove, size = 120 }: VirtualJoystickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 });

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = size / 2 - 20; // Account for knob size

    let x = deltaX;
    let y = deltaY;

    if (distance > maxDistance) {
      const ratio = maxDistance / distance;
      x = deltaX * ratio;
      y = deltaY * ratio;
    }

    setKnobPosition({ x, y });

    // Determine direction
    const threshold = maxDistance * 0.3;
    let direction = '';

    if (Math.abs(x) > threshold) {
      direction += x > 0 ? 'right' : 'left';
    }
    if (Math.abs(y) > threshold) {
      direction += y > 0 ? 'down' : 'up';
    }

    onMove(direction || null);
  };

  const handleEnd = () => {
    setIsDragging(false);
    setKnobPosition({ x: 0, y: 0 });
    onMove(null);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      handleMove(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    handleEnd();
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative bg-gray-800/80 backdrop-blur-sm rounded-full border-4 border-gray-600 shadow-lg"
      style={{
        width: size,
        height: size,
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Outer ring */}
      <div className="absolute inset-2 rounded-full border-2 border-gray-500/50" />
      
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      
      {/* Knob */}
      <div
        ref={knobRef}
        className="absolute w-10 h-10 bg-white rounded-full border-4 border-gray-300 shadow-lg transition-all duration-75"
        style={{
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${knobPosition.x}px), calc(-50% + ${knobPosition.y}px))`,
          background: isDragging ? '#4F46E5' : '#FFFFFF'
        }}
      />
      
      {/* Directional indicators */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white/60 text-xs">↑</div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white/60 text-xs">↓</div>
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/60 text-xs">←</div>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60 text-xs">→</div>
      </div>
    </div>
  );
}
