"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase"; 
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // สถานะโหลดเริ่มต้นเป็น true เสมอ
  const router = useRouter();
  const pathname = usePathname();

  // 🟢 Effect 1: ฟังสถานะ Login (รันครั้งเดียวตอนเข้าเว็บ)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // เช็ค Email แบบตัวพิมพ์เล็ก/ใหญ่ เพื่อความชัวร์ (toLowerCase)
        if (currentUser.email.toLowerCase().endsWith("@fufonglabs.com")) {
          setUser(currentUser);
        } else {
          await signOut(auth);
          setUser(null);
          alert("ขออภัย! อนุญาตเฉพาะบัญชี @fufonglabs.com เท่านั้น");
        }
      } else {
        setUser(null);
      }
      setLoading(false); // โหลดเสร็จแล้ว (ไม่ว่าผลจะเป็นยังไง)
    });

    return () => unsubscribe();
  }, []); // ✅ ว่างไว้แบบนี้ถูกแล้ว (ห้ามใส่ router/pathname)

  // 🔴 Effect 2: ยามเฝ้าประตู (ทำงานเมื่อ pathname เปลี่ยน หรือ user เปลี่ยน)
  useEffect(() => {
    if (loading) return; // ถ้ากำลังเช็คอยู่ อย่าเพิ่งทำอะไร

    if (user) {
      // กรณี: มีคน Login แล้ว
      if (pathname === "/login") {
        router.push("/"); // ถ้าอยู่หน้า Login ให้ไล่ไปหน้าแรก
      }
    } else {
      // กรณี: ยังไม่ Login
      if (pathname !== "/login") {
        router.push("/login"); // ถ้าไม่ได้อยู่หน้า Login ให้ไล่ไป Login
      }
    }
  }, [user, loading, pathname, router]);


  // 3. หน้าโหลด (Loading Screen)
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7] gap-4">
        <Loader2 className="animate-spin text-[#E60000]" size={48} />
        <p className="text-slate-400 text-sm font-light tracking-widest uppercase">Verifying Access...</p>
      </div>
    );
  }

  // 4. ถ้าโหลดเสร็จแล้ว แต่ไม่มีสิทธิ์ และยังไม่ได้ถูกดีดไปหน้า Login (กันเหนียว)
  if (!user && pathname !== "/login") {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};