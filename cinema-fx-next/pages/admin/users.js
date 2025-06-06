import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import styles from '../../styles/ViewUsers.module.css';
import { useSession } from 'next-auth/react';

export default function UsersPage() {
  const { data: session } = useSession();
  const currentUserEmail = session?.user?.email;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changingRoleUser, setChangingRoleUser] = useState(null);
  const [newRole, setNewRole] = useState('customer');

  // Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user from database
  const handleDelete = async (id) => {
    const userToDelete = users.find(user => user.id === id);
    if (!userToDelete) return;

    if (userToDelete.role === 'admin') {
    alert('Admin users cannot be deleted.');
    return;
  }

    // Prevent deleting current logged-in user
    if (userToDelete.email === currentUserEmail) {
      alert('You cannot delete yourself.');
      return;
    }

    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(user => user.id !== id));
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to delete user');
    }
  };

  const openRoleModal = (user) => {
    setChangingRoleUser(user);
    setNewRole(user.role);
  };

  const handleRoleChange = (e) => {
    setNewRole(e.target.value);
  };

  // Update role in database
  const saveRoleChange = async (e) => {
  e.preventDefault();

  // Prevent changing own role
  if (changingRoleUser.email === currentUserEmail) {
    alert('You cannot change your own role.');
    return;
  }

  if (!confirm(`Are you sure you want to change the role of ${changingRoleUser.username} to "${newRole}"?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/users/${changingRoleUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      const updatedUser = await res.json();
      setUsers(users.map(u => (u.id === updatedUser.id ? updatedUser : u)));
      setChangingRoleUser(null);
    } else {
      alert('Failed to update role');
    }
  } catch (error) {
    console.error(error);
    alert('Failed to update role');
  }
};

  if (loading) return <div>Loading users...</div>;

  return (
    <AdminLayout adminName="Admin User">
      <div className={styles.viewUsersContainer}>
        <div className={styles.listHeader}>List of Users</div>
        <div className={styles.tableWrapper}>
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>USERNAME</th>
                <th>EMAIL</th>
                <th>CREATED AT</th>
                <th>ADDRESS</th>
                <th>PHONE NUMBER</th>
                <th>ROLE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const isCurrentUser = user.email === currentUserEmail;
                return (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                    <td>{user.address || '-'}</td>
                    <td>{user.phone || '-'}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className={styles.changeRoleBtn}
                        onClick={() => openRoleModal(user)}
                        disabled={isCurrentUser}
                        style={isCurrentUser ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      >
                        Change Role
                      </button>{' '}
                      |{' '}
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(user.id)}
                        disabled={isCurrentUser}
                        style={{
                          color: 'red',
                          background: 'none',
                          border: 'none',
                          cursor: isCurrentUser ? 'not-allowed' : 'pointer',
                          opacity: isCurrentUser ? 0.5 : 1,
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className={styles.userCount}>{users.length} USERS</div>
        </div>
      </div>

      {/* Role Change Modal */}
      {changingRoleUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              Change Role for {changingRoleUser.username}
            </div>
            <form onSubmit={saveRoleChange} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>ROLE:</label>
                <select
                  name="role"
                  value={newRole}
                  onChange={handleRoleChange}
                  className={styles.modalInput}
                  disabled={changingRoleUser.email === currentUserEmail}
                >
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setChangingRoleUser(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.okBtn}
                  disabled={changingRoleUser.email === currentUserEmail}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
