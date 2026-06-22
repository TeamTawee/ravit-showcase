"use client";
import Image from "next/image";
import { Facebook, Instagram, ArrowRight, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Kanit, Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const kanit = Kanit({ subsets: ["thai", "latin"], weight: ["300", "400", "500", "600", "700", "800", "900"], display: "swap" });

// ปรับปรุง SocialLink: เพิ่มความสมูธ แสงวิ่ง (Shine) และแอนิเมชันลูกศร
const SocialLink = ({ href, icon, title, delay }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    // เวลา Hover จะขยายขึ้นนิดนึง พร้อมเปล่งแสงเงานุ่มๆ สีแดง (ไม่เปลี่ยนสีเส้นขอบให้กระตุก)
    whileHover={{ 
      scale: 1.02, 
      boxShadow: "0 12px 25px -5px rgba(230, 0, 0, 0.15), 0 8px 10px -6px rgba(230, 0, 0, 0.1)" 
    }}
    // เวลากด (แตะมือถือ) ปุ่มจะยุบลงนิดนึงให้ความรู้สึกสมจริง
    whileTap={{ scale: 0.97 }}
    transition={{ duration: 0.4, delay: delay }}
    className="group relative flex items-center justify-between w-full p-4 md:p-5 mb-4 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden active:bg-slate-50"
  >
    {/* Shine Effect: แสงเงาวิ่งพาดผ่านปุ่มบนมือถือ (วิ่งทุกๆ 4.5 วินาที) */}
    <motion.div
      animate={{ x: ["-200%", "300%"] }}
      transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 4.5, ease: "easeInOut" }}
      className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-slate-100/60 to-transparent skew-x-[-25deg] z-10 pointer-events-none"
    />

    <div className="flex items-center gap-4 md:gap-5 relative z-20">
      {/* กล่องไอคอน: ปกติพื้นเทาอ่อน -> โฮเวอร์เป็นพื้นแดงไอคอนขาว (ปรับให้ Transition สมูธขึ้น) */}
      <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 text-[#E60000] border border-slate-100 rounded-xl flex items-center justify-center transition-all duration-500 ease-out group-hover:bg-[#E60000] group-hover:text-white group-hover:shadow-md">
        {icon}
      </div>
      {/* ชื่อ Social: คงสีดำไว้ ไม่เปลี่ยนเป็นแดง จะได้ดูหนักแน่นและไม่รกตา */}
      <span className="font-bold text-slate-800 text-lg md:text-xl tracking-tight">
        {title}
      </span>
    </div>
    
    {/* ลูกศร: อยู่ในวงกลมเทา -> โฮเวอร์วงกลมอมแดงนิดๆ */}
    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 flex items-center justify-center transition-colors duration-500 group-hover:bg-red-50 relative z-20">
      {/* Ambient Animation: ให้ลูกศรขยับซ้ายขวาเบาๆ ตลอดเวลา (ช่วยให้หน้าจอมือถือไม่ดูนิ่งเกินไป) */}
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowRight className="text-slate-400 group-hover:text-[#E60000] transition-colors duration-300" size={18} strokeWidth={2.5} />
      </motion.div>
    </div>
  </motion.a>
);

