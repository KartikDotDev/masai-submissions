import { useState, useEffect } from 'react'
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://your-firebase-db.firebaseio.com/tasks.json"
      );

      const data = response.data;

      if (data) {
        const parsedTasks = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setTasks(parsedTasks);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks. Please try again later.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Task List</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.name || "Unnamed Task"}</li>
        ))}
      </ul>
    </div>
  );
}

export default App
