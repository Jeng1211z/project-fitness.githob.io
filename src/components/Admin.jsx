import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [fitness, setFitness] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // ตรวจสอบว่าเป็น admin หรือไม่
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(user);
    // สมมติว่า admin จะมี username เป็น "admin" หรือ email ลงท้ายด้วย "@admin.com"
    if (userData.username !== 'admin' && !userData.useremail.includes('@admin.com')) {
      alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
      navigate('/');
      return;
    }
    
    setCurrentUser(userData);
    fetchUsers();
    fetchFitness();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('user_id', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFitness = async () => {
    try {
      const { data, error } = await supabase
        .from('tbl_fitness')
        .select('*')
        .order('fit_id', { ascending: true });

      if (error) throw error;
      setFitness(data || []);
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูลฟิตเนส');
      console.error('Error fetching fitness:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      
      alert('ลบผู้ใช้เรียบร้อย');
      fetchUsers(); // รีเฟรชข้อมูล
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบผู้ใช้');
      console.error('Error deleting user:', error);
    }
  };

  const deleteFitness = async (fitId) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบฟิตเนสนี้?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tbl_fitness')
        .delete()
        .eq('fit_id', fitId);

      if (error) throw error;
      
      alert('ลบฟิตเนสเรียบร้อย');
      fetchFitness();
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบฟิตเนส');
      console.error('Error deleting fitness:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.useremail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFitness = fitness.filter(fit => 
    fit.fit_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fit.fit_user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>กำลังโหลดข้อมูล...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>ระบบจัดการผู้ใช้งาน</h1>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6b46c1',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          กลับหน้าหลัก
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'users' ? '#6b46c1' : '#e5e7eb',
              color: activeTab === 'users' ? 'white' : 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            จัดการผู้ใช้งาน ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('fitness')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'fitness' ? '#6b46c1' : '#e5e7eb',
              color: activeTab === 'fitness' ? 'white' : 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            จัดการฟิตเนส ({fitness.length})
          </button>
        </div>

        <input
          type="text"
          placeholder={activeTab === 'users' ? "ค้นหาผู้ใช้งาน (ชื่อผู้ใช้หรืออีเมล)" : "ค้นหาฟิตเนส (ชื่อหรือเจ้าของ)"}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        />
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h3>สถิติ: มีผู้ใช้งานทั้งหมด {users.length} คน | ฟิตเนสทั้งหมด {fitness.length} แห่ง</h3>
      </div>

      {activeTab === 'users' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>ชื่อผู้ใช้</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>อีเมล</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>อายุ</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.user_id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{user.user_id}</td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{user.username}</td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{user.useremail}</td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{user.userage}</td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                    <button
                      onClick={() => deleteUser(user.user_id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              {searchTerm ? 'ไม่พบผู้ใช้ที่ค้นหา' : 'ไม่มีข้อมูลผู้ใช้'}
            </div>
          )}
        </div>
      )}

      {activeTab === 'fitness' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>ชื่อฟิตเนส</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>เจ้าของ</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>ราคา</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>โทรศัพท์</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>ที่อยู่</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredFitness.map((fit) => (
                <tr key={fit.fit_id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{fit.fit_id}</td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{fit.fit_name}</td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{fit.fit_user}</td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{fit.fit_price}</td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{fit.fit_phone}</td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {fit.fit_address}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                    <button
                      onClick={() => deleteFitness(fit.fit_id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredFitness.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              {searchTerm ? 'ไม่พบฟิตเนสที่ค้นหา' : 'ไม่มีข้อมูลฟิตเนส'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
