const container = document.getElementById("todo-container");
const pagination = document.getElementById("pagination-buttons");

const LIMIT = 10;
let currentPage = 1;
const TOTAL_TODOS = 200;
const TOTAL_PAGES = Math.ceil(TOTAL_TODOS / LIMIT);

async function fetchTodos(page) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=${LIMIT}`);
  const data = await response.json();
  renderTodos(data);
  renderPagination(page);
}

function renderTodos(todos) {
  container.innerHTML = "";
  todos.forEach(todo => {
    const div = document.createElement("div");
    div.className = "todo";
    div.innerHTML = `
      <strong>${todo.title}</strong><br>
      Status: ${todo.completed ? "✅ Completed" : "❌ Pending"}
    `;
    container.appendChild(div);
  });
}


function renderPagination(activePage) {
  pagination.innerHTML = "";
  for (let i = 1; i <= TOTAL_PAGES; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === activePage) {
      btn.classList.add("active");
    }
    btn.addEventListener("click", () => {
      currentPage = i;
      fetchTodos(currentPage);
    });
    pagination.appendChild(btn);
  }
}


fetchTodos(currentPage);

