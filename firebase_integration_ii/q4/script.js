
const DB_URL = ''; // removed for security purposes

const bookForm = document.getElementById('bookForm');
const booksTableBody = document.getElementById('booksTableBody');
const genreFilter = document.getElementById('genreFilter');
const availabilityFilter = document.getElementById('availabilityFilter');
const sortBy = document.getElementById('sortBy');
const pageInfo = document.getElementById('pageInfo');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');

let currentPage = 1;
const itemsPerPage = 5;

fetchBooks();

bookForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const book = {
    title: document.getElementById('title').value.trim(),
    author: document.getElementById('author').value.trim(),
    genre: document.getElementById('genre').value.trim(),
    publishedYear: +document.getElementById('publishedYear').value,
    available: document.getElementById('available').value === 'true',
  };

  await addBook(book);
  bookForm.reset();
  fetchBooks();
});

async function fetchBooks() {
  try {
    const res = await fetch(`${DB_URL}.json`);
    const data = await res.json();
    if (!data) return;

    const books = Object.entries(data).map(([id, book]) => ({ id, ...book }));
    renderBooks(books);
  } catch (err) {
    console.error('Failed to fetch books', err);
  }
}

function renderBooks(books) {
  booksTableBody.innerHTML = '';
  books.forEach(book => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.genre}</td>
      <td>${book.publishedYear}</td>
      <td>${book.available ? 'Yes' : 'No'}</td>
      <td>
        <button onclick="editBook('${book.id}')">Edit</button>
        <button onclick="deleteBook('${book.id}')">Delete</button>
      </td>
    `;
    booksTableBody.appendChild(tr);
  });
}

async function addBook(book) {
  try {
    const res = await fetch(`${DB_URL}.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    if (!res.ok) throw new Error('Failed to add book');
  } catch (err) {
    console.error(err);
  }
}

async function deleteBook(id) {
  try {
    const res = await fetch(`${DB_URL}/${id}.json`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete');
    fetchBooks();
  } catch (err) {
    console.error(err);
  }
}

