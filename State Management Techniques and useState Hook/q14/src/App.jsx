import { useState } from 'react'

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleAdd = () => {
    if (task.trim() === "") return; 

    setTasks([
      ...tasks,
      { id: Date.now(), text: task.trim(), completed: false }, 
    ]);
    setTask("");
  };

  const handleToggle = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id)); 
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>To-Do List</h2>

      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a task"
      />
      <button onClick={handleAdd}>Add Task</button>

      <ul style={{ padding: 0 }}>
        {tasks.map((t) => (
          <li
            key={t.id}
            style={{
              textDecoration: t.completed ? "line-through" : "none",
              listStyle: "none",
              marginTop: "10px"
            }}
          >
            <span
              onClick={() => handleToggle(t.id)}
              style={{ cursor: "pointer", marginRight: "10px" }}
            >
              {t.text}
            </span>
            <button onClick={() => handleDelete(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );

}

export default App
