"use client";
import Image from "next/image";
import { Facebook, Instagram, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Kanit, Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const kanit = Kanit({ subsets: ["thai", "latin"], weight: ["300", "400", "500", "600", "700"], display: "swap" });

// ปรับปรุง SocialLink ให้รับค่าสีของแต่ละแบรนด์ (Brand Colors)
const SocialLink = ({ href, icon, title, delay, colorClass, bgClass }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileTap={{ scale: 0.96 }} 
    transition={{ duration: 0.5, delay: delay }}
    className="group flex items-center justify-between w-full p-5 mb-4 bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] active:shadow-inner active:bg-slate-50 transition-all duration-300"
  >
    <div className="flex items-center gap-5">
      <div className={`w-14 h-14 bg-white ${colorClass} rounded-2xl flex items-center justify-center shadow-sm border border-slate-100`}>
        {icon}
      </div>
      <span className="font-bold text-slate-800 text-xl tracking-tight">{title}</span>
    </div>
    
    <div className={`w-10 h-10 rounded-full ${bgClass} flex items-center justify-center`}>
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowRight className={colorClass} size={18} />
      </motion.div>
    </div>
  </motion.a>
);

export default function LinktreePage() {
  return (
    <div 
      className="min-h-screen relative overflow-hidden flex flex-col items-center py-16 px-6"
      style={{ fontFamily: `${inter.style.fontFamily}, ${kanit.style.fontFamily}, sans-serif` }}
    >
      {/* Dynamic Background Elements - ให้ลอยไปมาเป็นพื้นหลังเบลอๆ */}
      <div className="absolute inset-0 bg-[#F5F5F7] z-0"></div>
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#E60000]/5 rounded-full blur-[80px]"
      ></motion.div>
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[80px]"
      ></motion.div>

      <div className="w-full max-w-lg mx-auto relative z-10">
        
        {/* Profile Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* รูปโปรไฟล์ลอยขึ้นลงเบาๆ (Floating effect) */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-40 h-40 mx-auto mb-8"
          >
            <div className="absolute inset-0 bg-[#E60000] rounded-[40px] blur-2xl opacity-20"></div>
            <div className="relative w-full h-full rounded-[40px] overflow-hidden border-[4px] border-white shadow-xl bg-white">
              <Image 
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi4vCdqBt6QZT0OU6mh1hCH3LRHSKy4eoRqVKbee0JbRzHxWJ3AO84HsEDpA8SSHljW4jzVgpuc453DkhJxb6rsf89eGTL6HViFuqXLaFO0MWO8VAnWxr5kBWL7csqRWa_HAELgv2HxFjYcrzHUcJSAdWskVK6Nfwwq5eWi_C_FIlWojve8moiMWvTArwz6/s0/photo%20win.png" 
                alt="รวิศ สอดส่อง" 
                fill 
                className="object-cover object-top scale-110"
                priority
              />
            </div>
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">รวิศ สอดส่อง</h1>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight uppercase">
            RAVIT (WIN) SODSONG<span className="text-[#E60000]">.</span>
          </h2>
          
          <div className="mt-6 space-y-3 px-2">
            {/* แก้ไขให้ตัดขึ้นบรรทัดใหม่ตามที่บรีฟ */}
            <p className="text-[#E60000] font-bold text-sm md:text-base leading-snug">
              ที่ปรึกษาประจำคณะกรรมาธิการต่างประเทศ <br/>
              สภาผู้แทนราษฎร รัฐสภา
            </p>
            <p className="text-slate-500 font-medium text-[11px] md:text-xs leading-relaxed uppercase tracking-widest">
              Advisor to the Foreign Affairs Committee, <br/>
              The House of Representative, Parliament
            </p>
          </div>
        </motion.div>

        {/* Links Section (แยกสีตาม Brand) */}
        <div className="w-full px-2">
          <SocialLink 
            href="https://www.facebook.com/profile.php?id=61554124575777" 
            icon={<Facebook size={26} strokeWidth={2.5} />} 
            title="Facebook" 
            delay={0.2}
            colorClass="text-[#1877F2]"
            bgClass="bg-[#1877F2]/10"
          />
          <SocialLink 
            href="https://www.instagram.com/ravit.ss" 
            icon={<Instagram size={26} strokeWidth={2.5} />} 
            title="Instagram" 
            delay={0.3}
            colorClass="text-[#E1306C]"
            bgClass="bg-[#E1306C]/10"
          />
          <SocialLink 
            href="https://www.tiktok.com/@ravitsodsong" 
            icon={
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
              </svg>
            } 
            title="TikTok" 
            delay={0.4}
            colorClass="text-[#000000]"
            bgClass="bg-slate-200"
          />
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-[2px] bg-slate-200/60 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-[#E60000] rounded-full opacity-60"></div>
            <div className="w-12 h-[2px] bg-slate-200/60 rounded-full"></div>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Official Digital Presence</p>
        </motion.div>

      </div>
    </div>
  );
}