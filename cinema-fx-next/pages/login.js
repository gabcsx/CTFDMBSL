import Head from 'next/head';
import Header from '../components/Header';
import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { getSession } from 'next-auth/react';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email.trim()) newErrors.email = 'Email is required.';
        if (!formData.password.trim()) newErrors.password = 'Password is required.';
        return newErrors;
    };

    const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  setErrors(validationErrors);
  setGeneralError('');

  if (Object.keys(validationErrors).length === 0) {
    const result = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result.error) {
      setGeneralError(result.error);
    } else {
      
      const session = await getSession();

      if (session?.user?.role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/';
      }
    }
  }
};

    return (
        <>
            <Head>
                <title>Login - Cinema SkinFX</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="Login to your Cinema SkinFX account." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <main>
                <section className="account-creation">
                    <h2>Login</h2>

                    {/* General login error */}
                    {generalError && (
                        <div className="error-message" style={{ color: '#d9534f', textAlign: 'center', marginBottom: '1rem' }}>
                            {generalError}
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

                        <button type="submit" className="btn">Log In</button>

                        <p className="login-link">
                            Don’t have an account? <Link href="/create-account">Create one</Link>
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
