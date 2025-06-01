// components/ProductList.js
import React from 'react';
import styles from '../styles/ViewUsers.module.css'; // adjust if your CSS file is named differently

export default function ProductList({ products, onDelete }) {
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
              <th>STOCK</th>
              <th>DESCRIPTION</th>
              <th>SUPPLIERS</th>
              <th>CREATED BY</th>
              <th>CREATED AT</th>
              <th>UPDATED AT</th>
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
                <td>{product.stock}</td>
                <td>{product.description}</td>
                <td>{product.suppliers || '-'}</td>
                <td>{product.createdBy}</td>
                <td>{product.createdAt}</td>
                <td>{product.updatedAt}</td>
                <td>
                  <a href="#" style={{ marginRight: 8 }}>Edit</a>
                  <a
                    href="#"
                    style={{ color: 'red' }}
                    onClick={e => {
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
    </div>
  );
}
