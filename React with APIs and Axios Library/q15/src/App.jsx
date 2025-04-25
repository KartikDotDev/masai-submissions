import React, { useState, useEffect } from "react";
import axios from "axios";

// removed before pushing on github
const FIREBASE_URL = "";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      errs.email = "Invalid email format";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${FIREBASE_URL}.json`);
      const data = res.data || {};
      const parsed = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));
      setUsers(parsed);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editingUserId) {
        await axios.patch(`${FIREBASE_URL}/${editingUserId}.json`, form);
        setEditingUserId(null);
      } else {
        await axios.post(`${FIREBASE_URL}.json`, form);
      }
      setForm({ name: "", email: "" });
      fetchUsers();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditingUserId(user.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${FIREBASE_URL}/${id}.json`);
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Management System</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
        </div>
        <div>
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
        </div>
        <button type="submit">{editingUserId ? "Update User" : "Add User"}</button>
      </form>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> - {user.email}
            <button onClick={() => handleEdit(user)} style={{ marginLeft: "10px" }}>
              Edit
            </button>
            <button onClick={() => handleDelete(user.id)} style={{ marginLeft: "5px" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

