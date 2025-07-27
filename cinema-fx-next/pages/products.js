// pages/products.js
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import Toast from "../components/Toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Products({ products }) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [quantities, setQuantities] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const { data: session } = useSession();
  const router = useRouter();

  // Category display options
  const categories = [
    { value: "all", label: "All Products" },
    { value: "cleansers", label: "Cleansers" },
    { value: "deodorant", label: "Deodorant" },
    { value: "hair cares", label: "Hair Cares" },
    { value: "moisturizers", label: "Moisturizers" },
    { value: "serums", label: "Serums" },
    { value: "soaps", label: "Soaps" },
    { value: "sunscreens", label: "Sunscreens" },
    { value: "toners", label: "Toners" },
    { value: "whitening", label: "Whitening" },
  ];

  // Map filter values to possible product category values
  const categoryMap = {
    all: [],
    cleansers: ["cleanser", "cleansers", "Cleanser", "Cleansers"],
    deodorant: ["deodorant", "Deodorant"],
    "hair cares": ["hair care", "hair cares", "Hair Care", "Hair Cares"],
    moisturizers: [
      "moisturizer",
      "moisturizers",
      "Moisturizer",
      "Moisturizers",
    ],
    serums: ["serum", "serums", "Serum", "Serums"],
    soaps: ["soap", "soaps", "Soap", "Soaps"],
    sunscreens: ["sunscreen", "sunscreens", "Sunscreen", "Sunscreens"],
    toners: ["toner", "toners", "Toner", "Toners"],
    whitening: ["whitening", "Whitening"],
  };

  useEffect(() => {
    let filtered = products.filter((product) => {
      const productCategory = (product.category || "").toLowerCase().trim();
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        categoryMap[selectedCategory].some(
          (cat) => cat.toLowerCase() === productCategory
        );
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy, products]);

  // Toast helper
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleAddToCart = async (product) => {
    const quantity = quantities[product.id] || 1;

    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = getSessionId();
      localStorage.setItem("sessionId", sessionId);
    }

    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        productId: product.id,
        quantity,
      }),
    });

    if (res.ok) {
      showToast(`Added ${quantity}x ${product.name} to cart!`, "success");
    } else {
      showToast("Failed to add to cart", "error");
    }
  };

  // Quantity button handlers
  const handleDecrease = (product) => {
    setQuantities((prev) => ({
      ...prev,
      [product.id]: Math.max(1, (prev[product.id] || 1) - 1),
    }));
  };

  const handleIncrease = (product) => {
    setQuantities((prev) => ({
      ...prev,
      [product.id]: Math.min(product.stock, (prev[product.id] || 1) + 1),
    }));
  };

  function getSessionId() {
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem("sessionId", sessionId);
      console.log("[getSessionId] Generated new sessionId:", sessionId);
    } else {
      console.log("[getSessionId] Found existing sessionId:", sessionId);
    }

    // Set the cookie (expires in 30 days, path=/ for global access)
    document.cookie = `sessionId=${sessionId}; path=/; max-age=${
      60 * 60 * 24 * 30
    }`;

    return sessionId;
  }

  return (
    <>
      <Head>
        <title>All Products - Cinema SkinFX</title>
        <meta
          name="description"
          content="Browse all Cinema SkinFX products - premium skincare solutions for every need"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      {/* Toast notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <main className="products-page">
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
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
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
              Showing {filteredProducts.length} result
              {filteredProducts.length !== 1 ? "s" : ""}
            </span>
          </div>
        </section>

        <section className="products-grid-section">
          <div className="container">
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map((product) => (
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
                      <p className="product-description">
                        {product.description}
                      </p>
                      <div className="product-price">
                        ₱{product.price.toLocaleString()}
                      </div>
                      <div className="product-stock">
                        {product.stock > 0
                          ? `In stock: ${product.stock}`
                          : "Out of stock"}
                      </div>

                      {product.stock > 0 && (
                        <div className="quantity-control">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => handleDecrease(product)}
                            aria-label="Decrease quantity"
                          >
                            –
                          </button>
                          <input
                            type="text"
                            className="qty-display"
                            value={quantities[product.id] || 1}
                            readOnly
                            tabIndex={-1}
                          />
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => handleIncrease(product)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      )}

                      <button
                        className={`btn product-btn ${
                          product.stock === 0 ? "disabled" : ""
                        }`}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
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
        <p>
          &copy; 2025 Cinema SkinFX. Powered by CosmetiCore. All rights
          reserved.
        </p>
      </footer>

      <style jsx>{`
        .products-page {
          min-height: 100vh;
        }
        .filters-section {
          background: white;
          padding: 2rem 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
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
          text-align: justify;
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
        /* --- Quantity Button Styles --- */
        .quantity-control {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.8rem;
        }
        .qty-btn {
          background: #e75480;
          color: #fff;
          border: none;
          width: 38px;
          height: 38px;
          font-size: 1.6rem;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qty-btn:active,
        .qty-btn:focus {
          background: #d13c6f;
          outline: none;
        }
        .qty-display {
          width: 48px;
          height: 38px;
          text-align: center;
          font-size: 1.2rem;
          border: 2px solid #e75480;
          border-radius: 6px;
          margin: 0 6px;
          background: #fff;
          color: #222;
          pointer-events: none;
        }
        .product-stock {
          font-size: 0.95rem;
          color: #444;
          margin-bottom: 0.6rem;
          font-weight: 500;
        }
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
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
      `}</style>
    </>
  );
}

// Fetch products on each request from the database
export async function getServerSideProps() {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  const products = await prisma.product.findMany();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
