import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import styles from '../../styles/ViewUsers.module.css';

const initialUsers = [
  {
    id: 1,
    firstName: 'angelo',
    lastName: 'Doe',
    email: 'johndoe@yahoo.com',
    createdAt: 'Apr 28,2023 @ 06:06:49 AM',
    updatedAt: '6/2/2025, 2:00:27 AM',
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });

  // Edit Handler
  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  };

  // Delete Handler
  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  // Form Change Handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save Handler
  const handleSave = (e) => {
    e.preventDefault();
    setUsers(users.map(u =>
      u.id === editingUser.id
        ? { ...u, ...form, updatedAt: new Date().toLocaleString() }
        : u
    ));
    setEditingUser(null);
  };

  return (
    <AdminLayout adminName="Admin User">
      <div className={styles.viewUsersContainer}>
        <div className={styles.listHeader}>List of Users</div>
        <div className={styles.tableWrapper}>
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>FIRST NAME</th>
                <th>LAST NAME</th>
                <th>EMAIL</th>
                <th>CREATED AT</th>
                <th>UPDATED AT</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id}>
                  <td>{idx + 1}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.createdAt}</td>
                  <td>{user.updatedAt}</td>
                  <td>
                    <a href="#" onClick={() => handleEdit(user)}>Edit</a> |{' '}
                    <a
                      href="#"
                      style={{ color: 'red' }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(user.id);
                      }}
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.userCount}>{users.length} USERS</div>
        </div>
      </div>

      {/* MODAL */}
      {editingUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              Update {editingUser.firstName} {editingUser.lastName}
            </div>
            <form onSubmit={handleSave} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>FIRST NAME:</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className={styles.modalInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>LAST NAME:</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className={styles.modalInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>EMAIL ADDRESS:</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={styles.modalInput}
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setEditingUser(null)}
                >
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
    </AdminLayout>
  );
}
