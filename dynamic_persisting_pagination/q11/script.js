const API_URL = "https://jsonplaceholder.typicode.com/users";
const userList = document.getElementById("user-list");
const sortSelect = document.getElementById("sort");
const errorBox = document.getElementById("error");

async function fetchUsers() {
  try {
    errorBox.textContent = "";

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch users.");

    const users = await response.json();
    renderUsers(users);
  } catch (err) {
    errorBox.textContent = err.message;
  }
}

function sortUsers(users, key) {
  return users.sort((a, b) => {
    const valA = key.split('.').reduce((acc, curr) => acc?.[curr], a) || "";
    const valB = key.split('.').reduce((acc, curr) => acc?.[curr], b) || "";
    return valA.localeCompare(valB);
  });
}

function renderUsers(users) {
  const sortKey = sortSelect.value;
  const sortedUsers = sortKey ? sortUsers(users, sortKey) : users;

  userList.innerHTML = "";
  sortedUsers.forEach(user => {
    const div = document.createElement("div");
    div.className = "user-card";
    div.innerHTML = `
      <strong>${user.name}</strong><br>
      Email: ${user.email}<br>
      Company: ${user.company.name}
    `;
    userList.appendChild(div);
  });
}

sortSelect.addEventListener("change", fetchUsers);

fetchUsers();

