const deleteUser = (key) => {
  fetch(`https://your-project-id.firebaseio.com/users/${key}.json`, {
    method: 'DELETE',
  })
  .then(response => {
    if (!response.ok) throw new Error('Failed to delete');
    return response.json();
  })
  .then(() => {
    console.log("User deleted successfully");
    // Remove the row from UI, assumed the id by myself 
    const row = document.getElementById(`row-${key}`);
    if (row) row.remove();
  })
  .catch(error => console.error("Error deleting user:", error));
};

