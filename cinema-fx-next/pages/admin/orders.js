import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

// Sample Data
const initialOrders = [
  {
    batch: "1682656750",
    orders: [
      {
        id: 1,
        product: "Milo",
        qtyOrdered: 143,
        status: "complete",
        orderedBy: "John Doe",
        createdDate: "2023-04-28 06:39:10",
        deliveries: [
          { id: 1, dateDelivered: "2023-04-28 10:00:00", qtyDelivered: 143 },
        ],
      },
    ],
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [status, setStatus] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryHistory, setDeliveryHistory] = useState([]);

  // Compact styles
  const cellStyle = {
    padding: "4px 6px",
    fontSize: "0.92em",
    textAlign: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    height: 32,
  };
  const headerStyle = {
    ...cellStyle,
    background: "#f2f2f2",
    fontWeight: 600,
    fontSize: "0.96em",
    whiteSpace: "normal",
    wordBreak: "normal",
  };
  const buttonStyle = {
    background: "#fff",
    border: "1px solid #e75480",
    color: "#e75480",
    borderRadius: "4px",
    padding: "3px 10px",
    fontWeight: 500,
    fontSize: "0.92em",
    cursor: "pointer",
    minWidth: 60,
    margin: "0 2px",
    transition: "background 0.15s, color 0.15s",
  };
  const modalBox = {
    background: "#fff",
    borderRadius: 6,
    minWidth: 320,
    maxWidth: 540,
    width: "90vw",
    boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
    padding: 0,
    overflow: "hidden",
    fontSize: "0.95em",
  };

  // Handlers
  const handleUpdateClick = (batch, order) => {
    setSelectedBatch(batch);
    setSelectedOrder(order);
    setStatus(order.status);
    setShowModal(true);
  };
  const handleModalSave = () => setShowSuccess(true);
  const handleSuccessOk = () => {
    setOrders(prevOrders =>
      prevOrders.map(batch =>
        batch.batch === selectedBatch.batch
          ? {
            ...batch,
            orders: batch.orders.map(order => {
              if (order.id === selectedOrder.id) {
                let updatedOrder = { ...order, status };
                if (status === "complete" && order.status !== "complete") {
                  const now = new Date();
                  const deliveryRecord = {
                    id: (order.deliveries?.length || 0) + 1,
                    dateDelivered: now.toISOString().slice(0, 19).replace('T', ' '),
                    qtyDelivered: order.qtyOrdered,
                  };
                  updatedOrder.deliveries = [...(order.deliveries || []), deliveryRecord];
                }
                return updatedOrder;
              }
              return order;
            }),
          }
          : batch
      )
    );
    setShowSuccess(false);
    setShowModal(false);
    setSelectedOrder(null);
    setSelectedBatch(null);
  };
  const handleModalCancel = () => {
    setShowModal(false);
    setShowSuccess(false);
    setSelectedOrder(null);
    setSelectedBatch(null);
  };
  const handleDeliveriesClick = (order) => {
    setDeliveryHistory(order.deliveries || []);
    setShowDeliveryModal(true);
  };
  const handleDeliveryModalClose = () => {
    setShowDeliveryModal(false);
    setDeliveryHistory([]);
  };

  return (
    <AdminLayout adminName="Admin" profilePic="/profile.jpg">
      <h2 style={{ color: "#e75480", marginBottom: 16, fontSize: "1.2em" }}>List of Purchase Orders</h2>
      {orders.map((batch) => (
        <div
          key={batch.batch}
          style={{
            background: "#fff",
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            marginBottom: 16,
            padding: 14,
          }}
        >
          <div style={{ fontSize: "1em", color: "#444", marginBottom: 6 }}>
            <strong>Order ID: {batch.batch}</strong>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "5%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "8%" }} />
            </colgroup>
            <thead>
              <tr>
                <th style={headerStyle}>#</th>
                <th style={headerStyle}>PRODUCT</th>
                <th style={headerStyle}>QTY ORDERED</th>
                <th style={headerStyle}>STATUS</th>
                <th style={headerStyle}>ORDERED BY</th>
                <th style={headerStyle}>CREATED DATE</th>
                <th style={headerStyle}>DELIVERY HISTORY</th>
                <th style={headerStyle}></th>
              </tr>
            </thead>
            <tbody>
              {batch.orders.map((order, idx) => (
                <tr key={order.id}>
                  <td style={cellStyle}>{idx + 1}</td>
                  <td style={cellStyle}>{order.product}</td>
                  <td style={cellStyle}>{order.qtyOrdered}</td>
                  <td style={cellStyle}>
                    <span style={{
                      padding: "2px 10px",
                      borderRadius: "10px",
                      fontSize: "0.91em",
                      color: order.status === "pending" ? "#fff" : "#444",
                      background: order.status === "pending" ? "#1e90ff" : order.status === "incomplete" ? "#ffd700" : order.status === "complete" ? "#4caf50" : "#e57373",
                      fontWeight: 500,
                      display: "inline-block",
                    }}>{order.status}</span>
                  </td>
                  <td style={cellStyle}>{order.orderedBy}</td>
                  <td style={cellStyle}>{order.createdDate}</td>
                  <td style={cellStyle}>
                    <button
                      style={{ ...buttonStyle, borderColor: "#e86af0", color: "#23222b", minWidth: 70 }}
                      onClick={() => handleDeliveriesClick(order)}
                    >
                      Deliveries
                    </button>
                  </td>
                  <td style={cellStyle}>
                    <button
                      style={buttonStyle}
                      onClick={() => handleUpdateClick(batch, order)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Update Modal */}
      {showModal && selectedOrder && !showSuccess && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.18)", zIndex: 9999,
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={modalBox}>
            <div style={{
              background: "#1976d2", color: "#fff", padding: "10px 18px",
              fontWeight: 600, fontSize: "1em"
            }}>
              Update Purchase Order: Order ID: {selectedBatch.batch}
            </div>
            <div style={{ padding: "12px" }}>
              <table style={{ width: "100%", marginBottom: 6, tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "40%" }} />
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "30%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={headerStyle}>PRODUCT NAME</th>
                    <th style={headerStyle}>QTY ORDERED</th>
                    <th style={headerStyle}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={cellStyle}>{selectedOrder.product}</td>
                    <td style={cellStyle}>{selectedOrder.qtyOrdered}</td>
                    <td style={cellStyle}>
                      <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        style={{
                          padding: "2px 10px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "0.95em"
                        }}
                      >
                        <option value="pending">pending</option>
                        <option value="incomplete">incomplete</option>
                        <option value="complete">complete</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{
              padding: "8px 18px", background: "#f7f7f7", textAlign: "right"
            }}>
              <button
                style={{ ...buttonStyle, borderColor: "#bbb", color: "#444", background: "#fff", marginRight: 4 }}
                onClick={handleModalCancel}
              >
                Cancel
              </button>
              <button
                style={{ ...buttonStyle, borderColor: "#1976d2", background: "#1976d2", color: "#fff" }}
                onClick={handleModalSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showModal && showSuccess && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.18)", zIndex: 9999,
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{ ...modalBox, minWidth: 250, textAlign: "center" }}>
            <div style={{
              background: "#4CAF50", color: "#fff", padding: "10px 18px",
              fontWeight: 600, fontSize: "1em"
            }}>
              Success
            </div>
            <div style={{ padding: "20px 16px" }}>
              Purchase order successfully updated!
            </div>
            <div style={{
              padding: "8px 18px", background: "#f7f7f7", textAlign: "right"
            }}>
              <button
                style={{ ...buttonStyle, borderColor: "#1976d2", background: "#1976d2", color: "#fff" }}
                onClick={handleSuccessOk}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery History Modal */}
      {showDeliveryModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.18)", zIndex: 9999,
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={modalBox}>
            <div style={{
              background: "#1976d2", color: "#fff", padding: "10px 18px",
              fontWeight: 600, fontSize: "1em"
            }}>
              Delivery History
            </div>
            <div style={{ padding: "12px" }}>
              <table style={{ width: "100%", marginBottom: 6, tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "55%" }} />
                  <col style={{ width: "30%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={headerStyle}>#</th>
                    <th style={headerStyle}>DATE DELIVERED</th>
                    <th style={headerStyle}>QTY DELIVERED</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryHistory.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ padding: "6px", textAlign: "center" }}>
                        No delivery history.
                      </td>
                    </tr>
                  ) : (
                    deliveryHistory.map((d, idx) => (
                      <tr key={d.id}>
                        <td style={cellStyle}>{idx + 1}</td>
                        <td style={cellStyle}>{d.dateDelivered}</td>
                        <td style={cellStyle}>{d.qtyDelivered}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div style={{
              padding: "8px 18px", background: "#f7f7f7", textAlign: "right"
            }}>
              <button
                style={{ ...buttonStyle, borderColor: "#bbb", color: "#444", background: "#fff" }}
                onClick={handleDeliveryModalClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
