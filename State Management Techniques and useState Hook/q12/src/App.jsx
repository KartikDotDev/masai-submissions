import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const handleIncrease = () => {
    setCount((prev) => prev + step);
  };

  const handleDecrease = () => {
    setCount((prev) => Math.max(0, prev - step));
  };

  const handleStepChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setStep(isNaN(value) || value < 1 ? 1 : value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Counter: {count}</h2>
      
      <label>
        Step:
        <input
          type="number"
          value={step}
          onChange={handleStepChange}
          min="1"
          style={{ marginLeft: "8px" }}
        />
      </label>

      <div style={{ marginTop: "10px" }}>
        <button onClick={handleIncrease}>Increase</button>
        <button onClick={handleDecrease} style={{ marginLeft: "10px" }}>
          Decrease
        </button>
      </div>
    </div>
  );
}

export default App
