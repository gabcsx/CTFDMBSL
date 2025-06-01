import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../components/Header"; // Adjust as needed

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  // Load cart from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(cart);
    }
  }, []);

  // Update subtotal when cartItems change
  useEffect(() => {
    setSubtotal(
      cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );
  }, [cartItems]);

  // Quantity change handler
  const handleQuantityChange = (id, newQty) => {
    const updated = cartItems.map((item) =>
      String(item.id) === String(id)
        ? { ...item, quantity: newQty }
        : item
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Remove item handler
  const handleRemove = (id) => {
    const updated = cartItems.filter((item) => String(item.id) !== String(id));
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <>
      <Header />
      <div className="cart-page-container">
        <h1 className="cart-title">Your cart</h1>
        <div className="cart-flex">
          {/* Left: Cart Items */}
          <div className="cart-items-col">
            <div className="cart-card">
              <div className="cart-header">
                Review your order ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
              </div>
              {cartItems.length === 0 ? (
                <div className="empty-cart">Your cart is empty.</div>
              ) : (
                cartItems.map((item) => (
                  <div className="cart-item-row" key={item.id}>
                    <div className="cart-item-image">
                        {(item.img || item.image) ? (
                            <Image
                            src={item.img || item.image}
                            alt={item.name || 'Product Image'}
                            width={100}
                            height={100}
                            style={{ objectFit: 'contain' }}
                            />
                        ) : (
                            <div className="img-placeholder" />
                        )}
                        </div>
                    <div className="cart-item-info">
                      <div className="cart-item-title">
                        {item.name}
                        <button className="cart-item-remove" onClick={() => handleRemove(item.id)}>×</button>
                      </div>
                      <div className="cart-item-desc">{item.category}</div>
                      <div className="cart-item-price">PHP {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                      <div className="cart-item-size">{item.size ? `Size: ${item.size}` : ""}</div>
                      <div className="cart-item-qty">
                        Quantity
                        <button
                          onClick={() =>
                            item.quantity > 1 &&
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="qty-btn"
                          disabled={item.quantity <= 1}
                        >
                          –
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="qty-input"
                        />
                        <button
                          onClick={() =>
                            item.quantity < 99 &&
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="qty-btn"
                          disabled={item.quantity >= 99}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Right: Order Summary */}
          <div className="cart-summary-col">
            <div className="cart-summary-card">
              <div className="summary-title">Order summary</div>
              {cartItems.map((item) => (
                <div className="summary-item" key={item.id}>
                  {item.quantity} × {item.name}
                  <span className="summary-item-price">
                    PHP {(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
              <div className="summary-separator" />
              <div className="summary-subtotal">
                Subtotal
                <span>
                  PHP {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="summary-shipping">
                Shipping rate is calculated on checkout
              </div>
              <div className="summary-total">
                Order Total
                <span>
                  PHP {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <button className="checkout-btn">CHECK OUT</button>
            </div>
          </div>
        </div>
        <style jsx>{`
          .cart-page-container {
            max-width: 1200px;
            margin: 40px auto 0 auto;
            padding: 0 16px 40px 16px;
          }
          .cart-title {
            text-align: center;
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 24px;
          }
          .cart-flex {
            display: flex;
            gap: 32px;
            align-items: flex-start;
          }
          .cart-items-col {
            flex: 2;
          }
          .cart-summary-col {
            flex: 1;
            min-width: 340px;
          }
          .cart-card {
            background: #fff;
            border: 1px solid #bbb;
            border-radius: 8px;
            padding: 28px 32px;
          }
          .cart-header {
            font-weight: bold;
            font-size: 1.4rem;
            margin-bottom: 22px;
            border-bottom: 1px solid #eee;
            padding-bottom: 12px;
          }
          .cart-item-row {
            display: flex;
            border-bottom: 1px solid #eee;
            padding: 26px 0;
            gap: 28px;
          }
          .cart-item-image {
            width: 110px;
            min-width: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .img-placeholder {
            width: 100px;
            height: 100px;
            background: #f2f2f2;
            border-radius: 8px;
          }
          .cart-item-info {
            flex: 1;
            position: relative;
          }
          .cart-item-title {
            font-weight: 700;
            font-size: 1.1rem;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .cart-item-remove {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #222;
            cursor: pointer;
            font-weight: bold;
            margin-left: 16px;
          }
          .cart-item-desc {
            color: #666;
            font-size: 0.98rem;
            margin-bottom: 2px;
          }
          .cart-item-price {
            font-weight: 600;
            margin-bottom: 2px;
          }
          .cart-item-size {
            font-size: 0.95rem;
            color: #888;
            margin-bottom: 10px;
          }
          .cart-item-qty {
            margin-top: 2px;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 1rem;
          }
          .qty-btn {
            background: #fff;
            border: 1px solid #bbb;
            border-radius: 4px;
            width: 34px;
            height: 32px;
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
            margin: 0 2px;
          }
          .qty-input {
            width: 34px;
            text-align: center;
            font-size: 16px;
            background: #fafafa;
            border: 1px solid #ccc;
            border-radius: 4px;
            height: 32px;
          }
          .cart-summary-card {
            background: #fff;
            border: 1px solid #bbb;
            border-radius: 8px;
            padding: 26px 28px 32px 28px;
            margin-top: 0;
          }
          .summary-title {
            font-weight: bold;
            margin-bottom: 16px;
            font-size: 1.15rem;
          }
          .summary-item {
            font-size: 1rem;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
          }
          .summary-separator {
            border-top: 1px solid #eee;
            margin: 16px 0;
          }
          .summary-subtotal {
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            font-weight: 500;
          }
          .summary-shipping {
            color: #e57373;
            font-size: 0.96rem;
            margin-bottom: 8px;
          }
          .summary-total {
            background: #e0e0e0;
            padding: 10px 0;
            font-weight: bold;
            font-size: 1.1rem;
            border-radius: 4px;
            margin-bottom: 18px;
            display: flex;
            justify-content: space-between;
          }
          .checkout-btn {
            width: 100%;
            background: #ffbdbd;
            color: #fff;
            border: none;
            padding: 13px 0;
            font-weight: bold;
            font-size: 1.05rem;
            border-radius: 4px;
            cursor: pointer;
            letter-spacing: 1px;
            margin-top: 6px;
          }
          .empty-cart {
            color: #888;
            text-align: center;
            font-size: 1.1rem;
            padding: 60px 0;
          }
          @media (max-width: 900px) {
            .cart-flex {
              flex-direction: column;
            }
            .cart-summary-col {
              min-width: 0;
              margin-top: 36px;
            }
          }
        `}</style>
      </div>
    </>
  );
}
