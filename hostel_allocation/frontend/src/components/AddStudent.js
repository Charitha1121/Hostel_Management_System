import { useState } from "react";
import axios from "axios";

function AddStudent() {
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/admin/add-student", {
        roll_no: rollNo,
        name: name,
        department: department,
        year: parseInt(year),
        password: password,
      });
      setMessage(res.data.message + " (ID: " + res.data.student_id + ")");
    } catch (err) {
      console.error(err);
      setMessage("Error adding student");
    }
  };

  return (
    <div>
      <h2>Add Student</h2>
      <form onSubmit={handleAddStudent}>
        <input placeholder="Roll No" value={rollNo} onChange={(e) => setRollNo(e.target.value)} />
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
        <input placeholder="Year" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Add Student</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default AddStudent;
