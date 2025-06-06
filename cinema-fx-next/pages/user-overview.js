import Head from 'next/head';
import Header from '../components/Header';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function UserOverview() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState({
    username: '', // changed from fullname
    email: '',
    phone: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/user')
        .then((res) => res.json())
        .then((data) => {
          setUserData({
            username: data.username || '', // changed from fullname
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
          });
          setLoading(false);
        });
    }
  }, [status]);

  const handleChange = (e) => {
  const { name, value } = e.target;
  if (name === 'phone') {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    setUserData({ ...userData, [name]: digitsOnly });
  } else {
    setUserData({ ...userData, [name]: value });
  }
};

  const handleSave = async () => {
  // Check minimum length for phone number
  if (userData.phone.length < 11) {
    setMessage('Phone number must be 11 digits.');
    return;
  }

  setSaving(true);
  const res = await fetch('/api/user', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: userData.username,
      phone: userData.phone,
      address: userData.address,
    }),
  });
  const result = await res.json();
  setSaving(false);
  if (res.ok) {
    setMessage('Update complete');
    setIsEditing(false);
    setUserData({
      username: result.username || userData.username,
      email: result.email || userData.email,
      phone: result.phone || userData.phone,
      address: result.address || userData.address,
    });
  } else {
    setMessage(result.message || 'Update failed');
  }
};

  if (status === 'loading' || loading) {
    return (
      <>
        <Header />
        <main>
          <section className="account-creation">
            <h2>Loading...</h2>
          </section>
        </main>
      </>
    );
  }

  if (!session) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  return (
    <>
      <Head>
        <title>User Overview - Cinema SkinFX</title>
      </Head>

      <Header />

      <main>
        <section className="account-creation">
          <h2>Your Profile</h2>

          {message && (
            <p style={{ color: '#5cb85c', textAlign: 'center' }}>{message}</p>
          )}

          <div className="form-group">
            <label>Username</label> {/* changed label */}
            <input
              type="text"
              name="username" 
              value={userData.username}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="text" value={userData.email} readOnly />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
  type="tel"
  name="phone"
  value={userData.phone}
  onChange={handleChange}
  readOnly={!isEditing}
  maxLength={11} 
/>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={userData.address}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>

          {!isEditing ? (
            <button className="btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <button className="btn" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          )}

          <button
            className="btn"
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{ marginTop: '1rem' }}
          >
            Log Out
          </button>
        </section>
      </main>

      <footer>
        <p>
          &copy; 2025 Cinema SkinFX. Powered by CosmetiCore. All rights reserved.
        </p>
      </footer>

      <style jsx>{`
        form {
          display: flex;
          flex-direction: column;
        }
        .form-group {
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
        }
        label {
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        input {
          padding: 0.6rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        input[readonly] {
          background-color: #f5f5f5;
          color: #777;
          cursor: default;
        }
        .product-summary h3 {
          margin-bottom: 1rem;
          border-bottom: 2px solid #333;
          padding-bottom: 0.25rem;
        }
      `}</style>
    </>
  );
}
