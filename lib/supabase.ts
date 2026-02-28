import { isAdminUser } from '@/action/user'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

// Create Supabase client
const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SECRET_KEY!)
const productBucket = 'products'
const digitalFileBucket = 'digital-files'

// Upload Product Image
export const uploadProductImage = async function(file: File) {
  if(!await isAdminUser()) throw new Error('You are not Admin!!')

  const extension = file.name.split('.').pop();
  const fileName = `product-${Date.now()}.${extension}`

  const { data, error } = await supabaseAdmin.storage.from(productBucket).upload(fileName, file, {
    upsert: false,
    cacheControl: '3600',
    contentType: file.type,
  })

  if (error) {
    throw new Error('Fail to upload file to product bucket storage.')
  }

  return `${supabaseUrl}/storage/v1/object/public/${productBucket}/${data.path}`
}

// Upload Product Digital File
export const uploadProductDigitalFile = async function(file: File) {
  if(!await isAdminUser()) throw new Error('You are not Admin!!')

  const extension = file.name.split('.').pop();
  const fileName = `digital-file-${Date.now()}.${extension}`;

  const { data, error } = await supabaseAdmin.storage.from(digitalFileBucket).upload(fileName, file, {
    upsert: false,
    cacheControl: '3600',
    contentType: file.type
  })

  if (error) {
    throw new Error('Fail to upload file to digital file bucket storage.')
  } 

  return data.path
}

// Delete Product Image
export const deleteProductImage = async function(imageUrl: string) {
  if (!await isAdminUser()) throw new Error('You are not Admin!!');

  if (!imageUrl) return;

  try {
    const pathToRemove = imageUrl.split('/').pop(); 

    if (!pathToRemove) throw new Error('ไม่พบชื่อไฟล์ใน URL');

    const { data, error } = await supabaseAdmin.storage
      .from(productBucket)
      .remove([pathToRemove]);

    if (error) {
      throw new Error('ลบรูปภาพใน Storage ไม่สำเร็จ');
    }

    return true;
  } catch (error) {
    throw new Error('เกิดข้อผิดพลาดในการลบรูปภาพ');
  }
}

// Delete Product Digital File
export const deleteProductDigitalFile = async function(fileUrl: string) {
  if (!await isAdminUser()) throw new Error('You are not Admin!!');

  if (!fileUrl) return;

  try {
    const rawPath = fileUrl.split('/').pop();
    const pathToRemove = rawPath ? decodeURIComponent(rawPath) : null;

    if (!pathToRemove) throw new Error('ไม่พบชื่อไฟล์ใน URL');

    const { data, error } = await supabaseAdmin.storage
      .from(digitalFileBucket)
      .remove([pathToRemove]);

    if (error) {
      throw new Error('ลบไฟล์ digital ใน Storage ไม่สำเร็จ');
    }

    return true;
  } catch (error) {
    throw new Error('เกิดข้อผิดพลาดในการลบไฟล์');
  }
}
