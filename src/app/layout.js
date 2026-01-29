import "./globals.css";
import { Kanit } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";

// ตั้งค่า Font Kanit ให้ดูทันสมัยและรองรับภาษาไทย
const kanit = Kanit({ 
  subsets: ["thai", "latin"], 
  weight: ["300", "400", "500", "600", "700"], 
  display: "swap" 
});

export const metadata = {
  title: "Ravit Sodsong - New Gen Voice", // เปลี่ยนชื่อหัวเว็บเป็น Ravit
  description: "Official Blog & Activities",
  robots: { index: false, follow: false }, // ป้องกัน Google bot สำหรับระบบภายใน
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={kanit.className}>
        {/* ครอบด้วย AuthProvider เพื่อให้ระบบ Login ทำงานได้ทุกหน้า */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}