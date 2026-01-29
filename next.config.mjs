/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // อนุญาตให้ใช้รูปจาก placeholder
      },
      {
        protocol: 'https',
        hostname: 'blogger.googleusercontent.com', // อนุญาตให้ใช้รูปจาก Blogger (เผื่อใช้รูปเดิมจากโปรเจกต์คุณทวี)
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // อนุญาตให้ใช้รูปจาก Firebase Storage
      },
    ],
  },
};

export default nextConfig;