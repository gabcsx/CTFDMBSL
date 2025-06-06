import Head from 'next/head';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Cart() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Example order items - replace with your actual cart data source
  const [orderItems, setOrderItems] = useState([]);

useEffect(() => {
  async function fetchCartItems() {
    try {
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error('Failed to fetch cart items');
      const data = await res.json();

      // Format the data to match your frontend expectation
      const formatted = data.map((item) => ({
        id: item.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));

      setOrderItems(formatted);
    } catch (err) {
      console.error(err);
      setOrderItems([]);
    }
  }

  fetchCartItems();
}, []);

  // Fetch user data from API on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user');
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();
        setUserInfo({
          username: data.username || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const handleToggleEdit = () => {
  if (isEditing) {
    if (!/^\d{11}$/.test(userInfo.phone)) {
      alert('Phone number must be 11 digits.');
      return;
    }
    handleSave();
  } else {
    setIsEditing(true);
  }
};

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === 'phone') {
    // Remove all non-digit characters and limit length to 11 digits
    const digitsOnly = value.replace(/\D/g, '').slice(0, 11);
    setUserInfo({ ...userInfo, phone: digitsOnly });
  } else {
    setUserInfo({ ...userInfo, [name]: value });
  }
};

  const orderTotal = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleRemoveQtyChange = (itemId, value) => {
  const qty = parseInt(value, 10);
  setOrderItems((prevItems) =>
    prevItems.map((item) =>
      item.id === itemId ? { ...item, removeQty: isNaN(qty) ? '' : qty } : item
    )
  );
};

const handleRemove = async (itemId) => {
  const item = orderItems.find(item => item.id === itemId);
  if (!item) return;

  const removeQty = parseInt(item.removeQty, 10);
  let confirmed = false;

if (!removeQty || removeQty <= 0) {
  confirmed = confirm("Do you want to remove all of this item from your cart?");
  if (!confirmed) return;
}

  try {
    const res = await fetch('/api/cart/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, removeQty }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert('Error removing quantity: ' + errorData.message);
      return;
    }

    setOrderItems((prevItems) => {
      const newQty = item.quantity - removeQty;
      if (newQty > 0) {
        return prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQty, removeQty: '' } : item
        );
      } else {
        return prevItems.filter((item) => item.id !== itemId);
      }
    });
  } catch (error) {
    alert('Network error: ' + error.message);
  }
};




  // Save user info to API
  const handleSave = async () => {
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userInfo.username,
          address: userInfo.address,
          phone: userInfo.phone,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update user info');
      }

      setIsEditing(false);
      alert('User info updated successfully.');
    } catch (err) {
      alert('Error updating user info: ' + err.message);
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/order/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userInfo.username,
          email: userInfo.email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setOrderItems([]);
        router.push('/order-placed');
      } else {
        alert(data.message);
        setOrderItems([]);
      }
    } catch (err) {
      alert('Network error: ' + err.message);
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

      <main>
        <section className="account-creation">
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
              id="editToggleBtn"
              onClick={handleToggleEdit}
              className="btn"
              style={{ marginBottom: '1rem' }}
            >
              {isEditing ? 'Save Phone & Address' : 'Edit Phone & Address'}
            </button>

            <div
              className="product-summary"
              style={{ marginBottom: '1.5rem' }}
            >
              <h3>Order Summary</h3>
              <div id="orderItems">
                {orderItems.map((item) => (
  <div
    key={item.id}
    className="product-item"
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem',
    }}
  >
    <div>
      <strong>{item.name}</strong>
      <div style={{ marginTop: '0.3rem' }}>
        <div>
          Current Quantity: <strong>{item.quantity}</strong>
        </div>
        <label style={{ marginRight: '0.5rem' }}>
          
          <input
            type="number"
            min="1"
            max={item.quantity}
            value={item.removeQty || ''}
            onChange={(e) => handleRemoveQtyChange(item.id, e.target.value)}
            style={{ width: '50px', marginLeft: '0.5rem' }}
          />
        </label>
        <button
        type="button"
          onClick={() => handleRemove(item.id)}
          style={{
            background: 'gray',
            color: 'white',
            border: 'none',
            padding: '0.3rem 0.6rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Remove
        </button>
      </div>
    </div>
    <span>₱{(item.price * item.quantity).toFixed(2)}</span>
  </div>
))}


              </div>
              <div
                className="product-item"
                style={{
                  fontWeight: '700',
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #ccc',
                  paddingTop: '0.5rem',
                }}
              >
                <span>Total</span>
                <span id="orderTotal">₱{orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" className="btn">
              Place Order
            </button>
          </form>
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
        form {
          display: flex;
          flex-direction: column;
        }
        .form-group {
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
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
          background-color: #f5f5f5;
          color: #777;
          cursor: default;
        }       
        .product-summary h3 {
          margin-bottom: 1rem;
          border-bottom: 2px solid #333;
          padding-bottom: 0.25rem;
        }
      `}</style>
    </>
  );
}
