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
        // ตรวจสอบโดเมนอีเมลองค์กร
        if (currentUser.email.endsWith("@fufonglabs.com")) {
          setUser(currentUser);
          if (pathname === "/login") router.push("/");
        } else {
          await signOut(auth);
          setUser(null);
          alert("ขออภัย! อนุญาตเฉพาะบัญชี @fufonglabs.com เท่านั้น");
          router.push("/login");
        }
      } else {
        setUser(null);
        // ถ้าพยายามเข้าหน้า admin แต่ไม่ได้ login ให้ดีดไปหน้า login
        if (pathname.startsWith("/admin") && pathname !== "/login") {
          router.push("/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="animate-spin text-red-600" size={48} />
        <p className="text-slate-400 text-sm font-light">กำลังตรวจสอบสิทธิ์...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};