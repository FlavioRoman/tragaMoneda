import { useState } from "react";
import Slot from "./Slot";

const SlotMachine = ({ symbols }) => {
  const [spinning, setSpinning] = useState(false);
  const [results, setResults] = useState(["", "", ""]);

  const handleSpin = () => {
    if (spinning) return;

    setSpinning(true);

    // Simular el giro de los carretes
    const spinDuration = 2000; // Duración del giro en milisegundos
    const spinInterval = 200; // Intervalo de cambio de símbolo en milisegundos
    const spins = spinDuration / spinInterval; // Número total de cambios de símbolo

    let spinCount = 0;
    const spinTimer = setInterval(() => {
      const newResults = results.map(
        () => symbols[Math.floor(Math.random() * symbols.length)]
      );
      setResults(newResults);

      spinCount++;
      if (spinCount >= spins) {
        clearInterval(spinTimer);
        setSpinning(false);
      }
    }, spinInterval);
  };

  return (
    <div className="slot-machine">
      <h1>Slot Machine</h1>
      <div className="reels">
        {results.map((symbol, index) => (
          <Slot key={index} symbol={symbol} />
        ))}
      </div>
      <button className="spin-button" onClick={handleSpin} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </button>
    </div>
  );
};

export default SlotMachine;
