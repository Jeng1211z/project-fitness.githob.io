/*import { supabase } from '../lib/supabase';

// ฟังก์ชันทดสอบการเชื่อมต่อ Supabase
export const testSupabaseConnection = async () => {
  try {
    console.log('ทดสอบการเชื่อมต่อ Supabase...');
    
    // ทดสอบการเชื่อมต่อโดยการ query ตารางพื้นฐาน
    const { data, error } = await supabase
      .from('tbl_owner')
      .select('owner_id')
      .limit(1);
    
    if (error) {
      console.error('Supabase Connection Error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('เชื่อมต่อ Supabase สำเร็จ:', data);
    return { success: true, data };
    
  } catch (err) {
    console.error('Network Error:', err);
    return { success: false, error: err.message };
  }
};

// ฟังก์ชันทดสอบการ login สำหรับ owner
export const testOwnerLogin = async (email, password) => {
  try {
    console.log('ทดสอบ owner login:', email);
    
    const { data, error } = await supabase
      .from('tbl_owner')
      .select('*')
      .eq('owner_email', email)
      .eq('owner_password', password)
      .single();
    
    return { data, error };
  } catch (err) {
    console.error('Owner login error:', err);
    return { data: null, error: err };
  }
};

// ฟังก์ชันทดสอบการ login สำหรับ user
export const testUserLogin = async (email, password) => {
  try {
    console.log('ทดสอบ user login:', email);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('useremail', email)
      .eq('userpassword', password)
      .single();
    
    return { data, error };
  } catch (err) {
    console.error('User login error:', err);
    return { data: null, error: err };
  }
};
*/