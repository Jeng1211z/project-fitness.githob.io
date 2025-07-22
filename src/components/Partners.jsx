import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Partners = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fit_name: '',
    fit_user: '',
    fit_price: '',
    fit_image: '',
    fit_address: '',
    fit_contact: '',
    fit_dateClose: '',
    fit_dateOpen: '',
    fit_location: '',
    fit_moreDetails: '',
    fit_phone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // สร้าง preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // อัพเดท formData ด้วยชื่อไฟล์
      setFormData(prev => ({
        ...prev,
        fit_image: file.name
      }));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      fit_image: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // เพิ่มข้อมูลฟิตเนสลงตาราง tbl_fitness
      const { data, error: fitnessError } = await supabase
        .from('tbl_fitness')
        .insert([
          {
            fit_name: formData.fit_name,
            fit_user: formData.fit_user,
            fit_price: formData.fit_price,
            fit_image: formData.fit_image,
            fit_address: formData.fit_address,
            fit_contact: formData.fit_contact,
            fit_dateclose: formData.fit_dateClose ? new Date(formData.fit_dateClose).toISOString() : null,
            fit_dateopen: formData.fit_dateOpen ? new Date(formData.fit_dateOpen).toISOString() : null,
            fit_location: formData.fit_location,
            fit_moredetails: formData.fit_moreDetails,
            fit_phone: formData.fit_phone
          }
        ])
        .select();

      if (fitnessError) {
        console.error('Fitness Error:', fitnessError);
        throw new Error(`เกิดข้อผิดพลาดในการสมัครพาร์ทเนอร์: ${fitnessError.message}`);
      }

      alert('สมัครเป็นพาร์ทเนอร์สำเร็จ! ขอบคุณที่เข้าร่วมกับเรา');
      navigate('/');
    } catch (error) {
      setError(error.message || 'เกิดข้อผิดพลาดในการสมัครพาร์ทเนอร์');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-violet-900">
          สมัครเป็นพาร์ทเนอร์กับ JM FITNESS
        </h1>
        <p className="text-gray-600 text-center mb-8">
          เข้าร่วมเป็นส่วนหนึ่งของเครือข่ายฟิตเนสที่ใหญ่ที่สุด
        </p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ชื่อฟิตเนส */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">ชื่อฟิตเนส *</label>
              <input
                type="text"
                name="fit_name"
                value={formData.fit_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="ระบุชื่อฟิตเนสของคุณ"
                required
              />
            </div>

            {/* ชื่อผู้ใช้ */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">ชื่อผู้ใช้ *</label>
              <input
                type="text"
                name="fit_user"
                value={formData.fit_user}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="ชื่อผู้ติดต่อหรือเจ้าของ"
                required
              />
            </div>

            {/* ราคา */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">ราคา *</label>
              <input
                type="text"
                name="fit_price"
                value={formData.fit_price}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="เช่น 500 บาท/เดือน"
                required
              />
            </div>

            {/* เบอร์โทรศัพท์ */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">หมายเลขโทรศัพท์ *</label>
              <input
                type="tel"
                name="fit_phone"
                value={formData.fit_phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="0XX-XXX-XXXX"
                required
              />
            </div>

            {/* รูปภาพ */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">รูปภาพฟิตเนส</label>
              
              {!imagePreview ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-violet-500 transition-colors flex flex-col items-center justify-center text-gray-500 hover:text-violet-500"
                  >
                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm font-medium">คลิกเพื่อเลือกรูปภาพ</span>
                    <span className="text-xs">PNG, JPG, GIF ขนาดไม่เกิน 5MB</span>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                  <div className="mt-2 text-sm text-gray-600">
                    ไฟล์: {imageFile?.name}
                  </div>
                </div>
              )}
            </div>

            {/* ข้อมูลการติดต่อ */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">ข้อมูลการติดต่อ *</label>
              <input
                type="text"
                name="fit_contact"
                value={formData.fit_contact}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="อีเมล หรือช่องทางติดต่ออื่น"
                required
              />
            </div>

            {/* เวลาเปิด */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">เวลาเปิด</label>
              <input
                type="time"
                name="fit_dateOpen"
                value={formData.fit_dateOpen}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* เวลาปิด */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">เวลาปิด</label>
              <input
                type="time"
                name="fit_dateClose"
                value={formData.fit_dateClose}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* ที่อยู่ */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">ที่อยู่ *</label>
            <textarea
              name="fit_address"
              value={formData.fit_address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="ที่อยู่เต็มของฟิตเนส"
              rows="3"
              required
            />
          </div>

          {/* ตำแหน่งใน Google Maps */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">ตำแหน่งใน Google Maps *</label>
            <input
              type="text"
              name="fit_location"
              value={formData.fit_location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="ลิงก์ Google Maps หรือพิกัด"
              required
            />
          </div>

          {/* รายละเอียดเพิ่มเติม */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">รายละเอียดเพิ่มเติม</label>
            <textarea
              name="fit_moreDetails"
              value={formData.fit_moreDetails}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="อุปกรณ์, บริการ, หรือข้อมูลเพิ่มเติมอื่นๆ"
              rows="4"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 bg-violet-900 text-white py-3 px-6 rounded-md hover:bg-violet-700 transition duration-300 disabled:bg-gray-400 font-medium"
              disabled={loading}
            >
              {loading ? 'กำลังส่งข้อมูล...' : 'สมัครเป็นพาร์ทเนอร์'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/mainpartners')}
              className="flex-1 bg-red-800 text-white py-3 px-6 rounded-md hover:bg-red-500 transition duration-300 disabled:bg-gray-400 font-medium"
              disabled={loading}
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Partners;
