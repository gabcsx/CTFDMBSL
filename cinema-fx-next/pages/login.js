import Head from 'next/head';
import Header from '../components/Header';
import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(''); // Added for success feedback

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email.trim()) newErrors.email = 'Email is required.';
        else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(formData.email)) newErrors.email = 'Please enter a valid email address.';
        }
        if (!formData.password.trim()) newErrors.password = 'Password is required.';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        setSuccessMessage(''); // Clear any previous success message

        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
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
                setFormData({ email: '', password: '' });
                
                // Optionally redirect to dashboard or home page
                // window.location.href = '/dashboard';
            } catch (err) {
                // Handle network or unexpected errors
                setErrors({ ...errors, general: 'Failed to connect to the server. Please try again later.' });
            }
        }
    };

    return (
        <>
            <Head>
                <title>Login - Cinema SkinFX</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta
                    name="description"
                    content="Login to your Cinema SkinFX account to access personalized skincare products."
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <main>
                <section className="account-creation">
                    <h2>Log In</h2>
                    {/* Display success message if login is successful */}
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
                    <form id="loginForm" onSubmit={handleSubmit} noValidate>
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
                                aria-describedby="passwordError"
                            />
                            <span id="passwordError" className="error-message" aria-live="polite">
                                {errors.password}
                            </span>
                        </div>

                        <button type="submit" className="btn">
                            Login
                        </button>

                        <p className="login-link">
                            Don't have an account? <Link href="/create-account">Create an account</Link>
                        </p>
                        
                        <p className="login-link">
                            <Link href="/forgot-password">Forgot your password?</Link>
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