// pages/admin/users.js
import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import styles from "../../styles/ViewUsers.module.css";
import ConfirmModal from "../../components/ConfirmModal";
import { useSession } from "next-auth/react";

export default function UsersPage() {
  const { data: session } = useSession();
  const currentUserEmail = session?.user?.email;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // For Change Role
  const [changingRoleUser, setChangingRoleUser] = useState(null);
  const [newRole, setNewRole] = useState("customer");

  // For Delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
    setLoading(false);
  }

  // 1) DELETE LOGIC
  const handleDelete = (id) => {
    const u = users.find((u) => u.id === id);
    if (!u || u.email === currentUserEmail) return;
    setUserToDelete(u);
    setDeleteModalOpen(true);
  };
  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`/api/users/${userToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userToDelete.id));
      }
    } catch (err) {
      console.error(err);
    }
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // 2) ROLE CHANGE LOGIC
  const openRoleModal = (user) => {
    setChangingRoleUser(user);
    setNewRole(user.role);
  };
  const handleRoleChange = (e) => setNewRole(e.target.value);

  // directly save on form submit
  const saveRoleChange = async (e) => {
    e.preventDefault();
    if (!changingRoleUser || changingRoleUser.email === currentUserEmail) return;

    try {
      const res = await fetch(`/api/users/${changingRoleUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
      }
    } catch (err) {
      console.error(err);
    }
    // close the modal
    setChangingRoleUser(null);
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
              {users.map((u) => {
                const isMe = u.email === currentUserEmail;
                return (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{new Date(u.createdAt).toLocaleString()}</td>
                    <td>{u.address || "-"}</td>
                    <td>{u.phone || "-"}</td>
                    <td>{u.role}</td>
                    <td>
                      <button
                        className={styles.changeRoleBtn}
                        onClick={() => openRoleModal(u)}
                        disabled={isMe}
                        title={isMe ? "You cannot change your own role" : "Change Role"}
                      >
                        🔄 Change Role
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(u.id)}
                        disabled={isMe}
                        title={isMe ? "You cannot delete yourself" : "Delete User"}
                      >
                        🗑️ Delete
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
              Change Role for <b>{changingRoleUser.username}</b>
            </div>
            <form onSubmit={saveRoleChange} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  value={newRole}
                  onChange={handleRoleChange}
                  className={styles.modalInput}
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
                <button type="submit" className={styles.okBtn}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        message={
          userToDelete
            ? `Are you sure you want to delete user "${userToDelete.username}"?`
            : ""
        }
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </AdminLayout>
  );
}
