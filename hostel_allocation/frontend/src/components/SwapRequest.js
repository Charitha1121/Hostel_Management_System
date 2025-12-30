import { useState, useEffect } from "react";
import axios from "axios";

function SwapRequests() {
  const [students, setStudents] = useState([]);
  const [requesterId, setRequesterId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [swaps, setSwaps] = useState([]);

  useEffect(() => {
    fetchStudents();
    fetchSwaps();
  }, []);

  const fetchStudents = async () => {
    const res = await axios.get("http://127.0.0.1:8000/admin/all-students");
    setStudents(res.data);
  };

  const fetchSwaps = async () => {
    const res = await axios.get("http://127.0.0.1:8000/swaps/all");
    setSwaps(res.data);
  };

  const handleRequestSwap = async () => {
    await axios.post("http://127.0.0.1:8000/swaps/request", {
      requester_id: parseInt(requesterId),
      target_student_id: parseInt(targetId),
    });
    fetchSwaps();
  };

  const handleUpdateStatus = async (id, status) => {
    await axios.put(`http://127.0.0.1:8000/swaps/update/${id}`, { status });
    fetchSwaps();
  };

  return (
    <div>
      <h2>Swap Request</h2>
      <select value={requesterId} onChange={(e) => setRequesterId(e.target.value)}>
        <option>Select requester</option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
      <select value={targetId} onChange={(e) => setTargetId(e.target.value)}>
        <option>Select target student</option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
      <button onClick={handleRequestSwap}>Request Swap</button>

      <h3>All Swap Requests</h3>
      <ul>
        {swaps.map((swap) => (
          <li key={swap.id}>
            {swap.requester_id} → {swap.target_student_id} | {swap.status}
            <button onClick={() => handleUpdateStatus(swap.id, "APPROVED")}>Approve</button>
            <button onClick={() => handleUpdateStatus(swap.id, "REJECTED")}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SwapRequests;
