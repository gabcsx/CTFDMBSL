import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';

export default function Home() {
    const [slideIndex, setSlideIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const slideshowInterval = useRef(null);

    const slides = [
        {
            id: 1,
            img: '/assets/sepiwhite.png',
            alt: 'SepiWhite Product',
            title: 'Sepi White',
            name: 'Sepi White',
            description: 'Skin-lightening agent made of natural amino acids.',
            price: 1180,
            category: 'Whitening',
        },
        {
            id: '2',
            img: '/assets/Scalp Grower Serum.png',
            alt: 'Follice Revive Product',
            title: 'Scalp Follicle Revive',
            name: 'Follice Revive',
            description: 'Cinema SkinFX – Hair Grower Serum Follicle Revival, Restore lost hair. Revive your confidence.',
            price: 688,
        },
        {
            id: '3',
            img: '/assets/Skin booster.webp',
            alt: 'SkinFX Vitamin C',
            title: 'SkinFX VITAMIN C',
            description: 'Cinema SkinFX VITAMIN C SKIN BOOSTER 30ML',
            price: 299,
        },
        {
            id: '4',
            img: '/assets/Azelaic Acid.webp',
            alt: 'Azelaic Acid Serum',
            title: 'Azelaic Acid Serum',
            description: 'CINEMA SKINFX AZELAIC ACID SERUM',
            price: 350,
        },
        {
            id: '5',
            img: '/assets/Toner.webp',
            alt: 'Toner',
            title: 'Renewed Glycol',
            description: 'RENEWED GLYCOL 7% TONER',
            price: 250,
        },
        {
            id: '6',
            img: '/assets/Skin protocol.webp',
            alt: 'Skin Protocol',
            title: 'Skin Protocol',
            description: 'SKIN PROTOCOL LIPID REPAIR MOISTURIZER',
            price: 399,
        },
    ];

    const VISIBLE_CARDS = 3;
    const totalPages = Math.ceil(slides.length / VISIBLE_CARDS);

    // Autoplay advances by page
    useEffect(() => {
        if (!isPaused) {
            slideshowInterval.current = setInterval(() => {
                setSlideIndex(prev => ((prev + VISIBLE_CARDS) % slides.length));
            }, 7000);
        }
        return () => clearInterval(slideshowInterval.current);
    }, [isPaused, slides.length]);

    // Get the 3 visible slides, wrapping around
    const visibleSlides = [];
    for (let i = 0; i < VISIBLE_CARDS; i++) {
        visibleSlides.push(slides[(slideIndex + i) % slides.length]);
    }

    // Dot click handler: jump to that page
    function goToPage(pageIdx) {
        setSlideIndex(pageIdx * VISIBLE_CARDS);
    }

    // Add to cart function
    function addToCart(product) {
        if (typeof window === 'undefined') return;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
    }

    return (
        <>
            <Head>
                <title>CinemaFX</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta
                    name="description"
                    content="CinemaFX - Discover the best cosmetics and skincare products for your unique style. Shop now!"
                />
                <link rel="icon" href="/assets/favicon.ico" type="image/x-icon" />
            </Head>

            <Header />

            <main>
                {/* Notification Message */}
                {showMessage && (
                    <div className="notification">
                        Product added to cart!
                    </div>
                )}

                {/* Hero Section */}
                <section className="hero" id="home">
                    <h2>Your Beauty, Our Passion</h2>
                    <p>Discover the best in cosmetics for your unique style.</p>
                    <a href="#products" className="btn">Shop Now</a>
                </section>

                {/* Slideshow Section */}
                <section id="products" className="products-section">
                    <h2>Recommended for you</h2>
                    <div className="slideshow-container">
                        <div className="slides-row">
                            {visibleSlides.map((slide, idx) => (
                                <div
                                    key={slide.id}
                                    className="mySlides fade active"
                                    role="region"
                                    aria-label={`Product ${((slideIndex + idx) % slides.length) + 1} of ${slides.length}`}
                                >
                                    <Link
                                        href={`/products/${slide.id}`}
                                        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                                    >
                                        <Image
                                            src={slide.img}
                                            alt={slide.alt}
                                            width={800}
                                            height={300}
                                            layout="responsive"
                                            objectFit="contain"
                                            priority={idx === 0}
                                            placeholder="blur"
                                            blurDataURL="/assets/placeholder.png"
                                        />
                                        <div className="slide-content">
                                            <h3>{slide.title}</h3>
                                            <p>{slide.description}</p>
                                            <p style={{ fontWeight: 'bold', margin: '0.5rem 0' }}>
                                                ₱{slide.price}
                                            </p>
                                        </div>
                                    </Link>
                                    <button
                                        className="btn product-btn"
                                        onClick={() => addToCart(slide)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            ))}
                        </div>
                        {/* Dot Pagination */}
                        <div className="carousel-dots">
                            {Array.from({ length: totalPages }).map((_, pageIdx) => (
                                <span
                                    key={pageIdx}
                                    className={`dot${pageIdx === Math.floor(slideIndex / VISIBLE_CARDS) ? ' active' : ''}`}
                                    onClick={() => goToPage(pageIdx)}
                                    aria-label={`Go to slide ${pageIdx + 1}`}
                                    tabIndex={0}
                                    role="button"
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' || e.key === ' ') goToPage(pageIdx);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="about-section">
                    <h2>About Us</h2>
                    <div className="about-container">
                        <div className="mission-container">
                            <div className="mission-content">
                                <h3>Our Mission</h3>
                                <p>
                                    Discover Cinema SkinFX, where effective skincare meets affordability. Our premium
                                    formulations, crafted with high-quality ingredients, deliver visible results without
                                    the high price tag. Transform your skin into its best version with our range of
                                    products designed to hydrate, brighten, and rejuvenate. At Cinema SkinFX, we believe
                                    luxury skincare should be accessible to all, offering you the confidence of radiant
                                    skin without compromise. Experience affordable luxury today!
                                </p>
                            </div>
                            <div className="values">
                                <h3>Our Values</h3>
                                <div className="values-grid">
                                    <div className="value-item">
                                        <span className="value-icon">🌿</span>
                                        <h4>Natural</h4>
                                        <p>Committed to natural ingredients</p>
                                    </div>
                                    <div className="value-item">
                                        <span className="value-icon">🔬</span>
                                        <h4>Innovation</h4>
                                        <p>Advanced skincare technology</p>
                                    </div>
                                    <div className="value-item">
                                        <span className="value-icon">♻️</span>
                                        <h4>Sustainable</h4>
                                        <p>Eco-friendly practices</p>
                                    </div>
                                    <div className="value-item">
                                        <span className="value-icon">💝</span>
                                        <h4>Quality</h4>
                                        <p>Premium products</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="team-section">
                            <h3>Founder of Cinema SkinFX</h3>
                            <div className="team-grid">
                                <div className="team-member">
                                    <Image
                                        src="/assets/CEO.png"
                                        alt="Cheryl Cabanos Del Rosario"
                                        className="team-member-image"
                                        width={300}
                                        height={400}
                                        objectFit="contain"
                                        placeholder="blur"
                                        blurDataURL="/assets/placeholder.png"
                                    />
                                    <h4>Cheryl Cabanos Del Rosario</h4>
                                    <p className="role">
                                        I’m Cheryl Cabanos, the CEO and brand owner of Cinema SkinFX, with nearly two
                                        decades of experience in the beauty industry. As a makeup instructor and artist,
                                        I’ve trained countless students—including celebrities and aspiring
                                        professionals—helping them refine their skills and develop confidence in their
                                        craft.
                                    </p>
                                    <p className="role">
                                        My journey in film has taken me behind the scenes of blockbuster productions,
                                        where I’ve worked as both a beauty and prosthetic makeup artist for Hollywood
                                        icons like Lucas Bravo, Olga Kurylenko, Isabelle Huppert, Emmanuelle Béart, and
                                        Steven Seagal. My dedication to precision and excellence has made me a trusted
                                        name in the industry, ensuring that every look I create—whether for film or
                                        everyday beauty—is flawless.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="stats-section">
                            <div className="stat-item">
                                <span className="stat-number">16.5k</span>
                                <p>Followers</p>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">19.7k</span>
                                <p>Ratings</p>
                                <div className="star-rating">
                                    <span className="rating-number">5.0</span>
                                    <span className="stars">★★★★★</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">38</span>
                                <p>Products</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer>
                <p>&copy; 2025 Cinema SkinFX. Powered by CosmetiCore. All rights reserved.</p>
            </footer>

            {/* Dot Pagination Styles */}
            <style jsx>{`
                .notification {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px;
                    border-radius: 5px;
                    z-index: 1000;
                    transition: opacity 0.5s ease;
                }
                .slideshow-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                    position: relative;
                    width: 100%;
                    max-width: 1100px;
                    margin: 0 auto;
                }
                .slides-row {
                    display: flex;
                    gap: 2rem;
                    justify-content: center;
                    width: 100%;
                    margin: 0 auto;
                }
                .mySlides {
                    flex: 1 1 0;
                    max-width: 330px;
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.09), 0 1.5px 6px rgba(233,30,99,0.07);
                    padding: 2rem 1.5rem 1.5rem 1.5rem;
                    transition: box-shadow 0.2s;
                    text-align: left;
                }
                .carousel-dots {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 1.5rem 0 0.8rem 0;
                    gap: 1rem;
                }
                .dot {
                    height: 14px;
                    width: 14px;
                    border-radius: 50%;
                    background: #fff;
                    border: none;
                    display: inline-block;
                    cursor: pointer;
                    transition: background 0.2s;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
                    outline: none;
                }
                .dot.active {
                    background: #e53935;
                }
                .dot:focus {
                    outline: 2px solid #e53935;
                }
                @media (max-width: 900px) {
                    .slides-row {
                        gap: 1rem;
                    }
                    .mySlides {
                        max-width: 48vw;
                        min-width: 0;
                    }
                }
                @media (max-width: 600px) {
                    .slides-row {
                        flex-direction: column;
                        gap: 1.5rem;
                        align-items: center;
                    }
                    .mySlides {
                        max-width: 95vw;
                    }
                    .carousel-dots {
                        gap: 0.7rem;
                    }
                    .dot {
                        height: 10px;
                        width: 10px;
                    }
                }
            `}</style>
        </>
    );
}
