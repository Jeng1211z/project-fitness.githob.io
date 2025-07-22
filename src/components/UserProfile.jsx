import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';

const UserProfile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Form states
  const [profileData, setProfileData] = useState({
    username: '',
    useremail: '',
    userage: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // OTP states
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(true);

  useEffect(() => {
    // ตรวจสอบการเข้าสู่ระบบ
    const user = localStorage.getItem('currentUser');
    if (!user) {
      alert('กรุณาเข้าสู่ระบบก่อน');
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(user);
    if (userData.userType !== 'user') {
      alert('หน้านี้สำหรับผู้ใช้ทั่วไปเท่านั้น');
      navigate('/');
      return;
    }
    
    setCurrentUser(userData);
    setProfileData({
      username: userData.username || '',
      useremail: userData.useremail || '',
      userage: userData.userage || ''
    });
  }, [navigate]);

  // OTP Timer Effect
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(timer => {
          if (timer <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpTimer]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // OTP Functions
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTPEmail = async (email, otp) => {
    try {
      // สำหรับการทดสอบ - ในระบบจริงควรใช้ Email Service
      console.log(`OTP Code for ${email}: ${otp}`);
      
      // จำลองการส่งอีเมล - ในระบบจริงใช้ EmailJS หรือ Supabase Edge Functions
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // แสดง OTP ในคอนโซลสำหรับการทดสอบ
      alert(`รหัส OTP ถูกส่งไปยัง ${email}\nรหัส OTP: ${otp} (สำหรับการทดสอบ)`);
      
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  };

  const sendOTP = async () => {
    if (!canResendOtp) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const otp = generateOTP();
      const emailSent = await sendOTPEmail(currentUser.useremail, otp);
      
      if (emailSent) {
        setSentOtp(otp);
        setOtpTimer(60); // 60 seconds countdown
        setCanResendOtp(false);
        setSuccess('รหัส OTP ถูกส่งไปยังอีเมลของคุณแล้ว');
      } else {
        throw new Error('ไม่สามารถส่ง OTP ได้');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = () => {
    return otpCode === sentOtp && otpCode.length === 6;
  };

  const resetOTPState = () => {
    setOtpStep(false);
    setOtpCode('');
    setSentOtp('');
    setOtpTimer(0);
    setCanResendOtp(true);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: profileData.username,
          userage: profileData.userage
        })
        .eq('user_id', currentUser.user_id)
        .select();

      if (error) {
        throw new Error(`เกิดข้อผิดพลาด: ${error.message}`);
      }

      // อัปเดต localStorage
      const updatedUser = {
        ...currentUser,
        username: profileData.username,
        userage: profileData.userage
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      setSuccess('อัปเดตข้อมูลสำเร็จ!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // ตรวจสอบรหัสผ่านใหม่
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('รหัสผ่านใหม่ไม่ตรงกัน');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
      setLoading(false);
      return;
    }

    // ขั้นตอน OTP
    if (!otpStep) {
      try {
        // ตรวจสอบรหัสผ่านเดิมก่อน
        const { data: verifyData, error: verifyError } = await supabase
          .from('profiles')
          .select('userpassword')
          .eq('user_id', currentUser.user_id)
          .eq('userpassword', passwordData.currentPassword)
          .single();

        if (verifyError || !verifyData) {
          throw new Error('รหัสผ่านเดิมไม่ถูกต้อง');
        }

        // ส่ง OTP
        setOtpStep(true);
        await sendOTP();
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    // ตรวจสอบ OTP
    if (!verifyOTP()) {
      setError('รหัส OTP ไม่ถูกต้องหรือหมดอายุ');
      setLoading(false);
      return;
    }

    try {
      // อัปเดตรหัสผ่านใหม่
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          userpassword: passwordData.newPassword
        })
        .eq('user_id', currentUser.user_id);

      if (updateError) {
        throw new Error(`เกิดข้อผิดพลาด: ${updateError.message}`);
      }

      setSuccess('เปลี่ยนรหัสผ่านสำเร็จ!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      resetOTPState();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">กำลังโหลด...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentUser.username}</h1>
              <p className="text-gray-600">{currentUser.useremail}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-violet-500 text-violet-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                ข้อมูลส่วนตัว
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'password'
                    ? 'border-violet-500 text-violet-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                เปลี่ยนรหัสผ่าน
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Alert Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
              {success}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">แก้ไขข้อมูลส่วนตัว</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อผู้ใช้
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="ชื่อผู้ใช้"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    value={profileData.useremail}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    placeholder="อีเมล"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">ไม่สามารถเปลี่ยนอีเมลได้</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    อายุ
                  </label>
                  <select
                    name="userage"
                    value={profileData.userage}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:bg-gray-400 transition duration-200"
                >
                  {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                </button>
              </div>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">เปลี่ยนรหัสผ่าน</h2>
              
              <div className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    รหัสผ่านปัจจุบัน
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    {passwordData.currentPassword.length > 0 && (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPasswords.current ? 
                          <EyeSlashIcon className="h-5 w-5" /> : 
                          <EyeIcon className="h-5 w-5" />
                        }
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    รหัสผ่านใหม่
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    {passwordData.newPassword.length > 0 && (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPasswords.new ? 
                          <EyeSlashIcon className="h-5 w-5" /> : 
                          <EyeIcon className="h-5 w-5" />
                        }
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ยืนยันรหัสผ่านใหม่
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    {passwordData.confirmPassword.length > 0 && (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPasswords.confirm ? 
                          <EyeSlashIcon className="h-5 w-5" /> : 
                          <EyeIcon className="h-5 w-5" />
                        }
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* OTP Section */}
              {otpStep && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-blue-900">ยืนยันตัวตนด้วย OTP</h3>
                  </div>
                  
                  <p className="text-sm text-blue-700">
                    เราได้ส่งรหัส OTP 6 หลักไปยังอีเมล <strong>{currentUser.useremail}</strong> แล้ว
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      รหัส OTP
                    </label>
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setOtpCode(value);
                        }}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-center text-lg tracking-widest"
                        placeholder="000000"
                        maxLength="6"
                        required
                      />
                      <button
                        type="button"
                        onClick={sendOTP}
                        disabled={!canResendOtp || loading}
                        className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-200 whitespace-nowrap"
                      >
                        {otpTimer > 0 ? `ส่งใหม่ (${otpTimer}s)` : 'ส่งรหัสใหม่'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">กรุณากรอกรหัส OTP 6 หลักที่ได้รับทางอีเมล</p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        resetOTPState();
                        setError(null);
                        setSuccess(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                    >
                      ยกเลิก OTP
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:bg-gray-400 transition duration-200"
                >
                  {loading ? 'กำลังดำเนินการ...' : 
                   !otpStep ? 'ส่งรหัส OTP' : 
                   'ยืนยันและเปลี่ยนรหัสผ่าน'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
