function saveDraftToLocalStorage(noteData) {
  try {
    localStorage.setItem('draftNote', JSON.stringify(noteData));
  } catch (error) {
    console.error("Error saving draft to LocalStorage:", error);
  }
}

function getDraftFromLocalStorage() {
  try {
    const draft = localStorage.getItem('draftNote');
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error("Error getting draft from LocalStorage:", error);
    return null;
  }
}

function clearDraftFromLocalStorage() {
  try {
    localStorage.removeItem('draftNote');
  } catch (error) {
    console.error("Error clearing draft from LocalStorage:", error);
  }
}

function saveNotesToLocalStorage(notesArray) {
  try {
    localStorage.setItem('notes', JSON.stringify(notesArray));
  } catch (error) {
    console.error("Error saving notes to LocalStorage:", error);
  }
}

function getNotesFromLocalStorage() {
  try {
    const notes = localStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.error("Error getting notes from LocalStorage:", error);
    return [];
  }
}

function clearAllNotesFromLocalStorage() {
  try {
    localStorage.removeItem('notes');
    console.log("All notes cleared from LocalStorage.");
  } catch (error) {
    console.error("Error clearing all notes from LocalStorage:", error);
  }
}

