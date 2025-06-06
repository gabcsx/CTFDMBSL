import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ProductList from '../../components/ProductList';
import styles from '../../styles/ViewUsers.module.css';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    featured: false,
    stock: 0,
    price: 0,
    image: null,
  });

  useEffect(() => {
    fetch('/api/product-manager')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Failed to load products:', err));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      const res = await fetch('/api/product-manager', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        console.error('Failed to delete product');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = async (updatedProduct) => {
    const confirmUpdate = window.confirm('Are you sure you want to save these changes?');
    if (!confirmUpdate) return;

    try {
      const res = await fetch('/api/product-manager', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      if (res.ok) {
        const savedProduct = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
        );
      } else {
        console.error('Failed to update product');
      }
    } catch (err) {
      console.error('Edit error:', err);
    }
  };

  const handleAddProduct = async () => {
    const formData = new FormData();
    for (let key in newProduct) {
      formData.append(key, newProduct[key]);
    }

    try {
      const res = await fetch('/api/product-manager', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const addedProduct = await res.json();
        setProducts((prev) => [...prev, addedProduct]);
        setShowAddModal(false);
        setNewProduct({
          name: '',
          description: '',
          category: '',
          featured: false,
          stock: 0,
          price: 0,
          image: null,
        });
      } else {
        console.error('Failed to add product');
      }
    } catch (err) {
      console.error('Add error:', err);
    }
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => setShowAddModal(true)}
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
      </div>

      <ProductList products={products} onDelete={handleDelete} onEdit={handleEdit} />

      {showAddModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalBox}>
      <div className={styles.modalHeader}>
        Add Product
      </div>
      <form
        className={styles.modalForm}
        onSubmit={(e) => {
          e.preventDefault();
          handleAddProduct();
        }}
      >
        <div className={styles.formGroup}>
          <label>Product Name:</label>
          <input
            type="text"
            className={styles.modalInput}
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description:</label>
          <textarea
            className={styles.modalInput}
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Category:</label>
          <input
            type="text"
            className={styles.modalInput}
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup} style={{ justifyContent: 'flex-start' }}>
  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <input
      type="checkbox"
      checked={newProduct.featured}
      onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
    />
    Featured
  </label>
</div>

        <div className={styles.formGroup}>
          <label>Stock:</label>
          <input
            type="number"
            className={styles.modalInput}
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
            min={0}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Price (₱):</label>
          <input
            type="number"
            className={styles.modalInput}
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
            min={0}
            step="0.01"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Image:</label>
          <input
            type="file"
            className={styles.modalInput}
            accept="image/*"
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
            required
          />
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </button>
          <button type="submit" className={styles.okBtn}>
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </AdminLayout>
  );
}

