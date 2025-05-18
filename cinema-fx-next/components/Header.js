import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image'; // Added for logo optimization

export default function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const closeNav = () => {
        setIsNavOpen(false);
    };

    // Add/remove a class to body to prevent scrolling when nav is open
    useEffect(() => {
        if (isNavOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        // Cleanup function to remove class if component unmounts while nav is open
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isNavOpen]);

    return (
        <header>
            <div className="logo">
                <Link href="/" onClick={closeNav}>
                    <Image
                        src="/assets/logo.jpg"
                        alt="CinemaFX Logo"
                        width={100}
                        height={50}
                        priority
                        placeholder="blur"
                        blurDataURL="/assets/placeholder.png"
                    />
                </Link>
            </div>

            <button
                className="hamburger-button"
                onClick={toggleNav}
                aria-label="Toggle navigation"
                aria-expanded={isNavOpen}
                aria-controls="main-navigation"
            >
                <span className="hamburger-icon-bar"></span>
                <span className="hamburger-icon-bar"></span>
                <span className="hamburger-icon-bar"></span>
            </button>

            <nav id="main-navigation" className={`main-nav ${isNavOpen ? 'nav-open' : ''}`}>
                <ul>
                    <li>
                        <Link href="/" onClick={closeNav}>Home</Link>
                    </li>
                    <li>
                        <a href="/#products" onClick={closeNav}>Best Seller</a>
                    </li>
                    <li>
                        <a href="/#contact" onClick={closeNav}>Contact</a>
                    </li>
                    <li>
                        <a href="/#reviews" onClick={closeNav}>Reviews</a>
                    </li>
                    <li>
                        <a href="/#about" onClick={closeNav}>About Us</a>
                    </li>
                    <li>
                        <Link href="/create-account" onClick={closeNav}>Create Account</Link>
                    </li>
                </ul>
            </nav>

            <div className="header-right">
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="search-bar" 
                        aria-label="Search products"
                    />
                    <button className="search-button" aria-label="Search" type="submit">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </div>
                <Link href="/create-account" aria-label="Create Account">
                    <span className="account-icon" role="img" aria-label="User Icon">
                        👤
                    </span>
                </Link>
                <a href="#cart" className="cart-icon" aria-label="Cart">
                    🛒
                </a>
            </div>
        </header>
    );
}
