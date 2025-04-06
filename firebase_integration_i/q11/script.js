const firebaseURL = "" // removed for better securty 
const userTableBody = document.getElementById("userTableBody");
const errorMessage = document.getElementById("errorMessage");

async function fetchUsers() {
  try {
    const response = await fetch(firebaseURL);
    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();

    if (!data) {
      userTableBody.innerHTML = "<tr><td colspan='2'>No users found</td></tr>";
      return;
    }

    userTableBody.innerHTML = "";

    for (const key in data) {
      const user = data[key];
      const row = document.createElement("tr");
      row.innerHTML = `<td>${user.name}</td><td>${user.email}</td>`;
      userTableBody.appendChild(row);
    }

  } catch (err) {
    errorMessage.textContent = `Error: ${err.message}`;
  }
}

fetchUsers();

