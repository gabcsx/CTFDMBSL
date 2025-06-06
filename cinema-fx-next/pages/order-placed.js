import Head from 'next/head';
import Header from '../components/Header';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react'; 
import { useRouter } from 'next/router';

export default function OrderPlaced() {
  const { data: session, status } = useSession();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const orderRef = useRef(); 

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/order-latest')
        .then((res) => res.json())
        .then((data) => {
          setOrderDetails(data);
          setLoading(false);
        });
    }
  }, [status]);

  const handleDownloadPDF = async () => {
  const html2pdf = (await import('html2pdf.js')).default;

  const element = orderRef.current;
  const opt = {
    margin: [20, 10, 10, 10],
    filename: 'Order-receipt.pdf',
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: { scale: 4, dpi: 192, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
};


  if (status === 'loading' || loading) {
    return (
      <>
        <Header />
        <main>
          <section className="account-creation receipt">
            <h2>Loading...</h2>
          </section>
        </main>
      </>
    );
  }

  if (!session) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  return (
    <>
      <Head>
        <title>Order Placed - Cinema SkinFX</title>
      </Head>

      <Header />

      <main>
        <section className="account-creation receipt">
          <h2>Order Placed!</h2>

          {/* Order info */}
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={orderDetails.username} readOnly />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="text" value={orderDetails.email} readOnly />
          </div>
          <div className="form-group">
            <label>Purchase Date</label>
            <input
              type="text"
              value={new Date(orderDetails.purchaseDate).toLocaleDateString()}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" value={orderDetails.address || 'N/A'} readOnly />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" value={orderDetails.phone || 'N/A'} readOnly />
          </div>

          {/* Ordered Items */}
          {orderDetails.items && orderDetails.items.length > 0 && (
            <div className="ordered-items">
              <h3>Ordered Items</h3>
              <ul>
                {orderDetails.items.map((item, index) => (
                  <li key={index}>
                    <span>{item.productName}</span>
                    <span>{item.quantity} × ₱{item.price}</span>
                  </li>
                ))}
              </ul>
              <div className="total">
                <strong>Total:</strong> ₱{orderDetails.totalPrice.toFixed(2)}
              </div>
            </div>
          )}
        </section>

        <div className="button-group">
  <button className="btn" onClick={handleDownloadPDF}>
    Save receipt
  </button>
  <button className="btn" onClick={() => router.push('/')}>
    Return to Home
  </button>
</div>
      </main>

      <footer>
        <p>&copy; 2025 Cinema SkinFX. Powered by CosmetiCore. All rights reserved.</p>
      </footer>

      <div style={{ display: 'none' }}>
  <section ref={orderRef} className="pdf-receipt">
    <h1>Receipt</h1>
    <p><strong>Username:</strong> {orderDetails.username}</p>
    <p><strong>Email:</strong> {orderDetails.email}</p>
    <p><strong>Purchase Date:</strong> {new Date(orderDetails.purchaseDate).toLocaleDateString()}</p>
    <p><strong>Address:</strong> {orderDetails.address || 'N/A'}</p>
    <p><strong>Phone Number:</strong> {orderDetails.phone || 'N/A'}</p>

    <h3>Items</h3>
    <ul>
      {orderDetails.items.map((item, index) => (
        <li key={index}>
          {item.productName} — {item.quantity} × ₱{item.price}
        </li>
      ))}
    </ul>

    <p><strong>Total:</strong> ₱{orderDetails.totalPrice.toFixed(2)}</p>
  </section>
</div>

<style jsx>{`
       

        h2 {
          text-align: center;
          margin-bottom: 1.5rem;
          font-weight: 700;
          letter-spacing: 1px;
          border-bottom: 1px dashed #999;
          padding-bottom: 0.5rem;
        }

        .form-group {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          border-bottom: 1px dotted #ddd;
          padding-bottom: 0.3rem;
        }

        label {
          flex: 1;
          font-weight: 600;
          font-size: 0.9rem;
          color: #555;
        }

        input {
          flex: 1.2;
          padding: 0.3rem 0.5rem;
          font-size: 0.9rem;
          border: none;
          background-color: transparent;
          color: #222;
          text-align: right;
          font-family: inherit;
          font-weight: 600;
          pointer-events: none;
        }

        input[readonly] {
          background-color: transparent;
          color: #222;
        }     
          
        .ordered-items {
  margin-top: 2rem;
  border-top: 1px dashed #ccc;
  padding-top: 1rem;
}

.ordered-items h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #444;
  text-align: center;
}

.ordered-items ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ordered-items li {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
  font-size: 0.95rem;
  border-bottom: 1px dotted #ddd;
}

.total {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  font-weight: bold;
  font-size: 1rem;
  border-top: 2px solid #999;
  margin-top: 1rem;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem; /* space between buttons */
  margin-top: 2rem;
  flex-wrap: wrap; /* optional: handles smaller screens */
}

.btn {
  padding: 0.6rem 1.2rem; 
  margin-bottom: 2rem;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

  .pdf-receipt {
    font-family: 'Courier New', Courier, monospace;
    padding: 20mm;
    width: 180mm; 
    max-width: 90%; 
    color: #111;
    margin: 0 auto;
    box-sizing: border-box;
  border: 0.5mm solid #ddd; 
  background-color: #f9f9f9; 
  }

  .pdf-receipt h1 {
    text-align: center;
    font-size: 28px; 
    margin-bottom: 1.5rem;
  }

  .pdf-receipt p,
  .pdf-receipt li {
    font-size: 16px; 
    line-height: 1.5; 
  }

  .pdf-receipt h3 {
    font-size: 20px;
    margin-top: 1.5rem;
    margin-bottom: 0.8rem;
    text-align: center;
  }

  .pdf-receipt ul {
    list-style: none;
    padding: 0;
    margin-bottom: 1.5rem;
  }

  .pdf-receipt li {
    margin-bottom: 0.5rem;
    border-bottom: 1px dotted #ccc;
    padding-bottom: 0.3rem;
  }

  .pdf-receipt strong {
    font-weight: bold;


      `}</style>
      
    </>
  );
}
