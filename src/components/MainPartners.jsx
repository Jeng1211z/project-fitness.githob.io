import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MainPartners = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // ตรวจสอบว่ามีผู้ใช้เข้าสู่ระบบหรือไม่
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      
      // ตรวจสอบว่าเป็นพาร์ทเนอร์หรือไม่
      if (userData.userType !== 'partner') {
        alert('ไม่สามารถเข้าใช้งานได้ กรุณาเข้าสู่ระบบด้วยบัญชีพาร์ทเนอร์');
        navigate('/login');
      }
    } else {
      alert('กรุณาเข้าสู่ระบบก่อน');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    alert('ออกจากระบบเรียบร้อย');
    navigate('/');
  };

  if (!currentUser) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* เพิ่มฟิตเนสใหม่ */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-violet-100 rounded-lg mb-4">
                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                เพิ่มฟิตเนสใหม่
              </h3>
              <p className="text-gray-600 mb-4">
                เพิ่มข้อมูลฟิตเนสของคุณเข้าสู่ระบบ
              </p>
              <Link
                to="/partners"
                className="inline-flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-md transition duration-300"
              >
                เพิ่มฟิตเนส
              </Link>
            </div>
          </div>

          {/* จัดการฟิตเนส */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                จัดการอุปกรณ์ฟิตเนส
              </h3>
              <p className="text-gray-600 mb-4">
                แก้ไขหรือลบข้อมูลอุปกรณ์ฟิตเนสที่มีอยู่
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition duration-300">
                จัดการ
              </button>
            </div>
          </div>

          {/* สถิติและรายงาน */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                สถิติและรายงาน
              </h3>
              <p className="text-gray-600 mb-4">
                ดูสถิติการเยี่ยมชมและข้อมูลการใช้งาน
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition duration-300">
                ดูสถิติ
              </button>
            </div>
          </div>

          {/* โปรไฟล์พาร์ทเนอร์ */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                โปรไฟล์พาร์ทเนอร์
              </h3>
              <p className="text-gray-600 mb-4">
                จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชี
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition duration-300">
                แก้ไขโปรไฟล์
              </button>
            </div>
          </div>

          {/* การแจ้งเตือน */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                การแจ้งเตือน
              </h3>
              <p className="text-gray-600 mb-4">
                ดูข้อความแจ้งเตือนและการติดต่อจากลูกค้า
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-md transition duration-300">
                ดูการแจ้งเตือน
              </button>
            </div>
          </div>

          {/* ความช่วยเหลือ */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ความช่วยเหลือ
              </h3>
              <p className="text-gray-600 mb-4">
                คู่มือการใช้งานและการติดต่อฝ่ายสนับสนุน
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition duration-300">
                ขอความช่วยเหลือ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPartners;
