import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../../components/Header';
import QuantitySelector from '../../components/QuantitySelector';
import { useState } from 'react';

const allProducts = [
    {
        id: 1,
        name: 'Sepi White',
        description: 'MAGIC WHITE Sepi MSH with Allantoin by Cinema SinFX',
        price: 1180,
        image: '/assets/sepiwhite.png',
        category: 'Whitening',
        featured: true,
        inStock: true,
    },
    {
        id: 2,
        name: 'Follice Revive',
        description: 'Scalp Follicle Grower Serum',
        price: 688,
        image: '/assets/Scalp Grower Serum.png',
        category: 'hair-care',
        featured: true,
        inStock: true,
    },
    {
        id: 3,
        name: 'SkinFX VITAMIN C',
        description: 'Cinema SkinFX VITAMIN C SKIN BOOSTER 30ML',
        price: 799,
        image: '/assets/Skin booster.webp',
        category: 'serums',
        featured: true,
        inStock: true,
    },
    {
        id: 4,
        name: 'Azelaic Acid Serum',
        description: 'CINEMA SKINFX AZELAIC ACID SERUM',
        price: 699,
        image: '/assets/Azelaic Acid.webp',
        category: 'serums',
        featured: true,
        inStock: true,
    },
    {
        id: 5,
        name: 'Renewed Glycol',
        description: 'RENEWED GLYCOL 7% TONER',
        price: 599,
        image: '/assets/Toner.webp',
        category: 'toners',
        featured: true,
        inStock: true,
    },
    {
        id: 6,
        name: 'Skin Protocol',
        description: 'SKIN PROTOCOL LIPID REPAIR MOISTURIZER',
        price: 999,
        image: '/assets/Skin protocol.webp',
        category: 'moisturizers',
        featured: true,
        inStock: true,
    },
    {
        id: '7',
        name: 'Glassier me Lotion',
        description: 'Designed to create a radiant, glass-like skin effect',
        price: 380,
        image: '/assets/Glassier.png',
        category: 'lotions',
        featured: false,
        inStock: true
    },
    {
        id: '8',
        name: 'Gentle Cleanser',
        description: 'Glassier Me by Cinema Skin FX Luminous Lotion delivers an instant, glass-like glow with lightweight hydration. It blurs imperfections, evens skin tone, soothes redness, and provides a long-lasting, dewy finish. Non-comedogenic and suitable for all skin types, it supports youthful, radiant skin without feeling greasy or heavy.',
        price: 388,
        image: '/assets/GentleCleanser.png',
        category: 'cleansers',
        featured: false,
        inStock: false
    }
];

