import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // ตรวจสอบการเข้าสู่ระบบจาก tbl_owner (พาร์ทเนอร์) ก่อน
      const { data: ownerData, error: ownerError } = await supabase
        .from('tbl_owner')
        .select('*')
        .eq('owner_email', formData.username)
        .eq('owner_password', formData.password)
        .single();

      if (ownerData && !ownerError) {
        // เก็บข้อมูลพาร์ทเนอร์ใน localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          owner_id: ownerData.owner_id,
          owner_name: ownerData.owner_name,
          owner_email: ownerData.owner_email,
          userType: 'partner'
        }));

        alert(`เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ ${ownerData.owner_name}`);
        // รีเฟรชหน้าเพื่อให้ App component อัปเดต state
        window.location.href = '/mainpartners';
        return;
      }

      // หากไม่ใช่พาร์ทเนอร์ ให้ตรวจสอบจาก profiles (สมาชิกทั่วไป)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('useremail', formData.username)
        .eq('userpassword', formData.password)
        .single();

      if (error || !data) {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        return;
      }

      // เก็บข้อมูลผู้ใช้ใน localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        user_id: data.user_id,
        username: data.username,
        useremail: data.useremail,
        userage: data.userage,
        userType: 'user'
      }));

      alert(`เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ ${data.username}`);
      // รีเฟรชหน้าเพื่อให้ App component อัปเดต state
      window.location.href = '/';
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">เข้าสู่ระบบหรือสร้างแอคเคาท์</h1>
        <p className="login-subtitle">ท่านสามารถเข้าสู่ระบบได้โดยใช้แอคเคาท์ของท่าน เพื่อเข้าใช้บริการของเรา</p>
        
        {error && (
          <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">อีเมล</label>
            <input
              type="email"
              id="email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="ระบุอีเมลของท่าน"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="ระบุรหัสผ่านของท่าน"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>

          <div className="form-footer">
            <Link to="/register" className="register-link">สมัครสมาชิก</Link>
            <Link to="/registerpartners" className="register-link">สมัครสมาชิกพาร์ทเนอร์</Link>
            <Link to="/forgot-password" className="forgot-password-link">ลืมรหัสผ่าน</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
