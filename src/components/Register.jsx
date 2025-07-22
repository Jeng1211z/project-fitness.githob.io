import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    age: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const translateError = (error) => {
    const errorMessages = {
      'Invalid email or password': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      'Email already registered': 'อีเมลนี้ถูกลงทะเบียนแล้ว',
      'Password should be at least 6 characters': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
      'duplicate key value violates unique constraint "profiles_username_key"': 'ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว',
      'duplicate key value violates unique constraint "profiles_useremail_key"': 'อีเมลนี้ถูกลงทะเบียนแล้ว',
      'User already registered': 'ผู้ใช้นี้ลงทะเบียนแล้ว',
      'Signup disabled': 'การสมัครสมาชิกถูกปิดใช้งานชั่วคราว'
    };
    
    const message = error.message || error;
    return errorMessages[message] || `เกิดข้อผิดพลาด: ${message}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // สมัครสมาชิกโดยเก็บข้อมูลลงตาราง profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            username: formData.username,
            useremail: formData.email,
            userpassword: formData.password,
            userage: formData.age
          }
        ])
        .select();

      if (profileError) {
        console.error('Profile Error:', profileError);
        throw new Error(`เกิดข้อผิดพลาดในการสมัครสมาชิก: ${profileError.message}`);
      }

      // แสดงข้อความสำเร็จและนำทางไปหน้า login
      alert('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ');
      navigate('/login');
    } catch (error) {
      setError(translateError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">สมัครสมาชิก</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">อีเมล</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-900"
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">ชื่อผู้ใช้</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-900"
              placeholder="ชื่อผู้ใช้"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">รหัสผ่าน</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-900"
                placeholder="••••••••"
                required
              />
              {formData.password.length > 0 && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 
                    <EyeSlashIcon className="h-5 w-5" /> : 
                    <EyeIcon className="h-5 w-5" />
                  }
                </button>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">ยืนยันรหัสผ่าน</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-900"
                placeholder="••••••••"
                required
              />
              {formData.confirmPassword.length > 0 && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? 
                    <EyeSlashIcon className="h-5 w-5" /> : 
                    <EyeIcon className="h-5 w-5" />
                  }
                </button>
              )}
            </div>
          </div>
           

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">อายุ</label>
            <select
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-900"
              required
            >
              <option value="">เลือกอายุ</option>
              <option value="น้อยกว่า 18">น้อยกว่า 18</option>
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-45">36-45</option>
              <option value="มากกว่า 45">มากกว่า 45</option>
            </select>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className="w-full bg-violet-900 text-white py-2 px-6 rounded-md hover:bg-violet-600 transition duration-300 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'กำลังดำเนินการ...' : 'สมัครสมาชิก'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full bg-red-800 text-white py-2 px-6 rounded-md hover:bg-red-500 transition duration-300 disabled:bg-gray-400"
              disabled={loading}
            >
              กลับไปเข้าสู่ระบบ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
