import { useState } from 'react';

const labelStyle = {
  display: 'block',
  marginBottom: 6,
  fontWeight: 600,
  color: '#333'
};
const inputStyle = {
  width: '100%',
  padding: 8,
  borderRadius: 4,
  border: '1px solid #ccc',
  marginBottom: 12
};
const buttonStyle = {
  background: "#E57393",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  padding: "10px 24px",
  fontWeight: 700,
  fontSize: 16,
  cursor: "pointer"
};

// Add your categories here
const CATEGORY_OPTIONS = [
  "Serum",
  "Toner",
  "Soap",
  "Moisturizer",
  "Cleanser"
];

export default function AddProduct({ onCreate }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: null,
    category: '', // Add this line
  });

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Add your create logic here, make sure to include category!
    onCreate(form);  // <-- Pass the entire form, including category
  };

  return (
    <form onSubmit={handleSubmit}
      style={{
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: 24,
        maxWidth: 500
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>PRODUCT NAME</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
          required
        />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>DESCRIPTION</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          style={{ ...inputStyle, minHeight: 60 }}
          required
        />
      </div>
      {/* CATEGORY DROPDOWN */}
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>CATEGORY</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          style={inputStyle}
          required
        >
          <option value="">Select category</option>
          {CATEGORY_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 32 }}>
        <label style={labelStyle}>PRODUCT IMAGE</label>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div style={{ textAlign: "right" }}>
        <button type="submit" style={buttonStyle}>
          + Create Product
        </button>
      </div>
    </form>
  );
}
