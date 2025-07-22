import React from 'react';
import LocationCard from './LocationCard';
import './LocationGrid.css';

const LocationGrid = () => {
  const locations = [
    {
      id: 1,
      name: "Fitness Plus+",
      location: "เมืองมหาสารคาม, ถ.ศรีสวัสดิ์ดำเนิน",
      hours: "เปิด 24 ชั่วโมง",
      price: 89,
      reviews: "156 ความคิดเห็นจากผู้ใช้งาน",
      imageUrl: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=500&q=80"
    },
    {
      id: 2,
      name: "MSU Fitness Center",
      location: "มหาวิทยาลัยมหาสารคาม, ตำบลขามเรียง",
      hours: "08:00 - 22:00",
      price: 50,
      reviews: "120 ความคิดเห็นจากผู้ใช้งาน",
      imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80"
    },
    {
      id: 3,
      name: "Power House Gym",
      location: "ตลาดโต้รุ่ง, เมืองมหาสารคาม",
      hours: "08:00 - 22:00",
      price: 79,
      reviews: "98 ความคิดเห็นจากผู้ใช้งาน",
      imageUrl: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=500&q=80"
    },
    {
      id: 4,
      name: "Strong Fitness",
      location: "ถ.นครสวรรค์, เมืองมหาสารคาม",
      hours: "07:00 - 22:00",
      price: 69,
      reviews: "135 ความคิดเห็นจากผู้ใช้งาน",
      imageUrl: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=500&q=80"
    },
    {
      id: 5,
      name: "Armor gym มมส",
      location: "ท่าขอนยาง, เมืองมหาสารคาม",
      hours: "10:00 - 00:00",
      price: 50,
      reviews: "78 ความคิดเห็นจากผู้ใช้งาน",
      imageUrl: "https://scontent.fkkc3-1.fna.fbcdn.net/v/t39.30808-6/474682594_938938984886589_7136921238856072482_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_ohc=r9WNyBcMDVsQ7kNvwHDqLOo&_nc_oc=AdmwHVA_jBzI_EMVstFmDT6KWC10W3A2YpbnSUOuTvddv29zBRpByUNz3_gKX8ZpYXfDTw3dgqZD1zfXEEExqlhJ&_nc_zt=23&_nc_ht=scontent.fkkc3-1.fna&_nc_gid=rSdc-jiyY97rF3YrhKQaog&oh=00_AfRjWN5NohLHW9bHm7dEOC-tcTt2auscsFrZmdID9vNong&oe=68845AB9"
    }
  ];

  return (
    <div className="locations-grid">
      {locations.map((location) => (
        <LocationCard key={location.id} {...location} />
      ))}
    </div>
  );
};

export default LocationGrid;
