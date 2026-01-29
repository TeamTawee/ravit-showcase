"use client";
import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase"; 
import { useRouter } from "next/navigation";
import { Loader2, LockKeyhole } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        // เช็คอีเมลองค์กร (Logic เดียวกับต้นฉบับ)
        if (!user.email.endsWith("@fufonglabs.com")) {
            await signOut(auth);
            setError("อนุญาตเฉพาะบัญชี @fufonglabs.com เท่านั้น");
            setLoading(false);
            return;
        }
        router.push("/");
    } catch (err) {
        if (err.code !== 'auth/popup-closed-by-user') {
            setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        }
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] p-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-10">
            <div className="w-20 h-20 bg-[#E60000] rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg rotate-3">
                <LockKeyhole size={36} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">RAVIT Portal</h1>
            <p className="text-slate-500 text-sm mt-2">ยืนยันตัวตนเพื่อจัดการเนื้อหา</p>
        </div>
        {error && <div className="mb-8 bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 italic">⚠️ {error}</div>}
        <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border-2 border-slate-100 text-slate-700 py-4 rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3"
        >
            {loading ? <Loader2 className="animate-spin" size={24}/> : "เข้าสู่ระบบด้วย Google"}
        </button>
      </div>
    </div>
  );
}