const API_URL = "https://jsonplaceholder.typicode.com/users";
const USERS_PER_PAGE = 6;
const TOTAL_USERS = 10; 
const TOTAL_PAGES = Math.ceil(TOTAL_USERS / USERS_PER_PAGE);

const userContainer = document.getElementById("user-container");
const paginationContainer = document.getElementById("pagination-buttons");
const errorMessage = document.getElementById("error-message");

let currentPage = 1;


async function fetchUsers(page) {
  try {
    errorMessage.textContent = "";
    const response = await fetch(`${API_URL}?_page=${page}&_limit=${USERS_PER_PAGE}`);
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    renderUsers(data);
    renderPagination(page);
  } catch (err) {
    errorMessage.textContent = err.message;
  }
}


function renderUsers(users) {
  userContainer.innerHTML = "";
  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "user-card";
    div.innerHTML = `
      <strong>${user.name}</strong><br>
      Email: ${user.email}<br>
      Phone: ${user.phone}<br>
      Company: ${user.company.name}
    `;
    userContainer.appendChild(div);
  });
}


function renderPagination(activePage) {
  paginationContainer.innerHTML = "";
  for (let i = 1; i <= TOTAL_PAGES; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === activePage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      fetchUsers(currentPage);
    });
    paginationContainer.appendChild(btn);
  }
}


fetchUsers(currentPage);

