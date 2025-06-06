// pages/products.js
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../components/Header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Products({ products }) {
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [quantities, setQuantities] = useState({});
    const { data: session } = useSession();
const router = useRouter();

    const categories = [
        { value: 'all', label: 'All Products' },
        { value: 'serums', label: 'Serums' },
        { value: 'moisturizers', label: 'Moisturizers' },
        { value: 'toners', label: 'Toners' },
        { value: 'cleansers', label: 'Cleansers' },
        { value: 'whitening', label: 'Whitening' },
        { value: 'hair-care', label: 'Hair Care' }
    ];

    useEffect(() => {
        let filtered = products.filter(product => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        setFilteredProducts(filtered);
    }, [searchTerm, selectedCategory, sortBy, products]);

    const handleQuantityChange = (productId, value) => {
        const quantity = Math.max(1, parseInt(value) || 1);
        setQuantities(prev => ({ ...prev, [productId]: quantity }));
    };

    const handleAddToCart = async (product) => {
  if (!session) {
    // Redirect to login if not authenticated
    router.push('/api/auth/signin');
    return;
  }

  const quantity = quantities[product.id] || 1;

  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('sessionId', sessionId);
  }

  const res = await fetch('/api/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      productId: product.id,
      quantity,
    }),
  });

  if (res.ok) {
    alert(`Added ${quantity} x ${product.name} to cart!`);
  } else {
    alert('Failed to add to cart');
  }
};

    // ... rest of your component remains unchanged, just replace allProducts with products or filteredProducts

    return (
      <>
        <Head>
          <title>All Products - Cinema SkinFX</title>
          <meta name="description" content="Browse all Cinema SkinFX products - premium skincare solutions for every need" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <Header />

        <main className="products-page">
          {/* Add filters UI here if you have */}

          <section className="filters-section">
  <div className="container filters-container">
    <input
      type="text"
      className="filter-search"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <select
      className="filter-select"
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      {categories.map(cat => (
        <option key={cat.value} value={cat.value}>{cat.label}</option>
      ))}
    </select>
    <select
      className="filter-select"
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
    >
      <option value="name">Sort by Name</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
    </select>
    <span className="results-count">
      Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
    </span>
  </div>
</section>

          
          <section className="products-grid-section">
            <div className="container">
              {filteredProducts.length > 0 ? (
                <div className="products-grid">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                      {product.featured && (
                        <div className="featured-badge">Best Seller</div>
                      )}
                      {product.stock === 0 && (
                        <div className="out-of-stock-badge">Out of Stock</div>
                      )}

                      <div className="product-image">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={300}
                          height={300}
                          objectFit="contain"
                          placeholder="blur"
                          blurDataURL="/assets/placeholder.png"
                        />
                      </div>

                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-description">{product.description}</p>
                        <div className="product-price">₱{product.price.toLocaleString()}</div>
                        <div className="product-stock">
                          {product.stock > 0 ? `In stock: ${product.stock}` : 'Out of stock'}
                        </div>

                        {product.stock > 0 && (
                          <input
                            type="number"
                            min="1"
                            value={quantities[product.id] || 1}
                            onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                            className="quantity-input"
                          />
                        )}

                        <button
                          className={`btn product-btn ${product.stock === 0 ? 'disabled' : ''}`}
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                        >
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-products">
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </section>
        </main>

        <footer>
          <p>&copy; 2025 Cinema SkinFX. Powered by CosmetiCore. All rights reserved.</p>
        </footer>

        <style jsx>{`
                .products-page {
    min-height: 100vh;
}

.products-hero {
    background: linear-gradient(135deg, #e91e63, #c2185b);
    color: white;
    padding: 4rem 0;
    text-align: center;
}

.products-hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.products-hero p {
    font-size: 1.2rem;
    opacity: 0.9;
}

.filters-section {
    background: white;
    padding: 2rem 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: sticky;
    top: 80px;
    z-index: 100;
}

.filters-container {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 1rem;
}

.filter-search,
.filter-select {
    padding: 0.75rem 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.filter-search:focus,
.filter-select:focus {
    outline: none;
    border-color: #e91e63;
}

.filter-search {
    min-width: 250px;
}

.filter-select {
    min-width: 180px;
}

.results-count {
    color: #666;
    font-size: 0.9rem;
}

.products-grid-section {
    padding: 3rem 0;
    background: #fafafa;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
}

.product-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.featured-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: #e91e63;
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    z-index: 2;
}

.out-of-stock-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #666;
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    z-index: 2;
}

.product-image {
    height: 250px;
    background: #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.product-info {
    padding: 1.5rem;
}

.product-name {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    color: #222;
    font-weight: 600;
}

.product-description {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    line-height: 1.5;
    min-height: 3em;
}

.product-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: #e91e63;
    margin-bottom: 1rem;
}

.product-btn {
    width: 100%;
    padding: 0.8rem;
    font-size: 1rem;
}

.product-btn.disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
}

.product-btn.disabled:hover {
    background-color: #ccc;
    transform: none;
    box-shadow: none;
}

.no-products {
    text-align: center;
    padding: 4rem 2rem;
    color: #666;
}

.no-products h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #444;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
    .products-hero h1 {
        font-size: 2rem;
    }

    .products-hero p {
        font-size: 1rem;
    }

    .filters-container {
        flex-direction: column;
        align-items: stretch;
    }

    .filter-search,
    .filter-select {
        width: 100%;
        min-width: auto;
    }

    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .filters-section {
        position: static;
    }
}

@media (max-width: 576px) {
    .products-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .product-card {
        margin: 0 0.5rem;
    }
}

.quantity-input {
    width: 100%;
    margin-bottom: 0.8rem;
    padding: 0.5rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    text-align: center;
}

.quantity-input:focus {
    outline: none;
    border-color: #e91e63;
}

.product-stock {
    font-size: 0.95rem;
    color: #444;
    margin-bottom: 0.6rem;
    font-weight: 500;
}

            `}</style>
      </>
    );
}

// Fetch products on each request from the database
export async function getServerSideProps() {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const products = await prisma.product.findMany();

    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
        },
    };
}
