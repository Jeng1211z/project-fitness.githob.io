import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import './App.css';
import Register from './components/Register';
import LocationGrid from './components/LocationGrid';
import Login from './components/Login';
import Admin from './components/Admin';
import Partners from './components/Partners';
import RegisterPartners from './components/RegisterPartners';
import MainPartners from './components/MainPartners';
import UserProfile from './components/UserProfile';
import FitnessDetail from './components/FitnessDetail';
import './styles/Login.css';

function AppContent() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // ตรวจสอบว่ามีผู้ใช้เข้าสู่ระบบหรือไม่
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // ปิดเมนูเมื่อคลิกนอกพื้นที่
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    alert('ออกจากระบบเรียบร้อย');
    navigate('/');
    setShowUserMenu(false);
  };

  const handleUserMenuClick = () => {
    setShowUserMenu(!showUserMenu);
  };
  return (
    <div className="fitness-website">
      {/* Navbar */}
      <nav className="navbar">
        <div className="content-container" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo-container">
            <Link to="/">
              <img src="/images/jm-fitness-logorb.png.png" alt="JM FITNESS" className="logo" />
            </Link>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">หน้าหลัก</Link>
           
            <Link to="/contact" className="nav-link">ติดต่อ</Link>
            <Link to="/services" className="nav-link">บริการ</Link>
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="user-menu-container" style={{ position: 'relative' }}>
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      cursor: 'pointer',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s',
                      backgroundColor: showUserMenu ? '#f3f4f6' : 'transparent'
                    }}
                    onClick={currentUser.userType === 'user' ? handleUserMenuClick : undefined}
                  >
                    <svg 
                      className="w-6 h-6 text-violet-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                      />
                    </svg>
                    <span className="nav-link" style={{ color: '#8b5cf6' }}>
                      {currentUser.userType === 'partner' ? currentUser.owner_name : currentUser.username}
                      {currentUser.userType === 'partner' && ' (พาร์ทเนอร์)'}
                    </span>
                    {currentUser.userType === 'user' && (
                      <svg 
                        className="w-4 h-4 text-gray-400 ml-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ 
                          transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>

                  {/* User Menu Popup */}
                  {showUserMenu && currentUser.userType === 'user' && (
                    <div 
                      className="user-menu-popup"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: '0',
                        marginTop: '8px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                        border: '1px solid #e5e7eb',
                        minWidth: '200px',
                        zIndex: 1000,
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                        <div style={{ fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                          {currentUser.username}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {currentUser.useremail}
                        </div>
                      </div>
                      
                      <div style={{ padding: '8px 0' }}>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate('/profile');
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            textAlign: 'left',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#374151',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          ข้อมูลผู้ใช้
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate('/bookings');
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            textAlign: 'left',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#374151',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                          </svg>
                          สถานะการจอง
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate('/history');
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            textAlign: 'left',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#374151',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          ประวัติการใช้บริการ
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate('/reviews');
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            textAlign: 'left',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#374151',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          รีวิว
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate('/favorites');
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            textAlign: 'left',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#374151',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          รายการโปรด
                        </button>
                      </div>
                      
                      <div style={{ borderTop: '1px solid #f3f4f6', padding: '8px 0' }}>
                        <button
                          onClick={handleLogout}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            textAlign: 'left',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          ออกจากระบบ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {(currentUser.username === 'admin' || 
                  (currentUser.useremail && currentUser.useremail.includes('@admin.com')) ||
                  (currentUser.owner_email && currentUser.owner_email.includes('@admin.com'))) && (
                  <Link to="/admin" className="nav-link" style={{ backgroundColor: '#ff6b35', color: 'white', padding: '5px 10px', borderRadius: '3px' }}>
                    จัดการระบบ
                  </Link>
                )}
                {currentUser.userType === 'partner' && (
                  <button 
                    onClick={handleLogout}
                    className="nav-link login-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ออกจากระบบ
                  </button>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-link login-link">เข้าสู่ระบบ</Link>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={
          <div className="content-container">
            {/* Search Bar */}
            <div style={{
              display: 'flex',
              maxWidth: '600px',
              margin: '20px auto',
              gap: '0'
            }}>
              <input 
                type="text" 
                placeholder="ค้นหา"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '2px solid #6b46c1',
                  borderRight: 'none',
                  borderRadius: '8px 0 0 8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
              <button 
                aria-label="ค้นหา"
                style={{
                  background: '#6b46c1',
                  border: '2px solid #6b46c1',
                  borderRadius: '0 8px 8px 0',
                  padding: '12px 16px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>

            {/* Promotion Section */}

            <section className="promotion-section">
              <h2 className="section-title">ข้อเสนอพิเศษ</h2>
              <p className="promotion-subtitle">โปรโมชั่น ส่วนลด</p>
              
              <div className="promotion-card">
                <div className="promotion-content">
                  <h3 className="promotion-title">ประหยัดค่าเข้าใช้ฟิตเนส</h3>
                  <p className="promotion-desc">เริ่มต้นการออกกําลังกาย เพื่อสุขภาพที่ดี</p>
                  <span className="discount-badge">ส่วนลด 10 %</span>
                </div>
              </div>

              
            </section>

            {/* Fitness Locations */}
            <section className="locations-section">
              <h2 className="section-title">ฟิตเนสที่อยู่ใกล้</h2>
              <LocationGrid />
            </section>
          </div>
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/registerpartners" element={<RegisterPartners />} />
        <Route path="/mainpartners" element={<MainPartners />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/fitness/:id" element={<FitnessDetail />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;