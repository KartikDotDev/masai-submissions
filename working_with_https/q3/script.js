const userList = document.getElementById("userList");
const form = document.getElementById("userForm");
const message = document.getElementById("formMessage");

const API_URL = "https://mockapi.io/users";

async function fetchUsers() {
  try {
    const res = await fetch(API_URL);
    const users = await res.json();
    userList.innerHTML = "";
    users.forEach(user => {
      const li = document.createElement("li");
      li.textContent = `${user.name} — ${user.email}`;
      userList.appendChild(li);
    });
  } catch (err) {
    userList.innerHTML = "<li>Error loading users</li>";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !email) {
    message.textContent = "Both fields are required.";
    message.style.color = "red";
    return;
  }

  try {
    const existingRes = await fetch(API_URL);
    const existingUsers = await existingRes.json();
    const exists = existingUsers.some(user => user.email === email);

    if (exists) {
      message.textContent = "User with this email already exists.";
      message.style.color = "red";
      return;
    }

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });

    if (!res.ok) throw new Error("Failed to add user");

    message.textContent = "User added successfully!";
    message.style.color = "green";
    form.reset();
    fetchUsers(); 

  } catch (err) {
    message.textContent = `Error: ${err.message}`;
    message.style.color = "red";
  }
});


fetchUsers();

