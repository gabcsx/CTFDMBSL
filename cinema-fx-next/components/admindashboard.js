import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import styles from './AdminDashboard.module.css'; // Make sure the CSS filename matches

// Helper to get today's date as YYYY-MM-DD
function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function AdminDashboard() {
  // Example initial delivery data
  const [deliveryData, setDeliveryData] = useState([
    { date: '2024-06-01', delivered: 4 },
    { date: '2024-06-02', delivered: 2 },
    { date: '2024-06-03', delivered: 4 },
    { date: '2024-06-04', delivered: 10 },
  ]);

  // Simulate a new delivery for today
  const addTodayDelivery = () => {
    const today = getToday();
    // Check if today's delivery already exists
    const exists = deliveryData.some(d => d.date === today);
    if (!exists) {
      // For demo: random delivered count between 1 and 10
      const delivered = Math.floor(Math.random() * 10) + 1;
      setDeliveryData([...deliveryData, { date: today, delivered }]);
    } else {
      alert("Today's delivery already recorded.");
    }
  };

  // Pie chart options
  const pieOptions = {
    chart: { type: 'pie', height: 300 },
    title: { text: null },
    series: [{
      name: 'Orders',
      data: [
        { name: 'Pending', y: 0 },
        { name: 'Complete', y: 0 },
        { name: 'Incomplete', y: 3, color: '#00e39a' }
      ]
    }],
    plotOptions: { pie: { dataLabels: { enabled: true } } }
  };

  // Bar chart options
  const barOptions = {
    chart: { type: 'column', height: 300 },
    title: { text: null },
    xAxis: { categories: ['Alice', 'Bob'] },
    yAxis: { min: 0, title: { text: 'Product Count' } },
    series: [{
      name: 'Customers',
      data: [
        { y: 3, color: 'orange' },
        { y: 1, color: 'green' }
      ]
    }]
  };

  // Line chart options (dynamic dates)
  const lineOptions = {
    chart: { type: 'line', height: 300 },
    title: { text: null },
    xAxis: {
      categories: deliveryData.map(d => d.date)
    },
    yAxis: { title: { text: 'Product Delivered' }, min: 0 },
    series: [{
      name: 'Product Delivered',
      data: deliveryData.map(d => d.delivered),
      color: '#00b4d8'
    }]
  };

  return (
    <div className={styles.dashboardGrid}>
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
