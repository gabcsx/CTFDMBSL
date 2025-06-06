import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import styles from '../../styles/adminprofile.module.css';
import { useSession } from 'next-auth/react';

export default function UserOverview() {
  const { data: session } = useSession();

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // new state

  useEffect(() => {
    async function fetchUser() {
      if (!session?.user?.email) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/edit-admin?email=${encodeURIComponent(session.user.email)}`);
        const data = await res.json();

        setFirstName(data.username || '');
        setEmail(data.email || '');
        setAddress(data.address || '');
        setPhone(data.phone || '');
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
      setLoading(false);
    }
    fetchUser();
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editMode) {
      setEditMode(true);
      return;
    }

      
    if (phone.length !== 11) {
    alert('Phone number must be 11 digits');
    return;  
  }

    try {
      const res = await fetch(`/api/edit-admin/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          username: firstName,
          address,
          phone,
        }),
      });

      if (res.ok) {
        alert('Profile updated successfully!');
        setEditMode(false); // Exit edit mode on successful save
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  };

  if (loading) return <div>Loading your profile...</div>;

  return (
    <AdminLayout adminName="Admin User">
      <div className={styles.pageWrapper}>
        <div className={styles.centerCard}>
          <h2 className={styles.title}>Account Settings</h2>

          <form className={styles.profileForm} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formSection}>
                <label className={styles.label}>Username</label>
                <input
                  className={`${styles.input} ${!editMode ? styles.readOnly : ''}`}
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Enter your username"
                  readOnly={!editMode}
                />

                <label className={styles.label}>Email Address</label>
                <input
                  className={`${styles.input} ${!editMode ? styles.readOnly : ''}`}
                  type="email"
                  value={email}
                  readOnly
                  disabled
                />

                <label className={styles.label}>Address</label>
                <input
                  className={`${styles.input} ${!editMode ? styles.readOnly : ''}`}
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  readOnly={!editMode}
                />

                <label className={styles.label}>Phone Number</label>
<input
  className={`${styles.input} ${!editMode ? styles.readOnly : ''}`}
  type="tel"
  value={phone}
  placeholder="Enter your phone number"
  readOnly={!editMode}
  onChange={e => {
    
    const digitsOnly = e.target.value.replace(/\D/g, '');

    
    if (digitsOnly.length <= 11) {
      setPhone(digitsOnly);
    }
  }}
  minLength={11}
  maxLength={11}
  pattern="\d{11}"
  title="Phone number must be 11 digits"
/>
              </div>
            </div>

            <div className={styles.buttonRow}>
              <button type="submit" className={styles.saveBtn}>
                {editMode ? 'Save' : 'Edit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