export default function LinktreePage() {
  return (
    <div 
      className="min-h-screen relative overflow-x-hidden flex flex-col items-center bg-[#F5F5F7] pb-16"
      style={{ fontFamily: `${inter.style.fontFamily}, ${kanit.style.fontFamily}, sans-serif` }}
    >
      {/* 1. พื้นหลังไล่เฉดสีแดงตัดขอบโค้ง (The Red Wave แบบนามบัตร) */}
      <div className="absolute top-0 left-0 w-full h-[280px] md:h-[360px] bg-gradient-to-br from-[#7a1010] via-[#CC0000] to-[#E60000] z-0">
        {/* ลวดลายจุด (Dot Pattern) */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        {/* SVG โค้งเว้าแบบหน้านามบัตร (ด้านซ้ายเว้าสูง ด้านขวาตื้น) */}
        <svg 
          className="absolute -bottom-[1px] w-full h-[80px] md:h-[140px]" 
          preserveAspectRatio="none" 
          viewBox="0 0 1440 320"
        >
          <path fill="#F5F5F7" d="M0,0 C400,0 800,320 1440,320 L1440,320 L0,320 Z"></path>
        </svg>
      </div>

      {/* Main Content Wrapper */}
      {/* ปรับระยะดันลงมาให้รูปโปรไฟล์เลื่อนขึ้นไปทับเส้นโค้งพอดี */}
      <div className="w-full max-w-lg mx-auto relative z-10 px-6 pt-[160px] md:pt-[220px]">
        
        {/* 2. ตรงกลาง: รูปโปรไฟล์ทับเส้นโค้ง ตำแหน่งงานอยู่ใต้รูป */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10"
        >
          {/* รูปโปรไฟล์ลดการเด้ง เน้นความหนักแน่น เฟดอินขึ้นมาเฉยๆ */}
          <div className="relative w-40 h-40 mx-auto mb-6">
            <div className="absolute -inset-2 bg-black/5 rounded-[45px] blur-lg"></div>
            <div className="relative w-full h-full rounded-[40px] overflow-hidden border-[6px] border-white shadow-xl bg-white">
              <Image 
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi4vCdqBt6QZT0OU6mh1hCH3LRHSKy4eoRqVKbee0JbRzHxWJ3AO84HsEDpA8SSHljW4jzVgpuc453DkhJxb6rsf89eGTL6HViFuqXLaFO0MWO8VAnWxr5kBWL7csqRWa_HAELgv2HxFjYcrzHUcJSAdWskVK6Nfwwq5eWi_C_FIlWojve8moiMWvTArwz6/s0/photo%20win.png" 
                alt="รวิศ สอดส่อง" 
                fill 
                className="object-cover object-top scale-110"
                priority
              />
            </div>
          </div>
          
          {/* ข้อมูลการจัดลำดับเรียงชื่อ ส่วนอื่นๆ เหมือนเดิม */}
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">รวิศ สอดส่อง</h1>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight uppercase">
            RAVIT (WIN) SODSONG<span className="text-[#E60000]">.</span>
          </h2>
          
          <div className="mt-5 space-y-2 px-2">
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

        {/* 3. ปุ่มลิงก์: เรียงลงมา คุมโทน แดง-ขาว-ดำ */}
        <div className="w-full">
          <SocialLink 
            href="https://www.facebook.com/profile.php?id=61554124575777" 
            icon={<Facebook size={26} strokeWidth={2} />} 
            title="Facebook" 
            delay={0.2}
          />
          <SocialLink 
            href="https://www.instagram.com/ravit.ss" 
            icon={<Instagram size={26} strokeWidth={2} />} 
            title="Instagram" 
            delay={0.3}
          />
          <SocialLink 
            href="https://www.tiktok.com/@ravitsodsong" 
            icon={
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
              </svg>
            } 
            title="TikTok" 
            delay={0.4}
          />

          {/* ปุ่ม Website (Coming Soon) คุมโทนเทาๆ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-between w-full p-4 md:p-5 mb-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl cursor-not-allowed opacity-70"
          >
            <div className="flex items-center gap-4 md:gap-5">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white text-slate-400 rounded-xl flex items-center justify-center shadow-sm border border-slate-200">
                <Globe size={26} strokeWidth={2} />
              </div>
              <span className="font-bold text-slate-400 text-lg md:text-xl tracking-tight">Official Website</span>
            </div>
            
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Soon</span>
            </div>
          </motion.div>
        </div>

        {/* 4. ล่างสุด: Slogan พาดกลางด้วยตัวหนา และตามด้วย Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-14 mb-8 text-center"
        >
          <h3 className="text-sm md:text-base font-black tracking-widest text-slate-900 leading-relaxed uppercase">
            ENHANCING <span className="text-[#E60000]">OPPORTUNITY</span>,<br/>
            ENSURING <span className="text-[#E60000]">EQUALITY</span> FOR ALL.
          </h3>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-[2px] bg-slate-300/60 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-[#E60000] rounded-full"></div>
            <div className="w-12 h-[2px] bg-slate-300/60 rounded-full"></div>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Official Digital Presence</p>
        </motion.div>

      </div>
    </div>
  );
}