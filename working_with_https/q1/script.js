async function fetchProducts() {
  const category = document.getElementById("category").value;
  const minPrice = document.getElementById("minPrice").value;
  const maxPrice = document.getElementById("maxPrice").value;
  const productList = document.getElementById("productList");
  const status = document.getElementById("status");

  productList.innerHTML = "";
  status.textContent = "Loading...";

  const url = `https://mockapi.io/products?category=${category}&min_price=${minPrice}&max_price=${maxPrice}&sort=asc`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch data");
    const products = await res.json();

    if (products.length === 0) {
      status.textContent = "No products found.";
      return;
    }

    status.textContent = "";

    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "product";
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
      `;
      productList.appendChild(card);
    });
  } catch (err) {
    status.textContent = "Error: " + err.message;
  }
}
