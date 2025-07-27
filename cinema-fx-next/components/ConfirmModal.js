import styles from './ConfirmModal.module.css';

export default function ConfirmModal({ open, message, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Confirm Changes</h3>
        <p>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>Cancel</button>
          <button className={styles.ok} onClick={onConfirm}>OK</button>
        </div>
      </div>
    </div>
  );
}
