import { useEffect, useRef } from "react";
import { useControls } from "../../lib/stores/useControls";
import VirtualJoystick from "./VirtualJoystick";
import { Button } from "./button";

export default function TouchControls() {
  const { 
    setVirtualInput, 
    virtualInputs 
  } = useControls();

  // Attack button handlers
  const handleAttackStart = (type: string) => {
    setVirtualInput(type, true);
  };

  const handleAttackEnd = (type: string) => {
    setVirtualInput(type, false);
  };

  // Prevent context menu on long press
  useEffect(() => {
    const preventContextMenu = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', preventContextMenu);
    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Virtual Joystick - Bottom Left */}
      <div className="absolute bottom-8 left-8 pointer-events-auto">
        <VirtualJoystick
          onMove={(direction) => {
            // Reset all movement inputs
            setVirtualInput('forward', false);
            setVirtualInput('backward', false);
            setVirtualInput('leftward', false);
            setVirtualInput('rightward', false);

            // Set active direction
            if (direction) {
              if (direction.includes('up')) setVirtualInput('forward', true);
              if (direction.includes('down')) setVirtualInput('backward', true);
              if (direction.includes('left')) setVirtualInput('leftward', true);
              if (direction.includes('right')) setVirtualInput('rightward', true);
            }
          }}
        />
      </div>

      {/* Attack Buttons - Bottom Right */}
      <div className="absolute bottom-8 right-8 pointer-events-auto">
        <div className="grid grid-cols-2 gap-3">
          {/* High Punch */}
          <Button
            onTouchStart={() => handleAttackStart('punchHigh')}
            onTouchEnd={() => handleAttackEnd('punchHigh')}
            onMouseDown={() => handleAttackStart('punchHigh')}
            onMouseUp={() => handleAttackEnd('punchHigh')}
            className={`w-16 h-16 rounded-full text-2xl font-bold transition-all duration-100 ${
              virtualInputs.punchHigh 
                ? 'bg-red-600 scale-95' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
            style={{ touchAction: 'none' }}
          >
            👊
          </Button>

          {/* High Kick */}
          <Button
            onTouchStart={() => handleAttackStart('kickHigh')}
            onTouchEnd={() => handleAttackEnd('kickHigh')}
            onMouseDown={() => handleAttackStart('kickHigh')}
            onMouseUp={() => handleAttackEnd('kickHigh')}
            className={`w-16 h-16 rounded-full text-2xl font-bold transition-all duration-100 ${
              virtualInputs.kickHigh 
                ? 'bg-blue-600 scale-95' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            style={{ touchAction: 'none' }}
          >
            🦵
          </Button>

          {/* Low Punch */}
          <Button
            onTouchStart={() => handleAttackStart('punchLow')}
            onTouchEnd={() => handleAttackEnd('punchLow')}
            onMouseDown={() => handleAttackStart('punchLow')}
            onMouseUp={() => handleAttackEnd('punchLow')}
            className={`w-16 h-16 rounded-full text-2xl font-bold transition-all duration-100 ${
              virtualInputs.punchLow 
                ? 'bg-yellow-600 scale-95' 
                : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
            style={{ touchAction: 'none' }}
          >
            ✊
          </Button>

          {/* Low Kick */}
          <Button
            onTouchStart={() => handleAttackStart('kickLow')}
            onTouchEnd={() => handleAttackEnd('kickLow')}
            onMouseDown={() => handleAttackStart('kickLow')}
            onMouseUp={() => handleAttackEnd('kickLow')}
            className={`w-16 h-16 rounded-full text-2xl font-bold transition-all duration-100 ${
              virtualInputs.kickLow 
                ? 'bg-green-600 scale-95' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
            style={{ touchAction: 'none' }}
          >
            🥾
          </Button>
        </div>
      </div>

      {/* Block Button - Top Right of attack buttons */}
      <div className="absolute bottom-40 right-12 pointer-events-auto">
        <Button
          onTouchStart={() => handleAttackStart('block')}
          onTouchEnd={() => handleAttackEnd('block')}
          onMouseDown={() => handleAttackStart('block')}
          onMouseUp={() => handleAttackEnd('block')}
          className={`w-20 h-12 rounded-lg text-lg font-bold transition-all duration-100 ${
            virtualInputs.block 
              ? 'bg-purple-600 scale-95' 
              : 'bg-purple-500 hover:bg-purple-600'
          }`}
          style={{ touchAction: 'none' }}
        >
          🛡️ BLOCK
        </Button>
      </div>
    </div>
  );
}
