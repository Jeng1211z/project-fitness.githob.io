import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function RegisterPartners() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    owner_email: '',
    owner_name: '',
    owner_password: '',
    confirmPassword: ''
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
      'duplicate key value violates unique constraint "tbl_owner_owner_email_key"': 'อีเมลนี้ถูกลงทะเบียนแล้ว',
      'Password should be at least 6 characters': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
      'Invalid email format': 'รูปแบบอีเมลไม่ถูกต้อง'
    };
    
    const message = error.message || error;
    return errorMessages[message] || `เกิดข้อผิดพลาด: ${message}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.owner_password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    if (formData.owner_password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // สมัครสมาชิกพาร์ทเนอร์โดยเก็บข้อมูลลงตาราง tbl_owner
      const { data, error: ownerError } = await supabase
        .from('tbl_owner')
        .insert([
          {
            owner_email: formData.owner_email,
            owner_name: formData.owner_name,
            owner_password: formData.owner_password
          }
        ])
        .select();

      if (ownerError) {
        console.error('Owner Error:', ownerError);
        throw new Error(`เกิดข้อผิดพลาดในการสมัครสมาชิกพาร์ทเนอร์: ${ownerError.message}`);
      }

      alert('สมัครสมาชิกพาร์ทเนอร์สำเร็จ! กรุณาเข้าสู่ระบบ');
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
        <h1 className="text-2xl font-bold mb-6 text-center text-violet-900">
          สมัครสมาชิกพาร์ทเนอร์
        </h1>
        <p className="text-gray-600 text-center mb-6">
          สร้างบัญชีพาร์ทเนอร์เพื่อจัดการฟิตเนสของคุณ
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* อีเมลของเจ้าของกิจการ */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">อีเมล *</label>
            <input
              type="email"
              name="owner_email"
              value={formData.owner_email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-900"
              placeholder="example@email.com"
              required
              disabled={loading}
            />
          </div>

          {/* ชื่อเจ้าของกิจการ */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">ชื่อผู้ใช้ *</label>
            <input
              type="text"
              name="owner_name"
              value={formData.owner_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-900"
              placeholder="ชื่อ-นามสกุล"
              required
              disabled={loading}
            />
          </div>

          {/* รหัสผ่าน */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">รหัสผ่าน *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="owner_password"
                value={formData.owner_password}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-900"
                placeholder="••••••••"
                required
                disabled={loading}
              />
              {formData.owner_password.length > 0 && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? 
                    <EyeSlashIcon className="h-5 w-5" /> : 
                    <EyeIcon className="h-5 w-5" />
                  }
                </button>
              )}
            </div>
          </div>

          {/* ยืนยันรหัสผ่าน */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">ยืนยันรหัสผ่าน *</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-900"
                placeholder="••••••••"
                required
                disabled={loading}
              />
              {formData.confirmPassword.length > 0 && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? 
                    <EyeSlashIcon className="h-5 w-5" /> : 
                    <EyeIcon className="h-5 w-5" />
                  }
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className="w-full bg-violet-900 text-white py-2 px-6 rounded-md hover:bg-violet-600 transition duration-300 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'กำลังดำเนินการ...' : 'สมัครสมาชิกพาร์ทเนอร์'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
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

export default RegisterPartners;
