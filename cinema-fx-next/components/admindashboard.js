import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import styles from './AdminDashboard.module.css'; // Make sure this CSS exists
import Toast from '../components/Toast'; // Adjust path if necessary

// Helper to get today's date as YYYY-MM-DD
function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Fetch orders from your API
  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      const res = await fetch('/api/admin/transactions');
      const data = await res.json();
      setOrders(data);

      // Prepare delivery data (SUCCESS orders per day)
      const deliveries = {};
      data.forEach(order => {
        if (order.status === 'SUCCESS') {
          deliveries[order.purchaseDate] = (deliveries[order.purchaseDate] || 0) + 1;
        }
      });
      const deliveryArr = Object.keys(deliveries)
        .sort()
        .map(date => ({ date, delivered: deliveries[date] }));
      setDeliveryData(deliveryArr);

      setLoading(false);
    }
    fetchOrders();
  }, []);

  // PIE: Orders by Status
  const statusCounts = {};
  orders.forEach((t) => {
    statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
  });
  const pieData = [
    { name: 'Pending', y: statusCounts['PENDING'] || 0, color: '#00b4d8' },
    { name: 'Complete', y: statusCounts['SUCCESS'] || 0, color: '#00e39a' },
    { name: 'Incomplete', y: statusCounts['INCOMPLETE'] || 0, color: '#ff6f61' }
  ];

  // BAR: Product count per user
  const userProductCounts = {};
  orders.forEach((t) => {
    userProductCounts[t.username] = userProductCounts[t.username] || 0;
    t.items.forEach((itemStr) => {
      const match = itemStr.match(/\(x(\d+)\)/);
      if (match) userProductCounts[t.username] += parseInt(match[1]);
    });
  });
  const barCategories = Object.keys(userProductCounts);
  const barData = barCategories.map((name, idx) => ({
    y: userProductCounts[name],
    color: idx % 2 === 0 ? 'orange' : 'green'
  }));

  // LINE: Delivery per day
  const lineCategories = deliveryData.map(d => d.date);
  const lineSeries = deliveryData.map(d => d.delivered);

  // TOP-SELLING PRODUCTS: Aggregate sales by product name
  const productSales = {};
  orders.forEach(order => {
    order.items.forEach(itemStr => {
      const match = itemStr.match(/^(.+?) \(x(\d+)\)$/);
      if (match) {
        const name = match[1];
        const qty = parseInt(match[2]);
        productSales[name] = (productSales[name] || 0) + qty;
      }
    });
  });
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7); // Top 7 products
  const topProductNames = topProducts.map(([name]) => name);
  const topProductCounts = topProducts.map(([, count]) => count);

  // Chart options
  const pieOptions = {
    chart: { type: 'pie', height: 300 },
    title: { text: null },
    series: [{
      name: 'Orders',
      data: pieData
    }],
    plotOptions: { pie: { dataLabels: { enabled: true } } }
  };

  const barOptions = {
    chart: { type: 'column', height: 300 },
    title: { text: null },
    xAxis: { categories: barCategories },
    yAxis: { min: 0, title: { text: 'Product Count' } },
    series: [{
      name: 'Products',
      data: barData
    }]
  };

  const lineOptions = {
    chart: { type: 'line', height: 300 },
    title: { text: null },
    xAxis: { categories: lineCategories },
    yAxis: { title: { text: 'Product Delivered' }, min: 0 },
    series: [{
      name: 'Product Delivered',
      data: lineSeries,
      color: '#00b4d8'
    }]
  };

  const topProductsOptions = {
    chart: { type: 'bar', height: 300 },
    title: { text: null },
    xAxis: { categories: topProductNames, title: { text: null } },
    yAxis: { min: 0, title: { text: 'Units Sold' } },
    series: [{
      name: 'Units Sold',
      data: topProductCounts,
      color: '#ffb703'
    }]
  };

  // Add today's delivery (for demo)
  const addTodayDelivery = () => {
    const today = getToday();
    const exists = deliveryData.some(d => d.date === today);
    if (!exists) {
      setDeliveryData([
        ...deliveryData,
        { date: today, delivered: Math.floor(Math.random() * 10) + 1 }
      ]);
      setToastMessage("Today's delivery has been added.");
      setToastType('success');
      setShowToast(true);
    } else {
      setToastMessage("Today's delivery already recorded.");
      setToastType('error');
      setShowToast(true);
    }
  };

  if (loading) return <div className={styles.loading}>Loading dashboard...</div>;

  return (
    <div className={styles.dashboardGrid}>
      <Toast
        message={toastMessage}
        show={showToast}
        type={toastType}
        onClose={() => setShowToast(false)}
      />

      <div className={styles.topRow}>
        <div className={styles.card}>
          <h3>Purchase Orders By Status</h3>
          <HighchartsReact highcharts={Highcharts} options={pieOptions} />
          <p>Here is the breakdown of the purchase orders by status.</p>
        </div>
        <div className={styles.card}>
          <h3>Product Count Assigned To Customer</h3>
          <HighchartsReact highcharts={Highcharts} options={barOptions} />
          <p>Here is the breakdown of the product count assigned to customers.</p>
        </div>
      </div>

      <div className={styles.middleRow}>
        <div className={styles.card}>
          <h3>Top-Selling Products</h3>
          <HighchartsReact highcharts={Highcharts} options={topProductsOptions} />
          <p>These are your best-selling products by unit sold.</p>
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: 24 }}>
        <h3>Delivery History Per Day</h3>
        <HighchartsReact highcharts={Highcharts} options={lineOptions} />
        <button className={styles.addDeliveryButton} onClick={addTodayDelivery}>
          Add Today's Delivery
        </button>
      </div>
    </div>
  );
}
