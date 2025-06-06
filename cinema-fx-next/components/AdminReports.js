// components/AdminReports.js

import styles from './AdminReports.module.css';

export default function AdminReports() {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <h3>Export Products</h3>
        <div>
          <button className={styles.btn}>EXCEL</button>
          <button className={styles.btn}>PDF</button>
        </div>
      </div>
      <div className={styles.card}>
        <h3>Export Deliveries</h3>
        <div>
          <button className={styles.btn}>EXCEL</button>
          <button className={styles.btn}>PDF</button>
        </div>
      </div>
      <div className={styles.card}>
        <h3>Export Purchase Orders</h3>
        <div>
          <button className={styles.btn}>EXCEL</button>
          <button className={styles.btn}>PDF</button>
        </div>
      </div>
      <div className={styles.card}>
        <h3>Export Users</h3>
        <div>
          <button className={styles.btn}>EXCEL</button>
          <button className={styles.btn}>PDF</button>
        </div>
      </div>
    </div>
  );
}
