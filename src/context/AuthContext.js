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
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // 1. ถ้ามีคน Login เข้ามา
      if (currentUser) {
        // ตรวจสอบโดเมนอีเมลองค์กร
        if (currentUser.email.endsWith("@fufonglabs.com")) {
          setUser(currentUser);
          // ถ้า Login แล้ว แต่อยู่หน้า Login -> ดีดเข้าหน้าแรกทันที
          if (pathname === "/login") {
            router.push("/");
          }
        } else {
          // ถ้าอีเมลผิด -> บังคับออกทันที
          await signOut(auth);
          setUser(null);
          alert("ขออภัย! อนุญาตเฉพาะบัญชี @fufonglabs.com เท่านั้น");
          router.push("/login");
        }
      } 
      // 2. ถ้าไม่ได้ Login (หรือ Log out ไปแล้ว)
      else {
        setUser(null);
        // 🔒 ไฮไลท์สำคัญ: ถ้าไม่อยู่หน้า Login -> ดีดไปหน้า Login ทันที (กันคนแอบเข้า link ตรง)
        if (pathname !== "/login") {
          router.push("/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  // 3. ระหว่างรอตรวจสอบสิทธิ์ ให้หมุนติ้วๆ ไปก่อน (ห้ามเห็นเนื้อหา)
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] gap-4">
        <Loader2 className="animate-spin text-[#E60000]" size={48} />
        <p className="text-slate-400 text-sm font-light tracking-widest uppercase">Verifying Access...</p>
      </div>
    );
  }

  // 4. ถ้าโหลดเสร็จแล้ว แต่ไม่มี User และไม่ได้อยู่หน้า Login (กันเหนียวอีกชั้นไม่ให้ render)
  if (!user && pathname !== "/login") {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};