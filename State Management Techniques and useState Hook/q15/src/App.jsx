import { useState } from 'react'

const PRIORITY_ORDER = { High: 3, Medium: 2, Low: 1 };

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [completionFilter, setCompletionFilter] = useState("All");

  const addTask = () => {
    if (title.trim() === "") return;

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      priority,
      completed: false,
    };

    const updated = [...tasks, newTask].sort(
      (a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]
    );

    setTasks(updated);
    setTitle("");
    setPriority("Medium");
  };

  const toggleCompletion = (id) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    const priorityMatch =
      priorityFilter === "All" || task.priority === priorityFilter;
    const completionMatch =
      completionFilter === "All" ||
      (completionFilter === "Completed" && task.completed) ||
      (completionFilter === "Incomplete" && !task.completed);
    return priorityMatch && completionMatch;
  });

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>📋 Task Manager</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ marginRight: "10px" }}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <strong>Filters:</strong>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={{ margin: "0 10px" }}
        >
          <option value="All">All Priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select
          value={completionFilter}
          onChange={(e) => setCompletionFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Incomplete">Incomplete</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <p>No tasks to show.</p>
      ) : (
        <ul style={{ padding: 0 }}>
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              style={{
                listStyle: "none",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                backgroundColor: task.priority === "High" ? "#ffe0e0" : "#f4f4f4",
                textDecoration: task.completed ? "line-through" : "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                <strong>{task.title}</strong> –{" "}
                <em style={{ color: "#888" }}>{task.priority}</em>
              </span>
              <div>
                <button onClick={() => toggleCompletion(task.id)}>
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App
