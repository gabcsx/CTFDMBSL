import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [isCartPreviewVisible, setIsCartPreviewVisible] = useState(false);
    const hidePreviewTimeoutRef = useRef(null);

    const toggleNav = () => setIsNavOpen(!isNavOpen);
    const closeNav = () => setIsNavOpen(false);

    // Prevent body scroll when nav is open
    useEffect(() => {
        if (isNavOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [isNavOpen]);

    // Cart logic
    const getCartData = () => {
        if (typeof window !== "undefined") {
            try {
                const cartString = localStorage.getItem('cart');
                const parsedCart = cartString ? JSON.parse(cartString) : [];
                const validCart = Array.isArray(parsedCart) ? parsedCart : [];
                setCartItems(validCart);
                setCartCount(validCart.reduce((sum, item) => sum + (item.quantity || 0), 0));
            } catch (error) {
                console.error("Failed to parse cart from localStorage:", error);
                setCartItems([]);
                setCartCount(0);
            }
        }
    };

    useEffect(() => {
        getCartData();
        const handleStorage = (event) => {
            if (event.key === 'cart') getCartData();
        };
        window.addEventListener('storage', handleStorage);
        window.addEventListener('cartUpdated', getCartData);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('cartUpdated', getCartData);
            if (hidePreviewTimeoutRef.current) {
                clearTimeout(hidePreviewTimeoutRef.current);
            }
        };
    }, []);

    const handleCartAreaEnter = () => {
        if (hidePreviewTimeoutRef.current) {
            clearTimeout(hidePreviewTimeoutRef.current);
        }
        if (cartItems.length > 0) {
            setIsCartPreviewVisible(true);
        }
    };

    const handleCartAreaLeave = () => {
        hidePreviewTimeoutRef.current = setTimeout(() => {
            setIsCartPreviewVisible(false);
        }, 300);
    };

    const updateCartItemQuantity = (itemId, change) => {
        const updatedCartItems = cartItems.map(item => {
            if (item.id === itemId) {
                const newQuantity = (item.quantity || 0) + change;
                return { ...item, quantity: Math.max(1, newQuantity) };
            }
            return item;
        });

        setCartItems(updatedCartItems);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    };

    const removeCartItem = (itemId) => {
        const updatedCartItems = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedCartItems);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        window.dispatchEvent(new CustomEvent('cartUpdated'));

        if (updatedCartItems.length === 0) {
            setIsCartPreviewVisible(false);
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const subtotal = calculateSubtotal();
    const currency = cartItems.length > 0 ? (cartItems[0].currency || 'PHP') : 'PHP';

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
                    <li><a href="/#products" onClick={closeNav}>Best Sellers</a></li>
                    <li><Link href="/" onClick={closeNav}>Home</Link></li>
                    <li><Link href="/products" onClick={closeNav}>Products</Link></li>
                    <li><a href="/reviews" onClick={closeNav}>Reviews</a></li>
                    <li><a href="/#about" onClick={closeNav}>About Us</a></li>
                </ul>
            </nav>

            <div className="header-right">
                <div className="search-container">
                    <input type="text" placeholder="Search..." className="search-bar" aria-label="Search products"/>
                    <button className="search-button" aria-label="Search" type="submit">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                </div>
                <Link href="/create-account" aria-label="Create Account">
                    <span className="account-icon" role="img" aria-label="User Icon">👤</span>
                </Link>

                <div 
                    style={{ position: 'relative', display: 'inline-block' }}
                    onMouseEnter={handleCartAreaEnter}
                    onMouseLeave={handleCartAreaLeave}
                >
                    <Link href="/cart" className="cart-link" aria-label="Cart">
                        <span className="cart-icon-wrapper">
                            <span style={{ position: 'relative', display: 'inline-block' }}>
                                🛒
                                {cartCount > 0 && (
                                    <span
                                        style={{
                                            position: 'absolute', top: -8, right: -10, background: '#d9534f',
                                            color: '#fff', borderRadius: '50%', padding: '2px 6px',
                                            fontSize: '0.75rem', fontWeight: 'bold', minWidth: '20px', textAlign: 'center',
                                        }}
                                        aria-label={`${cartCount} items in cart`}
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </span>
                        </span>
                    </Link>
                    {isCartPreviewVisible && cartItems.length > 0 && (
                        <div 
                            className="cart-preview"
                            style={{
                                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                                backgroundColor: 'white', border: '1px solid #e0e0e0',
                                borderRadius: '4px', padding: '16px', zIndex: 1000,
                                width: '400px', 
                                boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                                fontFamily: 'Arial, sans-serif',
                            }}
                        >
                            <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #eee'}}>
                                <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', marginBottom: '5px' }}>
                                    {cartCount} ITEM(S) IN CART
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#555' }}>
                                    SUBTOTAL: {currency} {subtotal.toFixed(2)}
                                </div>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '300px', overflowY: 'auto' }} className="cart-preview-item-list">
                                {cartItems.map((item, index) => (
                                    <li 
                                        key={item.id || index}
                                        style={{ 
                                            display: 'flex', alignItems: 'flex-start',
                                            paddingBottom: '16px', marginBottom: '16px',
                                            borderBottom: index === cartItems.length - 1 ? 'none' : '1px solid #eee',
                                        }}
                                    >
                                        <div style={{ marginRight: '15px', flexShrink: 0 }}>
                                           <Image 
                                                src={item.image || item.img || '/assets/placeholder.png'}
                                                alt={item.name || 'Product Image'}
                                                width={80}
                                                height={80}
                                                style={{ objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }}
                                            />
                                        </div>
                                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#333', marginBottom: '2px', lineHeight: '1.3' }}>
                                                {item.name || 'N/A'} {item.variant ? ` ${item.variant}` : ''}
                                            </span>
                                            <span style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>
                                                {item.category || (item.description ? item.description.substring(0,30)+'...' : 'N/A')}
                                                {item.size ? ` | Size: ${item.size}` : ''}
                                            </span>
                                            <div className="quantity-selector-custom">
                                                <button
                                                    type="button"
                                                    onClick={() => updateCartItemQuantity(item.id, -1)}
                                                    className="qty-btn"
                                                    aria-label="Decrease quantity"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    –
                                                </button>
                                                <span className="qty-value">{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateCartItemQuantity(item.id, 1)}
                                                    className="qty-btn"
                                                    aria-label="Increase quantity"
                                                    disabled={item.quantity >= 99}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#333', marginBottom: '5px' }}>
                                                {item.currency || 'PHP'} {(item.price * item.quantity).toFixed(2)}
                                            </span>
                                            <button
                                                onClick={() => removeCartItem(item.id)}
                                                title="Remove item"
                                                style={{
                                                    background: 'none', border: 'none', color: '#888', cursor: 'pointer',
                                                    fontSize: '1.1rem', padding: '0 5px', fontWeight: 'bold',
                                                    lineHeight: '1'
                                                }}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div style={{ 
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                paddingTop: '16px', marginTop: cartItems.length > 0 ? '10px' : '0',
                                borderTop: cartItems.length > 0 ? '1px solid #eee' : 'none'
                            }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>SUBTOTAL</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>
                                    {currency} {subtotal.toFixed(2)}
                                </span>
                            </div>
                            <Link href="/cart" onClick={() => {
                                setIsCartPreviewVisible(false); 
                                if (hidePreviewTimeoutRef.current) clearTimeout(hidePreviewTimeoutRef.current);
                            }}>
                                <button style={{ 
                                    width: '100%', marginTop: '20px', padding: '12px 0',
                                    backgroundColor: '#ff8c94', color: 'white', border: 'none',
                                    borderRadius: '4px', cursor: 'pointer', fontSize: '1rem',
                                    fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase'
                                }}>
                                    Check Out Now
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background-color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: relative; }
                .logo img { object-fit: contain; }
                .hamburger-button { display: none; background: none; border: none; cursor: pointer; padding: 0.5rem; z-index: 1001; }
                .hamburger-icon-bar { display: block; width: 25px; height: 3px; background-color: #333; margin: 5px 0; transition: transform 0.3s ease, opacity 0.3s ease; }
                .main-nav ul { list-style: none; display: flex; margin: 0; padding: 0; }
                .main-nav li { margin-left: 1.5rem; }
                .main-nav a { text-decoration: none; color: #333; font-weight: 500; transition: color 0.2s ease; }
                .main-nav a:hover { color: #007bff; }
                .header-right { display: flex; align-items: center; }
                .search-container { display: flex; align-items: center; margin-right: 1rem; border: 1px solid #ccc; border-radius: 20px; padding: 0.3rem 0.5rem; }
                .search-bar { border: none; outline: none; padding: 0.3rem; font-size: 0.9rem; border-radius: 20px 0 0 20px; }
                .search-button { background: none; border: none; cursor: pointer; padding: 0.3rem; display: flex; align-items: center; justify-content: center; }
                .account-icon, .cart-link { margin-left: 1rem; font-size: 1.5rem; text-decoration: none; color: #333; position: relative; }
                .cart-icon-wrapper { transition: transform 0.2s, box-shadow 0.2s, background 0.2s; border-radius: 50%; padding: 6px; cursor: pointer; display: inline-block; }
                .cart-icon-wrapper:hover { background: #f7f7f7; box-shadow: 0 2px 8px rgba(0,0,0,0.12); transform: scale(1.13) rotate(-7deg); }
                .no-scroll { overflow: hidden; }
                .cart-preview-item-list::-webkit-scrollbar { width: 8px; }
                .cart-preview-item-list::-webkit-scrollbar-track { background: #fde0e2; border-radius: 10px; }
                .cart-preview-item-list::-webkit-scrollbar-thumb { background-color: #ff8c94; border-radius: 10px; border: 2px solid #fde0e2; }
                .cart-preview-item-list::-webkit-scrollbar-thumb:hover { background-color: #e76a73; }
                @media (max-width: 768px) {
                    .main-nav { display: ${isNavOpen ? 'flex' : 'none'}; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background-color: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1); padding: 1rem 0; z-index: 1000; }
                    .main-nav.nav-open { display: flex; }
                    .main-nav li { margin: 0; width: 100%; }
                    .main-nav a { display: block; padding: 0.8rem 2rem; text-align: center; border-bottom: 1px solid #f0f0f0; }
                    .main-nav li:last-child a { border-bottom: none; }
                    .hamburger-button { display: block; }
                    .cart-preview { width: calc(100vw - 32px); max-width: 380px; left: 50%; transform: translateX(-50%); right: auto; }
                }
            `}</style>
        </header>
    );
}
