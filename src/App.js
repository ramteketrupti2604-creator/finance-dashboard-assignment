import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wallet, ArrowUpCircle, ArrowDownCircle, UserCircle, Search, Sun, Moon, Edit2, X, Save } from 'lucide-react';

// Initial Mock Data
const INITIAL_DATA = [
  { id: 1, date: '2026-03-01', amount: 5000, category: 'Salary', type: 'income' },
  { id: 2, date: '2026-03-05', amount: 1200, category: 'Food', type: 'expense' },
  { id: 3, date: '2026-03-10', amount: 800, category: 'Shopping', type: 'expense' },
  { id: 4, date: '2026-03-15', amount: 2000, category: 'Freelance', type: 'income' },
  { id: 5, date: '2026-03-20', amount: 1500, category: 'Rent', type: 'expense' },
];

const COLORS = ['#1a73e8', '#34a853', '#fbbc05', '#ea4335'];

export default function App() {
  const [data, setData] = useState(INITIAL_DATA);
  const [role, setRole] = useState('Admin');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const totals = useMemo(() => {
    const income = data.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = data.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    return { income, expense, balance: income - expense };
  }, [data]);

  const filteredTransactions = data.filter(t => 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (transaction) => {
    setEditingId(transaction.id);
    setEditFormData(transaction);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSave = () => {
    const updatedData = data.map(item => item.id === editingId ? { ...editFormData, amount: parseFloat(editFormData.amount) } : item);
    setData(updatedData);
    setEditingId(null);
  };

  const theme = {
    bg: darkMode ? '#121212' : '#f8f9fc',
    card: darkMode ? '#1e1e1e' : '#fff',
    text: darkMode ? '#e0e0e0' : '#333',
    subText: darkMode ? '#aaa' : '#666',
    border: darkMode ? '#333' : '#edf2f7',
    inputBg: darkMode ? '#2d2d2d' : '#fff',
    inputText: darkMode ? '#fff' : '#000',
  };

  const s = {
    wrapper: { backgroundColor: theme.bg, minHeight: '100vh', padding: '15px', fontFamily: 'Segoe UI, sans-serif', color: theme.text, transition: '0.3s' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px', backgroundColor: theme.card, padding: '15px 25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: `1px solid ${theme.border}` },
    card: { backgroundColor: theme.card, padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: `1px solid ${theme.border}` },
    gridResponsive: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '25px' },
    input: { padding: '10px 15px', borderRadius: '8px', border: `1px solid ${theme.border}`, width: '100%', maxWidth: '250px', outline: 'none', backgroundColor: theme.inputBg, color: theme.inputText },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px', minWidth: '500px' },
    th: { textAlign: 'left', padding: '15px', borderBottom: `2px solid ${theme.border}`, color: theme.subText, fontSize: '12px', textTransform: 'uppercase' },
    td: { padding: '15px', borderBottom: `1px solid ${theme.border}`, fontSize: '14px' },
    badge: (type) => ({ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: type === 'income' ? (darkMode ? '#1b5e20' : '#e6f4ea') : (darkMode ? '#b71c1c' : '#fce8e6'), color: type === 'income' ? (darkMode ? '#a5d6a7' : '#1e7e34') : (darkMode ? '#ef9a9a' : '#d93025') }),
    editInput: { padding: '10px', borderRadius: '5px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.inputText, width: '100%' }
  };

  return (
    <div style={s.wrapper}>
      {/* Header */}
      <div style={s.header}>
        <h2 style={{ margin: 0, color: '#1a73e8', fontSize: '1.2rem' }}>Zorvyn Finance</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setDarkMode(!darkMode)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '8px', color: theme.text }}>
            {darkMode ? <Sun size={20} color="#fbbc05" /> : <Moon size={20} color="#666" />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: `1px solid ${theme.border}`, paddingLeft: '10px' }}>
            <UserCircle size={20} color={theme.subText} />
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: '5px', borderRadius: '6px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text, fontSize: '12px' }}>
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={s.gridResponsive}>
        {[ {title: 'Total Balance', value: totals.balance, icon: Wallet, color: '#1a73e8'},
           {title: 'Monthly Income', value: totals.income, icon: ArrowUpCircle, color: '#34a853'},
           {title: 'Total Expenses', value: totals.expense, icon: ArrowDownCircle, color: '#ea4335'}
        ].map(stat => (
          <div key={stat.title} style={{ ...s.card, borderLeft: `5px solid ${stat.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: theme.subText, fontSize: '14px' }}>{stat.title}</span>
              <stat.icon size={20} color={stat.color} />
            </div>
            <h2 style={{ margin: '10px 0 0 0', fontWeight: 'bold' }}>₹{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div style={s.gridResponsive}>
        <div style={{ ...s.card, height: '320px' }}>
          <h4 style={{ margin: '0 0 15px 0', color: theme.text, fontSize: '14px' }}>Balance Trend</h4>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.border} />
              <XAxis dataKey="date" tick={{fontSize: 10, fill: theme.subText}} stroke={theme.border} />
              <YAxis tick={{fontSize: 10, fill: theme.subText}} stroke={theme.border} />
              <Tooltip contentStyle={{backgroundColor: theme.card, border: `1px solid ${theme.border}`, color: theme.text, fontSize: '12px'}} />
              <Line type="monotone" dataKey="amount" stroke="#1a73e8" strokeWidth={2} dot={{ r: 4, fill: '#1a73e8' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ ...s.card, height: '320px' }}>
          <h4 style={{ margin: '0 0 15px 0', color: theme.text, fontSize: '14px' }}>Spending Breakdown</h4>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie data={data} dataKey="amount" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{backgroundColor: theme.card, border: `1px solid ${theme.border}`, color: theme.text, fontSize: '12px'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Section */}
      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
          <h4 style={{ margin: 0, color: theme.text }}>Transactions</h4>
          <div style={{ position: 'relative', width: '100%', maxWidth: '250px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
            <input style={{ ...s.input, paddingLeft: '35px' }} placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {editingId ? (
          <div style={{ padding: '15px', border: `1px solid ${theme.border}`, borderRadius: '10px', backgroundColor: theme.bg, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>Edit Entry</b> <X onClick={() => setEditingId(null)} cursor="pointer" size={20}/></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              <input name="date" type="date" value={editFormData.date} onChange={handleEditChange} style={s.editInput} />
              <input name="category" type="text" value={editFormData.category} onChange={handleEditChange} style={s.editInput} placeholder="Category" />
              <select name="type" value={editFormData.type} onChange={handleEditChange} style={s.editInput}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input name="amount" type="number" value={editFormData.amount} onChange={handleEditChange} style={s.editInput} placeholder="Amount" />
            </div>
            <button onClick={handleSave} style={{ backgroundColor: '#1a73e8', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Save Changes</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Date</th>
                  <th style={s.th}>Category</th>
                  <th style={s.th}>Type</th>
                  <th style={{ ...s.th, textAlign: 'right' }}>Amount</th>
                  {role === 'Admin' && <th style={s.th}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(t => (
                  <tr key={t.id}>
                    <td style={s.td}>{t.date}</td>
                    <td style={{ ...s.td, fontWeight: 'bold' }}>{t.category}</td>
                    <td style={s.td}><span style={s.badge(t.type)}>{t.type}</span></td>
                    <td style={{ ...s.td, textAlign: 'right', fontWeight: 'bold' }}>₹{t.amount}</td>
                    {role === 'Admin' && <td style={s.td}><button onClick={() => handleEditClick(t)} style={{ color: '#1a73e8', border: 'none', background: 'none', cursor: 'pointer' }}><Edit2 size={16}/></button></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}