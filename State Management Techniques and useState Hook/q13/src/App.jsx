import { useState } from 'react'

function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);

  const addItem = () => {
    const trimmedName = itemName.trim();
    const qty = parseInt(quantity, 10);

    if (!trimmedName || isNaN(qty) || qty < 1) return;

    const newItem = {
      id: Date.now(),
      name: trimmedName,
      quantity: qty,
    };

    setItems((prev) => [...prev, newItem]);
    setItemName("");
    setQuantity(1);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>🛒 Shopping List</h2>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Item name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ marginRight: "10px", width: "60px" }}
        />
        <button onClick={addItem}>Add</button>
      </div>

      {items.length > 0 ? (
        <ul style={{ padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                listStyle: "none",
                padding: "8px",
                marginBottom: "8px",
                backgroundColor: "#f5f5f5",
                display: "flex",
                justifyContent: "space-between",
                borderRadius: "5px",
              }}
            >
              <span>
                {item.name} – {item.quantity}
              </span>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items in the list.</p>
      )}

      {items.length > 0 && (
        <button onClick={clearAll} style={{ marginTop: "10px" }}>
          Clear All
        </button>
      )}
    </div>
  );
}

export default App
