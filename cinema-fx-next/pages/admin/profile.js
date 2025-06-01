import Link from "next/link";
import { useRef, useState } from "react";
import styles from "../../styles/adminprofile.module.css";

const defaultAvatar = "/assets/avatar.png";
const homeIcon = "/assets/home.png";

export default function Profile() {
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(defaultAvatar);
  const fileInputRef = useRef();

  const handlePicClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated! (Demo only)");
  };

  const handleCancel = () => {
    // Reset values or redirect as needed
    setFirstName("");
    setPassword("");
    setEmail("");
    setProfilePic(defaultAvatar);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Top Bar */}
      <header className={styles.header}>
        <Link href="/admin/dashboard">
          <div className={styles.homeBtn}>
            <img src={homeIcon} alt="Home" className={styles.homeIconImg} />
          </div>
        </Link>
        <div className={styles.userMenu}>
          <img
            src={profilePic || defaultAvatar}
            alt="Avatar"
            className={styles.avatarCircle}
          />
          <span className={styles.userName}>Admin User</span>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.centerCard}>
        <h2 className={styles.title}>Account Settings</h2>
        <p className={styles.subtitle}>Edit your name, avatar etc.</p>
        <form className={styles.profileForm} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formSection}>
              <label className={styles.label}>Your Name</label>
              <input
                className={styles.input}
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />

              <label className={styles.label}>Password</label>
              <div className={styles.inputRow}>
                <input
                  className={styles.input}
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <span className={styles.changeLink}>Change</span>
              </div>

              <label className={styles.label}>Email Address</label>
              <div className={styles.inputRow}>
                <input
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
                <span className={styles.changeLink}>Change</span>
              </div>
            </div>
            <div className={styles.avatarSection}>
              <img
                src={profilePic || defaultAvatar}
                alt="Profile"
                className={styles.avatarImg}
              />
              <button
                type="button"
                className={styles.uploadBtn}
                onClick={handlePicClick}
              >
                Upload a picture
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className={styles.buttonRow}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
