// pages/admin/login.js
import { useState } from 'react';
import { signIn, getSession, signOut } from 'next-auth/react';
import styles from '../../styles/adminlogin.module.css';

// Map NextAuth error codes to friendly messages
const errorMessages = {
  CredentialsSignin: '',
  default: ''
};

export default function AdminLogin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setLoading(true);

    const result = await signIn('admin-credentials', {
      redirect: false,
      username: formData.username,
      password: formData.password,
    });

    if (!result) {
      setGeneralError(errorMessages.default);
      setLoading(false);
      return;
    }

    if (result.error) {
      setGeneralError(errorMessages[result.error] || errorMessages.default);
      setLoading(false);
    } else {
      const session = await getSession();
      if (session?.user?.role !== 'admin') {
        setGeneralError('Only admins can log in here.');
        await signOut({ redirect: false });
        setLoading(false);
        return;
      }
      window.location.href = '/admin/dashboard';
    }
  };

  return (
    <div className={styles.loginBackground}>
      <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
        <h2 className={styles.title}>Inventory Management System</h2>
        <div className={styles.branding}>by CosmetiCore</div>
        <hr className={styles.underline} />
        {generalError && (
          <div style={{ color: '#d9534f', textAlign: 'center', marginBottom: '1rem' }}>
            {generalError}
          </div>
        )}
        <div className={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            required
            autoFocus
            disabled={loading}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className={styles.button}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}
