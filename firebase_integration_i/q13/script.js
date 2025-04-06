const BASE_URL = ""; // removed for security purposes

const userForm = document.getElementById("userForm");
const editForm = document.getElementById("editForm");
const userTable = document.getElementById("userTable");
const message = document.getElementById("message");

let currentEditId = null;

function showMessage(text, error = false) {
  message.textContent = text;
  message.style.color = error ? "red" : "green";
}

async function fetchUsers() {
  userTable.innerHTML = "";

  try {
    const res = await fetch(`${BASE_URL}.json`);
    const data = await res.json();

    if (!data) return;

    for (const id in data) {
      const { name, email } = data[id];

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${name}</td>
        <td>${email}</td>
        <td>
          <button class="edit-btn" onclick="loadEditForm('${id}', '${name}', '${email}')">Edit</button>
        </td>
      `;
      userTable.appendChild(row);
    }
  } catch (err) {
    showMessage("Failed to load users", true);
  }
}

userForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !email) return showMessage("All fields required", true);

  try {
    await fetch(`${BASE_URL}.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });
    userForm.reset();
    showMessage("User added!");
    fetchUsers();
  } catch (err) {
    showMessage("Error adding user", true);
  }
});

window.loadEditForm = function(id, name, email) {
  currentEditId = id;
  document.getElementById("editName").value = name;
  document.getElementById("editEmail").value = email;
  editForm.style.display = "block";
  userForm.style.display = "none";
};

// Submit edit form
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("editName").value.trim();
  const email = document.getElementById("editEmail").value.trim();

  try {
    await fetch(`${BASE_URL}/${currentEditId}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });

    showMessage("User updated!");
    editForm.reset();
    editForm.style.display = "none";
    userForm.style.display = "block";
    fetchUsers();
  } catch (err) {
    showMessage("Update failed", true);
  }
});

fetchUsers();

