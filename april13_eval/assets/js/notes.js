import { db } from './firebase-config.js';
import {
  collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, orderBy, onSnapshot, serverTimestamp, where
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const noteForm = document.getElementById('note-form');
const successMessage = document.getElementById('success-message');

if (noteForm) {
  const draft = getDraftFromLocalStorage();
  if (draft) {
    document.getElementById('note-title').value = draft.title || '';
    document.getElementById('note-description').value = draft.description || '';
    document.getElementById('note-priority').value = draft.priority || 'Medium';
    console.log("Draft loaded from LocalStorage.");
  }

  noteForm.addEventListener('input', (e) => {
    const formData = new FormData(noteForm);
    const noteData = {
      title: formData.get('note-title'),
      description: formData.get('note-description'),
      priority: formData.get('note-priority'),
    };
    saveDraftToLocalStorage(noteData);
  });

  noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('note-title').value.trim();
    const description = document.getElementById('note-description').value.trim();
    if (!title || !description) {
      alert('Please fill in both Title and Description.');
      return;
    }

    const noteData = {
      title: title,
      description: description,
      priority: document.getElementById('note-priority').value,
      tags: Array.from(document.querySelectorAll('input[name="note-tags"]:checked')).map(cb => cb.value),
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "notes"), noteData);
      console.log("Note written to Firebase with ID: ", docRef.id);

      noteForm.reset();
      clearDraftFromLocalStorage();

      if (successMessage) {
        successMessage.textContent = 'Your note has been successfully saved!';
        successMessage.style.display = 'block';
        setTimeout(() => { successMessage.style.display = 'none'; }, 3000);
      }

    } catch (error) {
      console.error("Error adding note: ", error);
      alert("Failed to save note. Please try again.");
      saveNotesToLocalStorage([...getNotesFromLocalStorage(), { ...noteData, id: `local_${Date.now()}` }]);
    }
  });
}


const notesDisplayArea = document.getElementById('notes-display-area');
const filterPriority = document.getElementById('filter-priority');
const sortBy = document.getElementById('sort-by');
const searchBar = document.getElementById('search-bar');

let allNotes = [];
let currentFilter = { priority: 'all', tags: [], search: '' };
let currentSort = 'date_desc';

function displayNotes(notesToDisplay) {
  if (!notesDisplayArea) return;
  notesDisplayArea.innerHTML = ''; // Clear all the existing notes

  if (notesToDisplay.length === 0) {
    notesDisplayArea.innerHTML = '<p>No notes found matching your criteria.</p>';
    return;
  }

  notesToDisplay.forEach(note => {
    const noteElement = document.createElement('article');
    noteElement.classList.add('note-entry');
    noteElement.dataset.id = note.id;

    let dateString = 'Date not available';
    if (note.createdAt && note.createdAt.toDate) {
      try {
        dateString = note.createdAt.toDate().toLocaleString();
      } catch (e) {
        console.warn("Could not format date for note:", note.id, e);
        dateString = note.createdAt.toString();
      }
    } else if (note.createdAt) {
      dateString = new Date(note.createdAt).toLocaleString();
    }


    noteElement.innerHTML = `
            <h3>${escapeHTML(note.title)}</h3>
            <p>${escapeHTML(note.description)}</p>
            <div class="note-meta">
                <span>Priority: ${escapeHTML(note.priority)}</span>
                ${note.tags && note.tags.length > 0 ? `<span>Tags: ${note.tags.map(escapeHTML).join(', ')}</span>` : ''}
                <small>Created: ${dateString}</small>
            </div>
            ${note.imageUrl ? `<img src="${escapeHTML(note.imageUrl)}" alt="Note image" style="max-width: 100%; height: auto;">` : ''}
            <div class="note-actions">
                <button class="edit-button" data-id="${note.id}">Edit</button>
                <button class="delete-button" data-id="${note.id}">Delete</button>
            </div>
        `;
    notesDisplayArea.appendChild(noteElement);
  });

  addEditDeleteListeners();
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}


function applyFiltersAndSort() {
  let filteredNotes = [...allNotes];

  if (currentFilter.priority !== 'all') {
    filteredNotes = filteredNotes.filter(note => note.priority === currentFilter.priority);
  }

  if (currentFilter.tags.length > 0) {
    filteredNotes = filteredNotes.filter(note =>
      currentFilter.tags.every(tag => note.tags && note.tags.includes(tag))
    );
  }

  if (currentFilter.search) {
    const searchTermLower = currentFilter.search.toLowerCase();
    filteredNotes = filteredNotes.filter(note =>
      note.title.toLowerCase().includes(searchTermLower)
    );
  }

  filteredNotes.sort((a, b) => {
    switch (currentSort) {
      case 'priority':
        const priorityMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0);
      case 'date_asc':
        const dateA_asc = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const dateB_asc = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return dateA_asc - dateB_asc;
      case 'date_desc':
      default:
        const dateA_desc = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const dateB_desc = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return dateB_desc - dateA_desc; // Newest first
    }
  });

  displayNotes(filteredNotes);
}


