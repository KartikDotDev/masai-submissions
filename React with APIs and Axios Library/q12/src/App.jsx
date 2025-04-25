import { useRef } from 'react'

function App() {
  const inputRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const val = inputRef.current.value;
    alert(val);
    inputRef.current.value = "";
  };
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type='text' ref={inputRef} placeholder='bla blaaa'/>
        <button type='submit'> Submit </button>
      </form>
    </>
  )
}

export default App
