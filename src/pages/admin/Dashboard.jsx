import React, { useEffect, useState } from "react";
import { getAdminStats } from "../../services/adminService";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;
  if (!stats) return <p className="text-center mt-10">No data available</p>;

  const pieData = [
    { name: "Confirmed", value: stats.confirmedPaymentsPercent },
    { name: "Pending", value: 100 - stats.confirmedPaymentsPercent },
  ];

  const COLORS = ["#22c55e", "#f87171"]; // green, red

  // Bar chart for all plans with sales
  const barData = stats.allPlansWithSales?.map((plan) => ({
    name: plan.title,
    count: plan.count,
  }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-teal-700">Admin Dashboard</h1>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-green-100 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="p-4 bg-blue-100 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Purchases</h2>
          <p className="text-3xl font-bold">{stats.totalPurchases}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Today's Purchases</h2>
          <p className="text-3xl font-bold">{stats.todaysPurchases}</p>
        </div>
        <div className="p-4 bg-purple-100 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Plans</h2>
          <p className="text-3xl font-bold">{stats.totalPlans}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PIE CHART */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-xl font-bold mb-2">Payment Status (%)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-xl font-bold mb-2">Plan Sales</h2>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