function loadNotesRealtime() {
  if (!notesDisplayArea) return;

  const notesCollection = collection(db, "notes");
  const q = query(notesCollection, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    allNotes = [];
    querySnapshot.forEach((doc) => {
      allNotes.push({ id: doc.id, ...doc.data() });
    });
    console.log("Notes loaded/updated from Firebase:", allNotes.length);
    saveNotesToLocalStorage(allNotes);
    applyFiltersAndSort();
  }, (error) => {
    console.error("Error fetching notes in real-time: ", error);
    alert("Could not connect to Firebase. Loading notes from local backup (if available).");
    allNotes = getNotesFromLocalStorage();
    console.log("Notes loaded from LocalStorage:", allNotes.length);
    applyFiltersAndSort();
  });

}

function addEditDeleteListeners() {
  if (!notesDisplayArea) return;

  notesDisplayArea.addEventListener('click', async (e) => {
    const target = e.target;
    const noteId = target.dataset.id;

    if (!noteId) return;

    if (target.classList.contains('delete-button')) {
      if (confirm('Are you sure you want to delete this note?')) {
        try {
          const noteRef = doc(db, "notes", noteId);
          await deleteDoc(noteRef);
          console.log("Note deleted from Firebase:", noteId);
        } catch (error) {
          console.error("Error deleting note:", error);
          alert("Failed to delete note.");
        }
      }
    }

    if (target.classList.contains('edit-button')) {
      const noteToEdit = allNotes.find(note => note.id === noteId);
      if (noteToEdit) {
        const queryParams = new URLSearchParams({
          id: noteId,
          title: noteToEdit.title,
          description: noteToEdit.description,
          priority: noteToEdit.priority,
          tags: noteToEdit.tags ? noteToEdit.tags.join(',') : ''
        }).toString();
        window.location.href = `create.html?${queryParams}`;
      }

    }
  });
}

async function updateNoteInFirebase(noteId, updatedData) {
  try {
    const noteRef = doc(db, "notes", noteId);
    await updateDoc(noteRef, updatedData);
    console.log("Note updated in Firebase:", noteId);
    return true;
  } catch (error) {
    console.error("Error updating note:", error);
    alert("Failed to update note.");
    return false;
  }
}


if (notesDisplayArea) {
  loadNotesRealtime();

  if (filterPriority) {
    filterPriority.addEventListener('change', (e) => {
      currentFilter.priority = e.target.value;
      applyFiltersAndSort();
    });
  }

  if (sortBy) {
    sortBy.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFiltersAndSort();
    });
  }

  if (searchBar) {
    searchBar.addEventListener('input', (e) => {
      currentFilter.search = e.target.value.trim();
      applyFiltersAndSort();
    });
  }
}

if (noteForm && window.location.search.includes('id=')) {
  const urlParams = new URLSearchParams(window.location.search);
  const noteId = urlParams.get('id');
  const title = urlParams.get('title');
  const description = urlParams.get('description');
  const priority = urlParams.get('priority');
  const tags = urlParams.get('tags')?.split(',') || [];

  document.getElementById('note-title').value = title || '';
  document.getElementById('note-description').value = description || '';
  document.getElementById('note-priority').value = priority || 'Medium';
  tags.forEach(tagValue => {
    const checkbox = document.querySelector(`input[name="note-tags"][value="${tagValue}"]`);
    if (checkbox) checkbox.checked = true;
  });


  const submitButton = noteForm.querySelector('button[type="submit"]');
  submitButton.textContent = 'Update Note';

  noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (submitButton.textContent !== 'Update Note') return;


    const updatedTitle = document.getElementById('note-title').value.trim();
    const updatedDescription = document.getElementById('note-description').value.trim();
    if (!updatedTitle || !updatedDescription) {
      alert('Please fill in both Title and Description.');
      return;
    }

    const updatedData = {
      title: updatedTitle,
      description: updatedDescription,
      priority: document.getElementById('note-priority').value,
      tags: Array.from(document.querySelectorAll('input[name="note-tags"]:checked')).map(cb => cb.value),
    };

    const success = await updateNoteInFirebase(noteId, updatedData);

    if (success) {
      alert("Note updated successfully!");
      noteForm.reset();
      submitButton.textContent = 'Create Note';
      clearDraftFromLocalStorage();
      window.location.href = 'view.html';
    }
  }, { capture: true });
}
