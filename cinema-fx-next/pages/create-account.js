// pages/create-account.js
import Head from "next/head";
import Header from "../components/Header";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import Toast from "../components/Toast";

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 11) {
        setFormData({ ...formData, [name]: digitsOnly });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email))
        newErrors.email = "Please enter a valid email address.";
    }
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters long.";
    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{11}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 11 digits.";
    }
    return newErrors;
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (password.length < 8) return { text: "Weak", color: "#d9534f" };
    if (
      password.length < 12 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    )
      return { text: "Moderate", color: "#f0ad4e" };
    return { text: "Strong", color: "#5cb85c" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setSuccessMessage("");

    if (Object.keys(validationErrors).length === 0) {
      try {
        // 1. Register the user
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            address: formData.address,
            phone: formData.phone,
          }),
        });
        const data = await response.json();

        if (!response.ok) {
          setToast({
            show: true,
            message: data.message || "Something went wrong. Please try again.",
            type: "error",
          });
          setErrors({
            ...errors,
            general: data.message || "Something went wrong. Please try again.",
          });
          return;
        }

        setSuccessMessage(data.message);
        setToast({ show: true, message: data.message, type: "success" });

        // 2. Try to fetch the cart items for the current (guest) session
        let cartItems = [];
        let sessionId = null;
        try {
          const cartRes = await fetch("/api/cart");
          if (cartRes.ok) {
            cartItems = await cartRes.json();
            sessionId = cartItems.length > 0 ? cartItems[0].sessionId : null;
          }
        } catch (cartErr) {
          // If cart fetch fails, just skip cart migration
          cartItems = [];
          sessionId = null;
        }

        // 3. For each item, POST to /api/cart/newuser
        if (cartItems.length > 0 && sessionId) {
          await Promise.all(
            cartItems.map((item) =>
              fetch("/api/cart/newuser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  productId: item.productId,
                  quantity: item.quantity,
                  sessionId,
                  userEmail: formData.email,
                }),
              })
            )
          );
        }

        // 4. Reset form and redirect
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          address: "",
          phone: "",
        });

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } catch (err) {
        setToast({
          show: true,
          message: "Failed to connect to the server. Please try again later.",
          type: "error",
        });
        setErrors({
          ...errors,
          general: "Failed to connect to the server. Please try again later.",
        });
      }
    }
  };

  const passwordStrength = formData.password ? getPasswordStrength() : null;

  return (
    <>
      <Head>
        <title>Create an Account - Cinema SkinFX</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Create an account at Cinema SkinFX to enjoy personalized skincare products."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <section className="account-creation">
          <h2>Create an Account</h2>

          {/* REMOVE the inline success/error message blocks here */}

          <form id="createAccountForm" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                aria-describedby="usernameError"
              />
              <span
                id="usernameError"
                className="error-message"
                aria-live="polite"
              >
                {errors.username}
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-describedby="emailError"
              />
              <span
                id="emailError"
                className="error-message"
                aria-live="polite"
              >
                {errors.email}
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                aria-describedby="passwordHelp passwordError passwordStrength"
              />
              <span id="passwordHelp" className="password-requirements">
                Must be at least 8 characters long
              </span>
              {passwordStrength && (
                <span
                  id="passwordStrength"
                  className="password-strength"
                  style={{ color: passwordStrength.color }}
                >
                  Strength: {passwordStrength.text}
                </span>
              )}
              <span
                id="passwordError"
                className="error-message"
                aria-live="polite"
              >
                {errors.password}
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                aria-describedby="confirmPasswordError"
              />
              <span
                id="confirmPasswordError"
                className="error-message"
                aria-live="polite"
              >
                {errors.confirmPassword}
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                aria-describedby="addressError"
              />
              <span
                id="addressError"
                className="error-message"
                aria-live="polite"
              >
                {errors.address}
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                aria-describedby="phoneError"
                pattern="\d{11}"
                maxLength={11}
                inputMode="numeric"
              />
              <span
                id="phoneError"
                className="error-message"
                aria-live="polite"
              >
                {errors.phone}
              </span>
            </div>

            <button type="submit" className="btn">
              Create Account
            </button>

            <p className="login-link">
              Already have an account? <Link href="/login">Log in</Link>
            </p>
          </form>
        </section>
      </main>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <footer>
        <p>
          &copy; 2025 Cinema SkinFX. Powered by CosmetiCore. All rights
          reserved.
        </p>
      </footer>
    </>
  );
}
