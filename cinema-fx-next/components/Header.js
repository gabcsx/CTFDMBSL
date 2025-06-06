import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react'; // ✅ Import useSession

export default function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const { data: session } = useSession(); // ✅ Get session data

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const closeNav = () => {
        setIsNavOpen(false);
    };

    useEffect(() => {
        if (isNavOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
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
                        <Link href="/products" onClick={closeNav}>Products</Link>
                    </li>
                    <li>
                        <Link href="/#products" onClick={closeNav}>Best Seller</Link>                       
                    </li>
                    <li>
                        <Link href="/reviews" onClick={closeNav}>Reviews</Link>
                    </li>
                    <li>
                        <Link href="/#about" onClick={closeNav}>About Us</Link>
                    </li>
                    <li>
                        <Link href={session ? "/my-orders" : "/create-account"} onClick={closeNav}>
                            {session ? "My Orders" : "Create Account"}
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="header-right">
                
                <Link href={session ? "/user-overview" : "/login"} aria-label="Account">
                    <span className="account-icon" role="img" aria-label="User Icon">
                        👤
                    </span>
                </Link>
                <Link href={session ? "/cart" : "/login"} aria-label="Cart" className="cart-icon">
    🛒
</Link>

            </div>
        </header>
    );
}
