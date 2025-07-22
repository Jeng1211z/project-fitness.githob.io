import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart, 
  faMapMarkerAlt, 
  faClock, 
  faStar,
  faWifi,
  faParking,
  faSwimmingPool,
  faDumbbell,
  faShower,
  faLock,
  faAirFreshener,
  faUsers
} from '@fortawesome/free-solid-svg-icons';

const FitnessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data - ในการใช้งานจริงจะดึงจาก API
  const fitnessData = {
    id: id,
    name: "Fitness Plus+",
    location: "เมืองทองธานี, ศ.ดร.ศิริราชิน",
    images: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300", 
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    price: 89,
    priceUnit: "บาท/ชม",
    rating: 8.5,
    reviewCount: 156,
    openTime: "เปิด - ปิด",
    openHours: "เปิด 24 ชั่วโมง",
    description: "ฟิตเนสที่ทันสมัยพร้อมอุปกรณ์ครบครัน เหมาะสำหรับการออกกำลังกายทุกประเภท",
    amenities: [
      { icon: faWifi, name: "WiFi ฟรี" },
      { icon: faParking, name: "ที่จอดรถ" },
      { icon: faSwimmingPool, name: "สระว่ายน้ำ" },
      { icon: faDumbbell, name: "อุปกรณ์ยกน้ำหนัก" },
      { icon: faShower, name: "ห้องอาบน้ำ" },
      { icon: faLock, name: "ล็อกเกอร์" },
      { icon: faAirFreshener, name: "เครื่องฟอกอากาศ" },
      { icon: faUsers, name: "ครูฝึก" }
    ],
    features: [
      "อุปกรณ์ออกกำลังกายครบครัน",
      "ห้องแอร์ทุกพื้นที่", 
      "ที่จอดรถกว้างขวาง",
      "เปิดบริการ 24 ชั่วโมง",
      "มีครูฝึกมืออาชีพ",
      "ห้องแต่งตัวสะอาด"
    ]
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '10px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              margin: '0 0 10px 0',
              color: '#333'
            }}>
              {fitnessData.name}
            </h1>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '5px',
              color: '#666',
              fontSize: '1.1rem'
            }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>{fitnessData.location}</span>
            </div>
          </div>
          <button
            onClick={toggleFavorite}
            style={{
              background: 'white',
              border: '2px solid #ddd',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              color: isFavorite ? '#e74c3c' : '#999'
            }}
          >
            <FontAwesomeIcon icon={faHeart} />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gridTemplateRows: '200px 200px',
        gap: '10px',
        marginBottom: '30px',
        borderRadius: '15px',
        overflow: 'hidden'
      }}>
        <div style={{
          gridRow: '1 / 3',
          backgroundImage: `url(${fitnessData.images[0]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#f0f0f0'
        }} />
        {fitnessData.images.slice(1, 4).map((img, index) => (
          <div
            key={index}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#f0f0f0'
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '30px' }}>
        {/* Left Column */}
        <div style={{ flex: '2' }}>
          {/* Price and Rating */}
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 'bold', 
                  color: '#6b46c1',
                  margin: '0'
                }}>
                  {fitnessData.price} <span style={{ fontSize: '1rem', color: '#666' }}>{fitnessData.priceUnit}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  marginTop: '10px'
                }}>
                  <div style={{
                    background: '#6b46c1',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}>
                    {fitnessData.rating}
                  </div>
                  <span style={{ fontSize: '1rem', color: '#666' }}>
                    {fitnessData.reviewCount} ความคิดเห็นจากผู้ใช้งาน
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', color: '#666' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <FontAwesomeIcon icon={faClock} />
                  <span>{fitnessData.openTime}</span>
                </div>
                <div style={{ 
                  color: '#e74c3c', 
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  marginTop: '5px'
                }}>
                  {fitnessData.openHours}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '1.3rem' }}>เกี่ยวกับสถานที่</h3>
            <p style={{ 
              color: '#666', 
              lineHeight: '1.6',
              margin: '0'
            }}>
              {fitnessData.description}
            </p>
          </div>

          {/* Amenities */}
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.3rem' }}>สิ่งอำนวยความสะดวก</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              {fitnessData.amenities.map((amenity, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#666'
                }}>
                  <FontAwesomeIcon icon={amenity.icon} style={{ color: '#6b46c1' }} />
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.3rem' }}>จุดเด่น</h3>
            <ul style={{ 
              margin: '0',
              paddingLeft: '20px',
              color: '#666',
              lineHeight: '1.8'
            }}>
              {fitnessData.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div style={{ flex: '1' }}>
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: '20px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                fontSize: '1.8rem', 
                fontWeight: 'bold', 
                color: '#6b46c1'
              }}>
                ฿{fitnessData.price} <span style={{ fontSize: '1rem', color: '#666' }}>/ ชั่วโมง</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                วันที่ต้องการใช้บริการ
              </label>
              <input
                type="date"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '10px',
              marginBottom: '20px'
            }}>
              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  เริ่ม
                </label>
                <input
                  type="time"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  สิ้นสุด
                </label>
                <input
                  type="time"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <button
              style={{
                width: '100%',
                padding: '15px',
                background: '#6b46c1',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '15px',
                transition: 'background 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#553c9a'}
              onMouseLeave={(e) => e.target.style.background = '#6b46c1'}
            >
              จองทันที
            </button>

            <div style={{ 
              textAlign: 'center',
              color: '#666',
              fontSize: '0.9rem'
            }}>
              ยังไม่มีการเรียกเก็บเงิน
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessDetail;
