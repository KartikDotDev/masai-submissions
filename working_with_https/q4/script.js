const API_URL = "https://mockapi.io/tasks"; 
const taskList = document.getElementById("taskList");

const modal = document.getElementById("editModal");
const editTitle = document.getElementById("editTitle");
const editStatus = document.getElementById("editStatus");
const saveEdit = document.getElementById("saveEdit");
const closeModal = document.getElementById("closeModal");

let currentEditId = null;

async function fetchTasks() {
  try {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    renderTasks(tasks);
  } catch (err) {
    taskList.innerHTML = "<li>Error fetching tasks</li>";
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task";
    li.innerHTML = `
      <span>${task.title} - <em>${task.status}</em></span>
      <span>
        <button onclick="editTask('${task.id}', '${task.title}', '${task.status}')">Edit</button>
        <button onclick="deleteTask('${task.id}')">Delete</button>
      </span>
    `;
    taskList.appendChild(li);
  });
}

window.editTask = function(id, title, status) {
  currentEditId = id;
  editTitle.value = title;
  editStatus.value = status;
  modal.classList.remove("hidden");
};

saveEdit.addEventListener("click", async () => {
  const updatedTask = {
    title: editTitle.value.trim(),
    status: editStatus.value
  };

  try {
    const res = await fetch(`${API_URL}/${currentEditId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask)
    });

    if (!res.ok) throw new Error("Failed to update task");

    modal.classList.add("hidden");
    fetchTasks();
  } catch (err) {
    alert("Error updating task");
  }
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

window.deleteTask = async function(id) {
  const confirmDelete = confirm("Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Failed to delete task");

    fetchTasks();
  } catch (err) {
    alert("Error deleting task");
  }
};


fetchTasks();

