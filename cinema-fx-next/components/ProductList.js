import React, { useState } from 'react';
import styles from '../styles/ViewUsers.module.css';

export default function ProductList({ products, onDelete, onEdit }) {
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const openModal = (product) => {
    setCurrentProduct(product);
    setShowModal(true);
  };

  const handleSave = () => {
    if (onEdit && currentProduct) {
      onEdit(currentProduct);
      setShowModal(false);
    }
  };

  return (
    <div className={styles.viewUsersContainer}>
      <div className={styles.listHeader}>List of Products</div>
      <div className={styles.tableWrapper}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>IMAGE</th>
              <th>PRODUCT NAME</th>
              <th>DESCRIPTION</th>
              <th>CATEGORY</th>
              <th>PRICE (₱)</th>
              <th>STOCK</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr key={product.id}>
                <td>{idx + 1}</td>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    width={40}
                    height={40}
                    style={{ objectFit: 'contain' }}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.category}</td>
                <td>₱{product.price?.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      openModal(product);
                    }}
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </a>
                  <a
                    href="#"
                    style={{ color: 'red' }}
                    onClick={(e) => {
                      e.preventDefault();
                      if (onDelete) onDelete(product.id);
                    }}
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.userCount}>{products.length} PRODUCTS</div>
      </div>

      {showModal && currentProduct && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalBox}>
      <div className={styles.modalHeader}>Edit Product</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className={styles.modalForm}
      >
        <div className={styles.formGroup}>
          <label>Description:</label>
          <textarea
            className={styles.modalInput}
            value={currentProduct.description}
            onChange={(e) =>
              setCurrentProduct({ ...currentProduct, description: e.target.value })
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label>Price (₱):</label>
          <input
            type="number"
            className={styles.modalInput}
            value={currentProduct.price}
            onChange={(e) =>
              setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label>Stock:</label>
          <input
            type="number"
            className={styles.modalInput}
            value={currentProduct.stock}
            onChange={(e) =>
              setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) })
            }
          />
        </div>

        <div className={styles.formGroup} style={{ justifyContent: 'flex-start' }}>
  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <input
      type="checkbox"
      checked={currentProduct.featured || false}
      onChange={(e) =>
        setCurrentProduct({ ...currentProduct, featured: e.target.checked })
      }
    />
    Featured
  </label>
</div>

        <div className={styles.modalActions}>
          <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>
            Cancel
          </button>
          <button type="submit" className={styles.okBtn}>
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}