export default function ProductDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [quantity, setQuantity] = useState(1);

    // Notification states
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');

    // Ensure id types match for comparison
    const product = allProducts.find((p) => String(p.id) === id);

    if (!product) {
        return <div>Loading...</div>;
    }

    // Calculate total price
    const totalPrice = product.price * quantity;

    // Add to cart logic with notification
    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(item => String(item.id) === String(product.id));
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));

        // Show notification
        setMessage(`Added ${quantity} of ${product.name} to cart!`);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
    };

    return (
        <>
            <Head>
                <title>{product.name} - Cinema SkinFX</title>
                <meta name="description" content={product.description} />
            </Head>

            <Header />

            <main className="product-detail-page">
                {/* Notification */}
                {showMessage && (
                    <div className="notification">
                        {message}
                    </div>
                )}
                <div className="container">
                    <div className="product-detail">
                        {/* Product Image */}
                        <div className="product-image">
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={400}
                                height={400}
                                objectFit="contain"
                            />
                        </div>
                        {/* Product Info */}
                        <div className="product-info">
                            <h1 className="product-name">{product.name}</h1>
                            <div className="product-price">
                                ₱{totalPrice.toLocaleString()}
                            </div>
                            {/* Quantity Selector */}
                            <div className="quantity-selector">
                                <label htmlFor="quantity">QUANTITY</label>
                                <QuantitySelector
                                    min={1}
                                    max={100}
                                    value={quantity}
                                    onChange={setQuantity}
                                />
                            </div>
                            <button
                                className="add-to-bag"
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                            >
                                {product.inStock ? "Add to Bag" : "Out of Stock"}
                            </button>
                            {/* Description Section */}
                            <div className="desc-section">
                                <div className="desc-label">Description</div>
                                <div className="desc-card">
                                    <div className="desc-content">
                                        {product.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .product-detail-page {
                        min-height: 80vh;
                        background: #fafafd;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .notification {
                        position: fixed;
                        top: 30px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: #e91e63;
                        color: #fff;
                        padding: 14px 32px;
                        border-radius: 10px;
                        font-size: 1.15rem;
                        font-weight: 600;
                        z-index: 9999;
                        box-shadow: 0 2px 16px rgba(237,32,100,0.09);
                        animation: fadeIn 0.2s;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-20px) translateX(-50%); }
                        to   { opacity: 1; transform: translateY(0) translateX(-50%); }
                    }
                    .container {
                        background: #fff;
                        border-radius: 16px;
                        box-shadow: 0 4px 24px rgba(0,0,0,0.07);
                        padding: 3rem 2rem;
                        max-width: 900px;
                        margin: 2rem auto;
                    }
                    .product-detail {
                        display: flex;
                        gap: 3rem;
                        align-items: flex-start;
                    }
                    .product-image {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .product-info {
                        flex: 1.2;
                        display: flex;
                        flex-direction: column;
                        gap: 1.5rem;
                    }
                    .product-name {
                        font-size: 2.3rem;
                        font-weight: 700;
                        margin-bottom: 0.5rem;
                    }
                    .product-price {
                        font-size: 1.7rem;
                        color: #e91e63;
                        margin-bottom: 1rem;
                        font-weight: 600;
                    }
                    .quantity-selector {
                        margin-bottom: 0.5rem;
                    }
                    .quantity-selector label {
                        margin-right: 1rem;
                        font-weight: 500;
                    }
                    .add-to-bag {
                        background: #e91e63;
                        color: #fff;
                        padding: 0.9rem 2rem;
                        font-size: 1.1rem;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 600;
                        margin-bottom: 1rem;
                        transition: background 0.2s;
                    }
                    .add-to-bag:disabled {
                        background: #ccc;
                        cursor: not-allowed;
                    }
                    .add-to-bag:hover:not(:disabled) {
                        background: #d81b60;
                    }
                    /* --- Description Section Styles --- */
                    .desc-section {
                        margin-top: 2.5rem;
                        width: 100%;
                        text-align: left;
                    }
                    .desc-label {
                        background: #ed2064;
                        color: #fff;
                        font-weight: 700;
                        font-size: 1.1rem;
                        text-align: left;
                        border-top-left-radius: 14px;
                        border-top-right-radius: 14px;
                        border-bottom-left-radius: 0;
                        border-bottom-right-radius: 0;
                        width: 140px;
                        margin-left: 0;
                        margin-bottom: -8px;
                        padding: 8px 0 6px 0;
                        box-sizing: border-box;
                        position: relative;
                        z-index: 2;
                        box-shadow: 0 2px 8px rgba(237,32,100,0.07);
                        letter-spacing: 0.3px;
                        line-height: 1.1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .desc-card {
                        border: 1.2px solid #ed2064;
                        border-radius: 14px;
                        background: #fff;
                        overflow: hidden;
                        width: 100%;
                        box-sizing: border-box;
                        padding: 1rem 1rem 0.8rem 1rem;
                        margin-top: 0;
                        position: relative;
                        z-index: 1;
                    }
                    .desc-content {
                        font-size: 1rem;
                        color: #333;
                        text-align: left;
                        line-height: 1.5;
                        background: transparent;
                    }
                    @media (max-width: 800px) {
                        .product-detail {
                            flex-direction: column;
                            align-items: center;
                        }
                        .product-image, .product-info {
                            max-width: 100%;
                        }
                        .desc-label {
                            width: 100px;
                            font-size: 1rem;
                        }
                    }
                `}</style>
            </main>

            <footer>
                <p style={{
                    background: '#222',
                    color: '#fff',
                    textAlign: 'center',
                    margin: 0,
                    padding: '1.2rem 0',
                    fontSize: '1rem'
                }}>
                    © 2025 Cinema SkinFX. Powered by CosmetiCore. All rights reserved.
                </p>
            </footer>
        </>
    );
}
