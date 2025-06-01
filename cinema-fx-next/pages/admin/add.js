// File: /pages/admin/add.js

import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

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

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: null
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
    // TODO: Add your create logic here (API call, etc.)
    alert('Product created! (implement your logic here)');
    setForm({ name: '', description: '', image: null });
  };

  return (
    <AdminLayout>
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        background: "#f7f7f7"
      }}>
        <form onSubmit={handleSubmit}
          style={{
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            padding: 32,
            minWidth: 400,
            maxWidth: 420
          }}
        >
          <h2 style={{ color: '#E57393', fontWeight: 700, marginBottom: 24, textAlign: "left" }}>+ Create Product</h2>
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
      </div>
    </AdminLayout>
  );
}
