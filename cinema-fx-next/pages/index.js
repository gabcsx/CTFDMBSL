import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image'; // Added for optimized images
import Link from 'next/link';
import Header from '../components/Header';

export default function Home() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const slideshowInterval = useRef(null);

  // Fetch products from your API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load products:', error);
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Slideshow auto-change effect
  useEffect(() => {
    if (!isPaused && products.length > 0) {
      slideshowInterval.current = setInterval(() => {
        setSlideIndex((prev) => (prev + 1) % products.length);
      }, 10000);
    }
    return () => clearInterval(slideshowInterval.current);
  }, [isPaused, products]);

  function nextSlide() {
    setSlideIndex((prev) => (prev + 1) % products.length);
  }

  function prevSlide() {
    setSlideIndex((prev) => (prev - 1 + products.length) % products.length);
  }

  function togglePause() {
    setIsPaused((prev) => !prev);
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

      {/* Header Component */}
      <Header />

      <main>
        {/* Hero Section */}
        <section className="hero" id="home">
          <h2>Your Beauty, Our Passion</h2>
          <p>Discover the best in cosmetics for your unique style.</p>
          <Link href="/products" className="btn">
  Shop Now
</Link>
        </section>

        {/* Slideshow Section */}
        <section id="products" className="products-section">
          <h2>Recommended for you</h2>

          <div className="slideshow-container">
            {/* Loading state */}
            {loading && <p>Loading products...</p>}

            {/* If no products */}
            {!loading && products.length === 0 && (
              <p>No products available at the moment.</p>
            )}

            {/* Slideshow slides */}
            {!loading &&
              products.length > 0 &&
              products.map((product, idx) => (
                <div
                  key={product.id}
                  className={`mySlides fade ${idx === slideIndex ? 'active' : ''}`}
                  role="region"
                  aria-label={`Slide ${idx + 1} of ${products.length}`}
                >
                  <Image
                    src={product.image || '/assets/placeholder.png'} // Adjust if your DB uses a different field
                    alt={product.name || 'Product Image'}
                    width={800}
                    height={300}
                    layout="responsive"
                    objectFit="contain"
                    priority={idx === 0}
                    placeholder="blur"
                    blurDataURL="/assets/placeholder.png"
                  />
                  <div className="slide-content">
  <h3>{product.name}</h3>
  <p>{product.description}</p>
  <Link href="/products" className="btn">
    View Products
  </Link>
</div>
                </div>
              ))}

            {/* Slideshow controls */}
            {!loading && products.length > 0 && (
              <div className="slideshow-controls">
                <button
                  className="nav-button"
                  aria-label="Previous Slide"
                  onClick={prevSlide}
                >
                  ❮
                </button>
                <button
                  className="pause-button"
                  aria-label={isPaused ? 'Play Slideshow' : 'Pause Slideshow'}
                  onClick={togglePause}
                >
                  {isPaused ? '▶️' : '⏸️'}
                </button>
                <button
                  className="nav-button"
                  aria-label="Next Slide"
                  onClick={nextSlide}
                >
                  ❯
                </button>
              </div>
            )}
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

      <style jsx>{`
        .mySlides {
          display: none;
        }
        .mySlides.active {
          display: block;
        }
      `}</style>
    </>
  );
}
