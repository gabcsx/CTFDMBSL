import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function OrdersPage() {
  const [transactions, setTransactions] = useState([]);
  const [modalItems, setModalItems] = useState(null);

  useEffect(() => {
    fetch('/api/transactions/deliveries')
      .then((res) => res.json())
      .then(setTransactions);
  }, []);

  const openModal = (items) => setModalItems(items);
  const closeModal = () => setModalItems(null);

  const handleDeliverClick = async (id) => {
    await fetch('/api/transactions/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    // Refresh transactions after update
    const res = await fetch('/api/transactions/deliveries');
    const updated = await res.json();
    setTransactions(updated);
  };

  const cellStyle = {
    padding: '4px 6px',
    fontSize: '0.92em',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    height: 32,
  };

  const headerStyle = {
    ...cellStyle,
    background: '#f2f2f2',
    fontWeight: 600,
    fontSize: '0.96em',
    whiteSpace: 'normal',
    wordBreak: 'normal',
  };

  return (
    <AdminLayout>
      <h2 style={{ color: '#e75480', marginBottom: 16, fontSize: '1.2em' }}>
        Deliveries
      </h2>
      <div
        style={{
          background: '#fff',
          borderRadius: 6,
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          padding: 14,
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '5%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={headerStyle}>#</th>
              <th style={headerStyle}>USERNAME</th>
              <th style={headerStyle}>EMAIL</th>
              <th style={headerStyle}>PURCHASED ITEMS</th>
              <th style={headerStyle}>TOTAL PRICE</th>
              <th style={headerStyle}>PURCHASE DATE</th>
              <th style={headerStyle}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, idx) => (
              <tr key={t.id}>
                <td style={cellStyle}>{idx + 1}</td>
                <td style={cellStyle}>{t.username}</td>
                <td style={cellStyle}>{t.email}</td>
                <td
  style={{ ...cellStyle, cursor: 'pointer', color: '#1976d2' }}
  onClick={() => openModal(t.orderItems.map(i => i.product.name))}
>
  {t.orderItems.length > 2
    ? `${t.orderItems.slice(0, 2).map(i => i.product.name).join(', ')}...`
    : t.orderItems.map(i => i.product.name).join(', ')}
</td>
                <td style={cellStyle}>₱{(t.totalPrice).toFixed(2)}</td>
                <td style={cellStyle}>{new Date(t.purchaseDate).toLocaleDateString()}</td>
                <td style={cellStyle}>
                  {t.status === 'ONGOING' ? (
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '10px',
                        fontSize: '0.91em',
                        fontWeight: 500,
                        color: '#fff',
                        backgroundColor: '#9e9e9e',
                      }}
                    >
                      ONGOING
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDeliverClick(t.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '10px',
                        fontSize: '0.91em',
                        fontWeight: 500,
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        backgroundColor: '#4caf50',
                      }}
                    >
                      DELIVER
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalItems && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              padding: '20px 30px',
              borderRadius: 8,
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 12 }}>Ordered Items</h3>
            <p>{modalItems.join(', ')}</p>
            <button
              onClick={closeModal}
              style={{
                marginTop: 20,
                padding: '6px 12px',
                borderRadius: 4,
                border: 'none',
                background: '#e75480',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
