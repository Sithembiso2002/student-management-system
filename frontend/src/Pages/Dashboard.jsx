import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  UserCheck,
  UserX,
  BookOpen,
  Users,
  TrendingUp,
  Award,
  Activity,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F87171", "#FBBF24"];

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    courses: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [recent, setRecent] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("http://localhost:5000/students");
        const data = res.data;

        const active = data.filter((s) => s.status === "Active").length;
        const inactive = data.filter((s) => s.status === "Inactive").length;
        const courses = new Set(data.map((s) => s.course)).size;

        // ✅ Stats
        setStats({ total: data.length, active, inactive, courses });

        // ✅ Course chart
        const courseCount = {};
        data.forEach((s) => {
          courseCount[s.course] = (courseCount[s.course] || 0) + 1;
        });
        const formatted = Object.entries(courseCount).map(([name, count]) => ({
          name,
          count,
        }));
        setChartData(formatted);

        // ✅ Recent students
        setRecent(data.slice(-5).reverse());

        // ✅ Monthly trend
        const monthCount = {};
        data.forEach((s) => {
          const date = s.created_at ? new Date(s.created_at) : new Date();
          const month = date.toLocaleString("default", { month: "short" });
          monthCount[month] = (monthCount[month] || 0) + 1;
        });
        const monthly = Object.entries(monthCount).map(([month, count]) => ({
          month,
          count,
        }));
        setMonthlyData(monthly);

        // ✅ Insights
        const mostPopular = Object.entries(courseCount).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0];
        const bestMonth = monthly.sort((a, b) => b.count - a.count)[0]?.month;
        const activePct = ((active / data.length) * 100).toFixed(1);
        const avgCourseSize = (data.length / courses || 0).toFixed(1);

        setInsights([
          { icon: <Star className="text-yellow-500" />, label: "Top Course", value: mostPopular || "N/A" },
          { icon: <TrendingUp className="text-blue-500" />, label: "Best Month", value: bestMonth || "N/A" },
          { icon: <Activity className="text-green-600" />, label: "Active %", value: `${activePct}%` },
          { icon: <Award className="text-purple-600" />, label: "Avg / Course", value: avgCourseSize },
        ]);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };
    fetch();
  }, []);

  const cards = [
    {
      title: "Total Students",
      value: stats.total,
      icon: <Users size={28} className="text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "Active Students",
      value: stats.active,
      icon: <UserCheck size={28} className="text-green-600" />,
      color: "bg-green-50",
    },
    {
      title: "Inactive Students",
      value: stats.inactive,
      icon: <UserX size={28} className="text-red-600" />,
      color: "bg-red-50",
    },
    {
      title: "Courses Offered",
      value: stats.courses,
      icon: <BookOpen size={28} className="text-yellow-600" />,
      color: "bg-yellow-50",
    },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
        Dashboard Overview
      </h1>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${card.color} p-5 rounded-2xl shadow flex items-center gap-4 hover:shadow-lg transition`}
          >
            <div className="p-3 rounded-xl bg-white shadow-inner">
              {card.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{card.title}</p>
              <h2 className="text-2xl font-bold text-gray-800">{card.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insights */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {insights.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-3"
          >
            <div className="p-3 bg-gray-50 rounded-lg">{item.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <h3 className="font-bold text-lg text-gray-800">{item.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mt-10">
        {/* Pie Chart */}
        <div className="card flex flex-col items-center p-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Active vs Inactive Students
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Active", value: stats.active },
                  { name: "Inactive", value: stats.inactive },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                <Cell fill="#10B981" />
                <Cell fill="#EF4444" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="card flex flex-col items-center p-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Monthly Enrollment Trend
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card mt-10 p-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          Students per Course
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Students */}
      <div className="card mt-10 p-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          Recent Students
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{s.name}</td>
                  <td className="py-2 px-4">{s.email}</td>
                  <td className="py-2 px-4">{s.course}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        s.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recent.length === 0 && (
            <p className="text-gray-400 text-center py-6">
              No students found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
