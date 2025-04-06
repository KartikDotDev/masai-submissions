const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    message.textContent = "All fields are required.";
    message.style.color = "red";
    return;
  }

  try {
    const response = await fetch("https://mockapi.io/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed.");
    }

    const data = await response.json();
    message.textContent = "Registration successful!";
    message.style.color = "green";
    form.reset();
  } catch (err) {
    message.textContent = `Error: ${err.message}`;
    message.style.color = "red";
  }
});

