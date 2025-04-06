
const firebaseConfig = {
  apiKey: "", // removed
  authDomain: "", // removed
  projectId: "", // removed
  storageBucket: "", // removed
  messagingSenderId: "", // removed
  appId: "" // removed
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const novelsRef = db.collection("novels");

const tableBody = document.getElementById("novelTableBody");
const yearFilter = document.getElementById("yearFilter");
const sortPrice = document.getElementById("sortPrice");
const searchInput = document.getElementById("searchInput");

async function fetchNovels() {
  let query = novelsRef;

  const year = yearFilter.value;
  const sort = sortPrice.value;
  const searchText = searchInput.value.toLowerCase();

  if (year) {
    query = query.where("release_year", "==", parseInt(year));
  }

  if (sort) {
    query = query.orderBy("price", sort);
  }

  const snapshot = await query.get();
  let novels = snapshot.docs.map(doc => doc.data());

  if (searchText) {
    novels = novels.filter(novel =>
      novel.title.toLowerCase().includes(searchText) ||
      novel.author.toLowerCase().includes(searchText)
    );
  }

  renderTable(novels);
}

function renderTable(novels) {
  tableBody.innerHTML = "";
  novels.forEach(novel => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${novel.title}</td>
      <td>${novel.author}</td>
      <td>$${novel.price.toFixed(2)}</td>
      <td>${novel.release_year}</td>
      <td>${novel.genre}</td>
    `;
    tableBody.appendChild(tr);
  });
}

yearFilter.addEventListener("change", fetchNovels);
sortPrice.addEventListener("change", fetchNovels);
searchInput.addEventListener("input", fetchNovels);

fetchNovels();

