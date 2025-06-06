import Head from 'next/head';
import Header from '../components/Header';
import { useEffect, useState } from 'react';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('/api/my-orders/my-orders');
      const data = await res.json();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const handleMarkReceived = async (orderId) => {
    const res = await fetch(`/api/my-orders/${orderId}`, {
      method: 'PATCH',
    });

    if (res.ok) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: 'COMPLETED' } : order
        )
      );
    }
  };

  return (
    <>
      <Head>
        <title>My Orders - Cinema SkinFX</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="View your past Cinema SkinFX orders." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <section className="account-creation">
          <h2>My Orders</h2>

          <div className="product-summary scroll-container">
            <h3>Order History</h3>

            {orders.map((order) => (
              <div key={order.id} className="product-item" style={{ marginBottom: '1rem' }}>
                <strong>Order #{order.id}</strong>
                <div style={{ margin: '0.5rem 0' }}>
                  {order.items.map((item) => (
                    <div key={item.id} style={{ marginBottom: '0.4rem' }}>
                      {item.name} – {item.quantity} pcs (₱{(item.price * item.quantity).toFixed(2)})
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Total: ₱{order.totalPrice.toFixed(2)}</span>
                  <button
                    className="btn"
                    disabled={order.status === 'SUCCESS' || order.status === 'COMPLETED'}
                    onClick={() => handleMarkReceived(order.id)}
                  >
                    {order.status === 'SUCCESS'
                      ? 'Waiting for Delivery'
                      : order.status === 'COMPLETED'
                      ? 'COMPLETE'
                      : 'Mark as Received'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 Cinema SkinFX. Powered by CosmetiCore. All rights reserved.</p>
      </footer>

      <style jsx>{`
        .account-creation h2 {
          text-align: center;
          margin-bottom: 2rem;
        }

        .product-summary h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          border-bottom: 2px solid #333;
          padding-bottom: 0.25rem;
        }

        .product-summary.scroll-container {
          max-height: 500px;
          overflow-y: auto;
          padding-right: 1rem;
        }

        .btn {
          background-color: #333;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn:disabled {
          background-color: #aaa;
          cursor: not-allowed;
        }

        .product-item {
          border-bottom: 1px solid #ccc;
          padding-bottom: 1rem;
        }
      `}</style>
    </>
  );
}
