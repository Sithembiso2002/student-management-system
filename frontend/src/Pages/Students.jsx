import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", email: "", course: "", status: "Active" });
  const [editing, setEditing] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 6;

  const fetchStudents = async () => {
    const res = await axios.get("http://localhost:5000/students");
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email.includes("@") || !form.course) {
      alert("Please fill all fields correctly.");
      return;
    }

    if (editing) {
      await axios.put(`http://localhost:5000/students/${editing}`, form);
      setEditing(null);
    } else {
      await axios.post("http://localhost:5000/students", form);
    }
    setForm({ name: "", email: "", course: "", status: "Active" });
    fetchStudents();
  };

  const handleEdit = (student) => {
    setForm(student);
    setEditing(student.id);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this student?")) {
      await axios.delete(`http://localhost:5000/students/${id}`);
      fetchStudents();
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / studentsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Student List</h1>
        <input
          type="text"
          placeholder="Search students..."
          className="border px-3 py-2 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="card mb-6 grid md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Name"
          className="border rounded-md px-3 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="border rounded-md px-3 py-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Course"
          className="border rounded-md px-3 py-2"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        />
        <button type="submit" className="btn btn-primary">
          {editing ? "Update" : "Add"} Student
        </button>
      </form>

      {/* Student Table */}
      <div className="overflow-x-auto">
        <table className="table card">
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.course}</td>
                <td>
                  <span
                    className={`badge ${
                      s.status === "Active" ? "badge-active" : "badge-inactive"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="space-x-2">
                  <button className="btn btn-edit" onClick={() => handleEdit(s)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          className="btn bg-gray-200 hover:bg-gray-300"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ◀
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`btn ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="btn bg-gray-200 hover:bg-gray-300"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
