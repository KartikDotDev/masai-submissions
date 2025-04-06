const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');

let page = 1;
const limit = 10;
let isLoading = false;

async function fetchPhotos(page, limit) {
  const start = (page - 1) * limit;
  const url = `https://jsonplaceholder.typicode.com/photos?_start=${start}&_limit=${limit}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch photos");
    return await res.json();
  } catch (err) {
    loader.textContent = "Failed to load more photos.";
    console.error(err);
    return [];
  }
}

function renderPhotos(photos) {
  photos.forEach(photo => {
    const div = document.createElement('div');
    div.className = 'photo';
    div.innerHTML = `
      <img src="${photo.thumbnailUrl}" alt="${photo.title}" />
      <p>${photo.title}</p>
    `;
    gallery.appendChild(div);
  });
}

async function loadMore() {
  if (isLoading) return;
  isLoading = true;
  loader.style.display = 'block';

  const photos = await fetchPhotos(page, limit);
  renderPhotos(photos);
  page++;

  isLoading = false;
  loader.style.display = 'none';
}


window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
    loadMore();
  }
});


loadMore();

