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
      if (currentUser) {
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    if (user) {
      // ถ้า Login แล้วและเปิดหน้า login ให้เด้งไปหน้า admin
      if (pathname === "/login") {
        router.push("/admin"); 
      }
    } else {
      // ถ้ายังไม่ Login อนุญาตให้เข้าได้แค่หน้า /login และหน้าแรก / เท่านั้น
      if (pathname !== "/login" && pathname !== "/") {
        router.push("/login");
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    // ถ้าเป็นหน้าแรก (/) ให้ข้ามหน้าจอกำลังโหลดไปเลย เพื่อให้ Landing Page โหลดทันที
    if (pathname === "/") {
      return (
        <AuthContext.Provider value={{ user }}>
          {children}
        </AuthContext.Provider>
      );
    }

    // สำหรับหน้าอื่นๆ ค่อยขึ้นหน้า Verifying Access...
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7] gap-4">
        <Loader2 className="animate-spin text-[#E60000]" size={48} />
        <p className="text-slate-400 text-sm font-light tracking-widest uppercase">Verifying Access...</p>
      </div>
    );
  }

  // ป้องกันการกระพริบของหน้าเว็บที่โดนล็อค ยกเว้นหน้าแรก (/)
  if (!user && pathname !== "/login" && pathname !== "/") {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};