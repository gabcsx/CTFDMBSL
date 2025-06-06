
import styles from '../../styles/adminlogin.module.css';

export default function AdminLogin() {
  return (
    <div className={styles.loginBackground}>
      <form className={styles.form}>
        <h2 className={styles.title}>Inventory Management System</h2>
        <div className={styles.branding}>by CosmetiCore</div>
        <hr className={styles.underline} />
        <div className={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" placeholder="Enter username" />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter password" />
        </div>
        <button type="submit" className={styles.button}>Log In</button>
      </form>
    </div>
  );
}
