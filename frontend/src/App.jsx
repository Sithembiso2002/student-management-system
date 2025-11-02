import React, { useEffect, useState } from "react";
import api from "./services/api";
import {
  Search,
  User,
  LayoutDashboard,
} from "lucide-react";

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-center items-center w-full sm:w-52">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-3xl font-bold mt-1 text-gray-800">{value}</div>
    </div>
  );
}

function Badge({ active }) {
  return (
    <span
      className={`px-3 py-1 text-sm rounded-full font-medium ${
        active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function StudentForm({ onSave, editing, onCancel }) {
  const [form, setForm] = useState({ name: "", email: "", course: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (editing) setForm(editing);
    else setForm({ name: "", email: "", course: "" });
  }, [editing]);

  const validate = () => {
    if (!form.name || !form.email || !form.course) {
      setError("All fields are required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ✅ fixed regex
    if (!emailRegex.test(form.email)) {
      setError("Invalid email format");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-xl shadow flex flex-col sm:flex-row gap-3 items-center"
    >
      <input
        required
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border rounded-lg p-2 w-full sm:w-1/4"
      />
      <input
        required
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border rounded-lg p-2 w-full sm:w-1/4"
      />
      <input
        required
        placeholder="Course"
        value={form.course}
        onChange={(e) => setForm({ ...form, course: e.target.value })}
        className="border rounded-lg p-2 w-full sm:w-1/4"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        {editing ? "Update" : "Save"}
      </button>
      {editing && (
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      )}
      {error && <span className="text-red-500 text-sm ml-2">{error}</span>}
    </form>
  );
}

export default function App() {
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState("dashboard"); // ✅ navigation
  const perPage = 6;

  const fetchStudents = async () => {
    const res = await api.get("/students");
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSave = async (data) => {
    if (editing) {
      await api.put(`/students/${editing.id}`, data);
      setEditing(null);
    } else {
      await api.post("/students", data);
    }
    setAdding(false);
    fetchStudents();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this student?")) return;
    await api.delete(`/students/${id}`);
    fetchStudents();
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  // ✅ dynamically calculate stats
  const totals = {
    total: students.length,
    active: students.filter((_, i) => i % 2 === 0).length,
    inactive: students.filter((_, i) => i % 2 !== 0).length,
    courses: new Set(students.map((s) => s.course)).size,
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 shadow-lg">
        <h1 className="text-2xl font-semibold">Student Management</h1>
      </header>

      <div className="flex flex-col sm:flex-row">
        {/* Sidebar */}
        <aside className="w-full sm:w-64 bg-white border-r p-6 space-y-4 shadow-md flex sm:block justify-around">
          <button
            onClick={() => setView("dashboard")}
            className={`flex items-center space-x-2 text-gray-700 font-medium p-2 rounded w-full ${
              view === "dashboard" ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setView("students")}
            className={`flex items-center space-x-2 text-gray-700 font-medium p-2 rounded w-full ${
              view === "students" ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
          >
            <User size={18} />
            <span>Students</span>
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 sm:p-8">
          {view === "dashboard" && (
            <>
              <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
              <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
                <StatCard title="Total Students" value={totals.total} />
                <StatCard title="Active" value={totals.active} />
                <StatCard title="Inactive" value={totals.inactive} />
                <StatCard title="Courses" value={totals.courses} />
              </div>
            </>
          )}

          {view === "students" && (
            <>
              {/* Search + Add */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
                <h2 className="text-2xl font-semibold">Student List</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-3 top-2.5 text-gray-400"
                    />
                    <input
                      placeholder="Search students..."
                      className="border pl-9 pr-3 py-2 rounded-lg w-64"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setEditing(null);
                      setAdding(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add Student
                  </button>
                </div>
              </div>

              {/* Form (only show when adding or editing) */}
              {(adding || editing) && (
                <StudentForm
                  onSave={handleSave}
                  editing={editing}
                  onCancel={() => {
                    setEditing(null);
                    setAdding(false);
                  }}
                />
              )}

              {/* Table */}
              <div className="mt-6 bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="p-4">ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>Status</th>
                      <th className="text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {current.map((s, index) => (
                      <tr key={s.id} className="border-t hover:bg-gray-50">
                        <td className="p-4">{s.id}</td>
                        <td>{s.name}</td>
                        <td>{s.email}</td>
                        <td>{s.course}</td>
                        <td>
                          <Badge active={index % 2 === 0} />
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditing(s);
                              setAdding(false);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center mt-6 space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      page === i + 1
                        ? "bg-blue-600 text-white"
                        : "border hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
