// File: /pages/admin/products.js

import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ProductList from '../../components/ProductList';
import AddProduct from '../../components/AddProduct';

const initialProducts = [
  {
    id: 1,
    image: '/images/nescafe.png',
    name: 'Nescafe',
    stock: 9,
    description: 'This is a coffee bean',
    createdBy: 'John Doe',
    createdAt: 'Apr 28,2023 @ 06:12:59 AM',
    updatedAt: 'Apr 28,2023 @ 06:12:59 AM',
  },
  {
    id: 2,
    image: '/images/kitkat.png',
    name: 'Kitkat',
    stock: 14,
    description: 'This is a chocolate',
    createdBy: 'John Doe',
    createdAt: 'Apr 28,2023 @ 06:12:38 AM',
    updatedAt: 'Apr 28,2023 @ 06:12:38 AM',
  },
  {
    id: 3,
    image: '/images/milo.png',
    name: 'Milo',
    stock: 0,
    description: 'This is an energy drink',
    createdBy: 'John Doe',
    createdAt: 'Apr 28,2023 @ 06:12:05 AM',
    updatedAt: 'Apr 28,2023 @ 06:12:05 AM',
  },
];

export default function ProductsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [products, setProducts] = useState(initialProducts);

  // Delete handler
  const handleDelete = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: 24 }}>
        {showAddForm ? (
          <button
            onClick={() => setShowAddForm(false)}
            style={{
              background: '#e75480',
              color: '#fff',
              padding: '8px 16px',
              border: 'none',
              borderRadius: 5,
              marginBottom: 16,
              cursor: 'pointer',
            }}
          >
            ← Back to Product List
          </button>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              background: '#e75480',
              color: '#fff',
              padding: '8px 16px',
              border: 'none',
              borderRadius: 5,
              marginBottom: 16,
              cursor: 'pointer',
            }}
          >
            + Add Product
          </button>
        )}
      </div>

      {showAddForm ? (
        // Centering and sizing wrapper for AddProduct
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
            background: "#f7f7f7"
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              padding: 32,
              minWidth: 400,
              maxWidth: 420,
              width: "100%"
            }}
          >
            <AddProduct
              onCreate={() => {
                setShowAddForm(false);
              }}
            />
          </div>
        </div>
      ) : (
        <ProductList products={products} onDelete={handleDelete} />
      )}
    </AdminLayout>
  );
}
