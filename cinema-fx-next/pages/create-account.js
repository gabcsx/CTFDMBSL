import Head from 'next/head';
import Header from '../components/Header';
import Link from 'next/link';
import { useState } from 'react';

export default function CreateAccount() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(''); // Added for success feedback

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = 'Username is required.';
        if (!formData.email.trim()) newErrors.email = 'Email is required.';
        else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(formData.email)) newErrors.email = 'Please enter a valid email address.';
        }
        if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long.';
        if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Passwords do not match.';
        return newErrors;
    };

    const getPasswordStrength = () => {
        const password = formData.password;
        if (password.length < 8) return { text: 'Weak', color: '#d9534f' };
        if (password.length < 12 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) 
            return { text: 'Moderate', color: '#f0ad4e' };
        return { text: 'Strong', color: '#5cb85c' };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        setSuccessMessage(''); // Clear any previous success message

        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        email: formData.email,
                        password: formData.password
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    // Display error message from API response
                    setErrors({ ...errors, general: data.message || 'Something went wrong. Please try again.' });
                    return;
                }

                // On success, show success message and reset form
                setSuccessMessage(data.message);
                setFormData({ username: '', email: '', password: '', confirmPassword: '' });
            } catch (err) {
                // Handle network or unexpected errors
                setErrors({ ...errors, general: 'Failed to connect to the server. Please try again later.' });
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
                    {/* Display success message if account creation is successful */}
                    {successMessage && (
                        <div className="success-message" style={{ color: '#5cb85c', textAlign: 'center', marginBottom: '1rem' }}>
                            {successMessage}
                        </div>
                    )}
                    {/* Display general error if there's an API error */}
                    {errors.general && (
                        <div className="error-message" style={{ color: '#d9534f', textAlign: 'center', marginBottom: '1rem' }}>
                            {errors.general}
                        </div>
                    )}
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
                            <span id="usernameError" className="error-message" aria-live="polite">
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
                            <span id="emailError" className="error-message" aria-live="polite">
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
                            <span id="passwordError" className="error-message" aria-live="polite">
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
                            <span id="confirmPasswordError" className="error-message" aria-live="polite">
                                {errors.confirmPassword}
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

            <footer>
                <p>&copy; 2025 Cinema SkinFX. Powered by CosmetiCore. All rights reserved.</p>
            </footer>
        </>
    );
}
