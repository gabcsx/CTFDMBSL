// pages/cart.js
import Head from "next/head";
import Header from "../components/Header";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Cart() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cart items
  const [orderItems, setOrderItems] = useState([]);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  // Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Fetch cart items
  useEffect(() => {
    async function fetchCartItems() {
      try {
        const sessionId = localStorage.getItem("sessionId");
        const res = await fetch(
          `/api/cart${sessionId ? `?sessionId=${sessionId}` : ""}`
        );
        if (!res.ok) throw new Error("Failed to fetch cart items");
        const data = await res.json();
        const formatted = data.map((item) => ({
          id: item.id,
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image,
        }));
        setOrderItems(formatted);
      } catch {
        setOrderItems([]);
      }
    }
    fetchCartItems();
  }, []);

  // Fetch user info
  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId || (userInfo && userInfo.username)) {
      setLoading(false);
      return;
    }
    async function fetchUser() {
      try {
        const res = await fetch("/api/user");
        if (res.status === 401) return;
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUserInfo({
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch (err) {
        if (err.message !== "Failed to fetch user data") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
    // eslint-disable-next-line
  }, []);

  // Toggle edit/save
  const handleToggleEdit = () => {
    if (isEditing) {
      if (!/^\d{11}$/.test(userInfo.phone)) {
        alert("Phone number must be 11 digits.");
        return;
      }
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 11);
      setUserInfo({ ...userInfo, phone: digitsOnly });
    } else {
      setUserInfo({ ...userInfo, [name]: value });
    }
  };

  // Order total
  const orderTotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Increase qty
  const handleIncrease = async (itemId) => {
    const item = orderItems.find((i) => i.id === itemId);
    if (!item) return;
    setUpdatingItemId(itemId);
    try {
      const sessionId = localStorage.getItem("sessionId");
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          quantity: 1,
          sessionId,
        }),
      });
      if (!res.ok) {
        setToastMessage("Error increasing quantity");
        setToastType("error");
        setToastOpen(true);
        return;
      }
      setOrderItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } catch {
      setToastMessage("Network error");
      setToastType("error");
      setToastOpen(true);
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Decrease qty
  const handleDecrease = async (itemId) => {
    const item = orderItems.find((i) => i.id === itemId);
    if (!item || item.quantity <= 1) return;
    setUpdatingItemId(itemId);
    try {
      const sessionId = localStorage.getItem("sessionId");
      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          removeQty: 1,
          sessionId,
        }),
      });
      if (!res.ok) {
        setToastMessage("Error decreasing quantity");
        setToastType("error");
        setToastOpen(true);
        return;
      }
      setOrderItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        )
      );
    } catch {
      setToastMessage("Network error");
      setToastType("error");
      setToastOpen(true);
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Remove → confirm modal
  const handleRemove = (itemId) => {
    setItemToRemove(itemId);
    setConfirmOpen(true);
  };
  const handleConfirmRemove = async () => {
    if (!itemToRemove) return;
    setUpdatingItemId(itemToRemove);
    setConfirmOpen(false);
    try {
      const sessionId = localStorage.getItem("sessionId");
      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: itemToRemove, sessionId }),
      });
      if (!res.ok) {
        setToastMessage("Error removing item");
        setToastType("error");
        setToastOpen(true);
        return;
      }
      setOrderItems((prev) => prev.filter((i) => i.id !== itemToRemove));
      setToastMessage("Item removed from cart");
      setToastType("success");
      setToastOpen(true);
    } finally {
      setUpdatingItemId(null);
      setItemToRemove(null);
    }
  };

  // Save user info
  const handleSave = async () => {
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userInfo.username,
          address: userInfo.address,
          phone: userInfo.phone,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setToastMessage(err.message || "Failed to update info");
        setToastType("error");
        setToastOpen(true);
        return;
      }
      setIsEditing(false);
      setToastMessage("Updated successfully!");
      setToastType("success");
      setToastOpen(true);
    } catch (err) {
      setToastMessage("Error updating user info: " + err.message);
      setToastType("error");
      setToastOpen(true);
    }
  };

  // Place order
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/order/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userInfo.username,
          email: userInfo.email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setToastMessage(data.message || "Order placed successfully!");
        setToastType("success");
        setToastOpen(true);
        setTimeout(() => {
          setOrderItems([]);
          router.push("/order-placed");
        }, 1000);
      } else {
        setToastMessage(data.message || "Order failed.");
        setToastType("error");
        setToastOpen(true);
        setOrderItems([]);
      }
    } catch (err) {
      setToastMessage("Network error: " + err.message);
      setToastType("error");
      setToastOpen(true);
    }
  };

  if (loading) return <p>Loading user info...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Head>
        <title>Cart - Cinema SkinFX</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Checkout your Cinema SkinFX order." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Toast
        show={toastOpen}
        message={toastMessage}
        onClose={() => setToastOpen(false)}
        type={toastType}
      />

      <main style={{ minHeight: "100vh" }}>
        <section className="checkout-container">
          {/* ORDER SUMMARY */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div id="orderItems">
              {orderItems.map((item) => (
                <div key={item.id} className="product-item">
                  <div className="prod-img-wrap">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="prod-img"
                      />
                    ) : (
                      <div className="prod-img-placeholder" />
                    )}
                  </div>
                  <div className="prod-info">
                    <strong>{item.name}</strong>
                    <div className="prod-row">
                      <button
                        type="button"
                        className="qty-btn"
                        aria-label="Decrease quantity"
                        disabled={
                          item.quantity <= 1 || updatingItemId === item.id
                        }
                        onClick={() => handleDecrease(item.id)}
                      >
                        –
                      </button>
                      <span className="prod-qty">{item.quantity}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        aria-label="Increase quantity"
                        disabled={updatingItemId === item.id}
                        onClick={() => handleIncrease(item.id)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="remove-btn"
                        aria-label="Remove item"
                        disabled={updatingItemId === item.id}
                        onClick={() => handleRemove(item.id)}
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                  <span className="prod-price">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="product-item total-row">
              <span>Total</span>
              <span id="orderTotal">₱{orderTotal.toFixed(2)}</span>
            </div>

            {!userInfo.email || !userInfo.username ? (
              <Link
                href="/create-account"
                className="btn"
                style={{
                  width: "100%",
                  display: "block",
                  textAlign: "center",
                  borderRadius: 2,
                }}
              >
                Place Order
              </Link>
            ) : null}
          </div>

          {/* CHECKOUT FORM */}
          {userInfo.email && userInfo.username && (
            <div className="checkout-form">
              <h2>Checkout</h2>
              <form id="cartForm" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={userInfo.username}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userInfo.email}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={userInfo.phone}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Shipping Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={userInfo.address}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleToggleEdit}
                  className="btn"
                  style={{ marginBottom: "1rem" }}
                >
                  {isEditing ? "Save Phone & Address" : "Edit Phone & Address"}
                </button>
                <button type="submit" className="btn" style={{ width: "100%" }}>
                  Place Order
                </button>
              </form>
            </div>
          )}
        </section>
      </main>

      <ConfirmModal
        open={confirmOpen}
        message="Remove this item from your cart?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmRemove}
      />

      <footer>
        <p>
          &copy; 2025 Cinema SkinFX. Powered by CosmetiCore. All rights
          reserved.
        </p>
      </footer>

      <style jsx>{`
        .checkout-container {
          display: flex;
          gap: 32px;
          max-width: 1000px;
          margin: 40px auto;
          align-items: flex-start;
        }

        .order-summary,
        .checkout-form {
          flex: 1;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
          padding: 32px 28px 24px 28px;
          min-width: 340px;
        }

        #orderItems {
          max-height: 400px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .order-summary h3,
        .checkout-form h2 {
          text-align: center;
          color: #e91e63;
          margin-bottom: 1.5rem;
        }

        .order-summary h3 {
          border-bottom: 2px solid #333;
          padding-bottom: 0.25rem;
        }

        .checkout-form h2 {
          margin-bottom: 2rem;
        }

        form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        input {
          padding: 0.6rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        input[readonly] {
          background: #f5f5f5;
          color: #777;
          cursor: default;
        }

        .btn {
          background: #e91e63;
          color: #fff;
          border: none;
          padding: 0.7rem 1.5rem;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn:hover {
          background: #b71c46;
        }

        .product-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.7rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.7rem;
        }

        .product-item.total-row {
          border-top: 1px solid #ccc;
          border-bottom: none;
          font-weight: 700;
          margin-top: 1rem;
          padding-top: 0.7rem;
          padding-bottom: 0;
        }

        .prod-img-wrap {
          flex: 0 0 96px;
          width: 96px;
          height: 96px;
          border-radius: 6px;
          background: #fafafa;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          overflow: hidden;
        }

        .prod-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 6px;
        }

        .prod-img-placeholder {
          width: 60px;
          height: 60px;
          background: #ececec;
          border-radius: 6px;
        }

        .prod-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-right: 8px;
        }

        .prod-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.2rem;
        }

        .prod-qty {
          min-width: 28px;
          text-align: center;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .qty-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid #e91e63;
          background: #fff;
          color: #e91e63;
          font-size: 1.2rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qty-btn:disabled {
          color: #ccc;
          border-color: #ccc;
          cursor: not-allowed;
        }

        .qty-btn:hover:not(:disabled) {
          background: #e91e63;
          color: #fff;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #e91e63;
          font-size: 2rem;
          font-weight: bold;
          cursor: pointer;
          line-height: 1;
          padding: 0 0.2rem;
          margin-left: 0.2rem;
          transition: color 0.2s;
        }

        .remove-btn:disabled {
          color: #ccc;
          cursor: not-allowed;
        }

        .remove-btn:hover:not(:disabled) {
          color: #b71c46;
        }

        .prod-price {
          min-width: 90px;
          text-align: right;
          font-weight: 600;
          font-size: 1.06rem;
        }

        @media (max-width: 900px) {
          .checkout-container {
            flex-direction: column;
            gap: 24px;
            max-width: 98vw;
            padding: 0 2vw;
          }

          .order-summary,
          .checkout-form {
            min-width: 0;
            width: 100%;
          }
        }

        @media (max-width: 600px) {
          .order-summary,
          .checkout-form {
            padding: 14px 4vw;
          }

          .product-item,
          .product-item.total-row {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 0.4rem;
          }

          .prod-img-wrap {
            margin-bottom: 6px;
          }
        }
      `}</style>
    </>
  );
}
