const form = document.getElementById("userForm");
const message = document.getElementById("message");

const firebaseURL = ""; // remov3ed for securikty purposes

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !email) {
    message.textContent = "All fields are required.";
    message.classList.add("error");
    return;
  }

  const user = { name, email };

  try {
    const res = await fetch(firebaseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    if (!res.ok) throw new Error("Failed to add user");

    message.textContent = "User added successfully!";
    message.classList.remove("error");
    form.reset();

  } catch (err) {
    message.textContent = "Error: " + err.message;
    message.classList.add("error");
  }
});

