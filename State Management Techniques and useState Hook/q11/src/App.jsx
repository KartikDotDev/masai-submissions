import { useState } from 'react'

function ToggleMessage() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleMessage = () => setIsVisible((prev) => !prev);

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={toggleMessage}>
        {isVisible ? "Hide" : "Show"}
      </button>

      {isVisible && (
        <p style={{ marginTop: "10px" }}>
          Hello, welcome to React state management!
        </p>
      )}
    </div>
  );
}

function App() {

  return (
    <>
    <ToggleMessage />
    </>
  );
}

export default App
