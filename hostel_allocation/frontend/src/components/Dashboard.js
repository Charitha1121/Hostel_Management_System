import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    // --- State Management ---
    const [students, setStudents] = useState([]);
    const [swaps, setSwaps] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Form States
    const [regForm, setRegForm] = useState({ roll_no: '', name: '', department: '', year: '', password: '' });
    const [swapForm, setSwapForm] = useState({ requester_roll: '', target_roll: '' });

    const API_BASE = "http://127.0.0.1:8000";

    // --- Data Loading ---
    const loadData = async () => {
        try {
            const studentRes = await axios.get(`${API_BASE}/admin/all-students`);
            const swapRes = await axios.get(`${API_BASE}/admin/all-swaps`);
            setStudents(studentRes.data);
            setSwaps(swapRes.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };

    useEffect(() => { loadData(); }, []);

    // --- Actions ---

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Converts year string to number to prevent 422 error
            const payload = { ...regForm, year: Number(regForm.year) };
            await axios.post(`${API_BASE}/admin/add-student`, payload);
            alert("Student Registered and Bed Allocated!");
            setRegForm({ roll_no: '', name: '', department: '', year: '', password: '' });
            loadData();
        } catch (err) {
            alert("Registration Failed: " + (err.response?.data?.detail || "Check Backend"));
        }
    };

    const handleSwapRequest = async (e) => {
        e.preventDefault();
        try {
            // Matches your backend route /swaps/request
            await axios.post(`${API_BASE}/swaps/request`, swapForm);
            alert("Swap Request Created Successfully!");
            setSwapForm({ requester_roll: '', target_roll: '' });
            loadData();
        } catch (err) {
            alert("Swap Failed: Ensure both Roll Numbers exist in the database.");
        }
    };

    const handleAdminSwapAction = async (id, action) => {
        try {
            // Matches the URL: /admin/handle-swap/{id}?status=Approved
            await axios.put(`${API_BASE}/admin/handle-swap/${id}?status=${action}`);
            loadData();
        } catch (err) {
            console.error("Admin Action Error:", err);
        }
    };

    // --- Search Filter Logic ---
    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.roll_no.includes(searchTerm)
    );

    // --- General CSS Styles ---
    const styles = {
        container: { padding: '30px', fontFamily: '"Segoe UI", Tahoma, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' },
        card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '25px' },
        input: { padding: '12px', margin: '8px 0', width: '100%', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' },
        button: (bg) => ({ background: bg, color: 'white', padding: '12px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }),
        table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
        th: { textAlign: 'left', background: '#f8f9fa', padding: '12px', borderBottom: '2px solid #dee2e6', color: '#555' },
        td: { padding: '12px', borderBottom: '1px solid #eee' },
        badge: (status) => ({
            padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
            background: status === 'Approved' ? '#e6fffa' : status === 'Pending' ? '#fffaf0' : '#fff5f5',
            color: status === 'Approved' ? '#2c7a7b' : status === 'Pending' ? '#b7791f' : '#c53030'
        })
    };

    return (
        <div style={styles.container}>
            <h1 style={{ textAlign: 'center', color: '#1a202c', marginBottom: '30px' }}>Hostel Management System</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* 1. Registration Form */}
                <div style={styles.card}>
                    <h3 style={{ borderBottom: '2px solid #edf2f7', paddingBottom: '10px' }}>Register New Student</h3>
                    <form onSubmit={handleRegister}>
                        <input style={styles.input} placeholder="Roll Number" value={regForm.roll_no} onChange={e => setRegForm({...regForm, roll_no: e.target.value})} required />
                        <input style={styles.input} placeholder="Full Name" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} required />
                        <input style={styles.input} placeholder="Department (e.g. CSE)" value={regForm.department} onChange={e => setRegForm({...regForm, department: e.target.value})} required />
                        <input style={styles.input} type="number" placeholder="Year" value={regForm.year} onChange={e => setRegForm({...regForm, year: e.target.value})} required />
                        <input style={styles.input} type="password" placeholder="Password" value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} required />
                        <button type="submit" style={styles.button('#48bb78')}>Add Student & Allocate Bed</button>
                    </form>
                </div>

                {/* 2. Room Swap Request */}
                <div style={styles.card}>
                    <h3 style={{ borderBottom: '2px solid #edf2f7', paddingBottom: '10px' }}>Initiate Room Swap</h3>
                    <form onSubmit={handleSwapRequest}>
                        <p style={{ color: '#718096', fontSize: '14px' }}>Provide roll numbers of both students to swap their beds.</p>
                        <input style={styles.input} placeholder="Your Roll Number" value={swapForm.requester_roll} onChange={e => setSwapForm({...swapForm, requester_roll: e.target.value})} required />
                        <input style={styles.input} placeholder="Target Roll Number" value={swapForm.target_roll} onChange={e => setSwapForm({...swapForm, target_roll: e.target.value})} required />
                        <button type="submit" style={styles.button('#4299e1')}>Request Swap</button>
                    </form>
                </div>
            </div>

            {/* 3. Student List with Search */}
            <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3>Hostel Occupancy List</h3>
                    <input 
                        style={{ ...styles.input, width: '350px', margin: 0 }} 
                        placeholder="Search by name or roll number..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Roll No</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Dept</th>
                            <th style={styles.th}>Allotted Bed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map(s => (
                            <tr key={s.id}>
                                <td style={styles.td}>{s.roll_no}</td>
                                <td style={styles.td}>{s.name}</td>
                                <td style={styles.td}>{s.department}</td>
                                <td style={styles.td}>
                                    <span style={{ fontWeight: 'bold', color: '#2b6cb0' }}>
                                        {s.allotted_bed_id ? `Bed ${s.allotted_bed_id}` : 'Pending...'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 4. Admin Swap Management */}
            <div style={styles.card}>
                <h3 style={{ color: '#c53030' }}>Admin: Pending Swap Approvals</h3>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Requester</th>
                            <th style={styles.th}>Target Student</th>
                            <th style={styles.th}>Current Status</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {swaps.map(sw => (
                            <tr key={sw.id}>
                                <td style={styles.td}>{sw.requester_name}</td>
                                <td style={styles.td}>{sw.target_name}</td>
                                <td style={styles.td}><span style={styles.badge(sw.status)}>{sw.status}</span></td>
                                <td style={styles.td}>
                                    {sw.status === "Pending" && (
                                        <>
                                            <button onClick={() => handleAdminSwapAction(sw.id, 'Approved')} style={{ ...styles.button('#2f855a'), padding: '6px 12px', fontSize: '12px', marginRight: '8px', marginTop: 0 }}>Approve</button>
                                            <button onClick={() => handleAdminSwapAction(sw.id, 'Rejected')} style={{ ...styles.button('#c53030'), padding: '6px 12px', fontSize: '12px', marginTop: 0 }}>Reject</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;