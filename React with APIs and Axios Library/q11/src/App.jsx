import { useState } from 'react'

function App() {
  const [username, setUsername] = useState(undefined);
  const handleChange = (e) => {
    e.stopPropogation()
    setUsername(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!username.trim()) {
      alert("username can't be empty bruhh.");
      return ;
    }
    alert("submitted it");
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label> Username: </label>
        <input
          type="text"
          id = "username"
          value={username}
          onChange={handleChange}
        />
        <button type='submit'> Submit </button>
      </form>
    </>
  )
}

export default App
