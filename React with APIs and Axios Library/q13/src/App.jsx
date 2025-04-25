import { useState } from 'react'

function App() {
  const [emails, setEmails] = useState([{value: "", error: ""}]);
  const handleChange = (index, newValue) => {
    const updatedEmails = [...emails];
    updatedEmails[index].value = newValue;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    updatedEmails[index].error = newValue && !emailRegex.test(newValue) ? "Invalud email format" :"";
    setEmails(updatedEmails);
  }

  const addEmailField = () => {
    setEmails([...emails, {value: "", error: ""}]);
  };
  
  return (
    <>
      <form>
        {emails.map((email, idx) => {
          <div key={idx}>
            <input 
              type='text'
              placeholder='Enter email'
              value={email.value}
              onChange={(e) => handleChange(idx, e.target.value)}
            />
          </div>
        })}
        <button type='button' onClick={addEmailField}>
          Add email
        </button>
      </form>

    <h3> Entered Emails: </h3>
    <ul>
      {emails.map((email, idx) => {
        email.value && !email.error ? (
          <li key={idx}> {email.value} </li>
        ): null
      })}
    </ul>
    </>
  );
}

export default App
