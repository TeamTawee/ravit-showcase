"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Loader2, Facebook, Instagram, Send, Menu, ArrowRight, 
  Target, Lightbulb, BarChart3, 
  Briefcase, Globe, Database, GraduationCap, TrendingUp, Cpu
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Kanit, Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const kanit = Kanit({ subsets: ["thai", "latin"], weight: ["300", "400", "500", "600", "700"], display: "swap" });

// ส่วนแสดงผล Card ข่าวสาร/กิจกรรม
const StoryCard = ({ story }) => (
  <Link href={`/story/${story.slug || story.id}`} className="block break-inside-avoid mb-6">
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 group relative"
    >
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src={story.image || "https://via.placeholder.com/400"} 
            alt={story.title} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110" 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={65} 
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-90" />
        </div>
        <div className="absolute bottom-0 left-0 p-6 z-10 w-full">
          <span className="inline-block px-2 py-1 bg-[#E60000] text-white text-[10px] font-bold uppercase tracking-widest rounded mb-2">
            {story.category}
          </span>
          <h3 className="text-xl font-bold text-white leading-tight mb-2">
            {story.title}
          </h3>
          <p className="text-sm text-slate-200 font-medium line-clamp-2 leading-relaxed mt-1">
            {story.shortDesc}
          </p>
        </div>
      </div>
    </motion.div>
  </Link>
);

export default function HomePage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const q = query(collection(db, "projects"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        setStories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(s => s.published !== false));
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchStories();
  }, []);

  return (
    <div 
      className="min-h-screen bg-[#F5F5F7] text-[#121212]"
      style={{ fontFamily: `${inter.style.fontFamily}, ${kanit.style.fontFamily}, sans-serif` }}
    >
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-white/80 backdrop-blur-md">
        <div className="font-black text-2xl tracking-tighter cursor-pointer" onClick={() => window.scrollTo({top: 0})}>
            RAVIT<span className="text-[#E60000]">.</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest items-center">
          <a href="#home" className="hover:text-[#E60000] transition-colors">Intro</a>
          <a href="#vision" className="hover:text-[#E60000] transition-colors">Core Values</a>
          <a href="#bio" className="hover:text-[#E60000] transition-colors">Executive Profile</a>
          <a href="#stories" className="hover:text-[#E60000] transition-colors">Execution Log</a>
        </div>

        <button className="md:hidden p-2 text-slate-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>

        <AnimatePresence>
            {isMenuOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/5 z-0 md:hidden h-screen w-screen"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-white/90 backdrop-blur-2xl border-b border-slate-100 shadow-xl md:hidden rounded-b-3xl p-6 flex flex-col gap-4 z-10"
                    >
                        <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Intro</a>
                        <a href="#vision" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Core Values</a>
                        <a href="#bio" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Executive Profile</a>
                        <a href="#stories" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Execution Log</a>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      {/* 1. เปลี่ยน overflow-hidden เป็น overflow-x-clip เพื่อป้องกันไม่ให้ขอบบนของ Header ตัดหัวรูปภาพ */}
      <header id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-x-clip bg-white">
        <div className="absolute top-20 md:top-40 left-0 md:left-10 w-full text-center md:text-left text-[12vw] font-black text-slate-50 opacity-[0.08] select-none leading-none z-0 pointer-events-none">
            EXECUTION
        </div>
        
        {/* 2. ปรับระยะห่าง (gap) ให้สัมพันธ์กับขนาดจอ */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-6 lg:gap-12 relative z-10">
            
            {/* ฝั่งซ้าย (ข้อความ) - ให้พื้นที่ 60% บนจอขนาดกลาง (md:w-3/5) ป้องกันข้อความทับรูป */}
            <div className="w-full md:w-3/5 lg:w-1/2 text-left order-1 z-20">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <span className="inline-block px-3 py-1 bg-slate-900 text-white text-[10px] font-bold tracking-[0.3em] uppercase rounded-full mb-6">
                        Executive & Strategist
                    </span>
                    {/* ลดขนาด Font หน้าจอ md เป็น 6xl เพื่อไม่ให้ข้อความยาวจนล้น */}
                    <h1 className="text-6xl md:text-6xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[1.05] mb-6">
                        RAVIT<br/><span className="text-[#E60000]">SODSONG.</span>
                    </h1>
                    
                    <div className="text-xl md:text-2xl text-slate-600 font-medium max-w-xl ml-0 leading-relaxed mb-8">
                        เปลี่ยน <strong className="text-slate-900">"วิสัยทัศน์"</strong> ให้เป็น <strong className="text-[#E60000]">"ผลลัพธ์ที่เป็นรูปธรรม"</strong>
                        
                        {/* ปรับขนาดตัวหนังสือเล็กน้อยในจอ md เพื่อให้คงสภาพ 2 บรรทัดเสมอ */}
                        <div className="text-[15px] md:text-base lg:text-lg font-light mt-4 leading-snug md:leading-relaxed text-slate-500 border-l-4 border-[#E60000] pl-4 text-left">
                            <span className="block whitespace-nowrap lg:whitespace-normal">
                                ผสานประสบการณ์บริหาร Global Supply Chain การเจรจาระดับสากล
                            </span>
                            <span className="block">
                                และการวิเคราะห์ข้อมูลเชิงลึก เพื่อสร้างระบบนิเวศการแข่งขันที่ยั่งยืน
                            </span>
                        </div>
                    </div>
                    
                    <a href="#vision" className="inline-flex px-8 py-4 rounded-full bg-[#121212] text-white font-bold text-sm hover:bg-[#E60000] transition-all items-center gap-2 group shadow-xl hover:shadow-[#E60000]/20 ml-0">
                        เจาะลึกแนวคิดการทำงาน <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                    </a>
                </motion.div>
            </div>
            
            {/* ฝั่งขวา (รูปภาพ) - ให้พื้นที่ 40% บนจอขนาดกลาง (md:w-2/5) */}
            <div className="w-full md:w-2/5 lg:w-1/2 flex justify-center md:justify-end items-end relative order-2 mt-12 md:mt-0 z-10">
                
                {/* กล่องควบคุมสัดส่วน - บีบ max-w ลงในหน้าจอ md เพื่อหลีกทางให้ข้อความ */}
                <div className="relative w-full max-w-87.5 sm:max-w-87.5 md:max-w-85 lg:max-w-105 xl:max-w-115 aspect-3/4 mx-auto md:ml-auto md:mr-0">
                    
                    {/* กรอบหลัง - ให้สูงแค่ 75% เพื่อเหลือที่ว่างด้านบน 25% ให้หัวทะลุออกมาเองตามธรรมชาติ */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="absolute bottom-0 left-0 w-full h-[75%] bg-linear-to-tr from-slate-200 to-slate-50 rounded-[40px] shadow-2xl z-0"
                    />

                    {/* กล่องครอบรูป (สูง 100% ขอบล่างโค้งมนเป๊ะ) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute bottom-0 left-0 w-full h-full z-10 rounded-b-[40px] overflow-hidden pointer-events-none"
                    >
                        <div className="relative w-full h-full flex items-end justify-center">
                            <Image 
                                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi4vCdqBt6QZT0OU6mh1hCH3LRHSKy4eoRqVKbee0JbRzHxWJ3AO84HsEDpA8SSHljW4jzVgpuc453DkhJxb6rsf89eGTL6HViFuqXLaFO0MWO8VAnWxr5kBWL7csqRWa_HAELgv2HxFjYcrzHUcJSAdWskVK6Nfwwq5eWi_C_FIlWojve8moiMWvTArwz6/s0/photo%20win.png" 
                                alt="Ravit Sodsong" 
                                fill 
                                /* ลดการซูม (scale) ลงเหลือแค่ 1.05 เพื่อป้องกันไม่ให้หัวเลยกล่องไปจนถูกตัด */
                                className="object-contain object-bottom scale-[1.05] origin-bottom drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)]"
                                priority 
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
            
        </div>
      </header>

      {/* Core Values Section */}
      <section id="vision" className="-mt-15 md:-mt-15 py-24 bg-[#121212] text-white relative z-20">
        <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 md:text-center max-w-3xl mx-auto">
                <span className="text-[#E60000] font-bold tracking-[0.3em] uppercase text-xs">Core Values & Approaches</span>
                <h2 className="text-3xl md:text-5xl font-black mt-2">กระบวนทัศน์เพื่อการเติบโต</h2>
                <p className="text-slate-400 mt-4 font-light text-lg">หลักการบริหารและการวิเคราะห์ปัญหาที่เน้นความเป็นไปได้จริง โดยยึดมั่นใน 4 แกนหลัก</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-[#E60000]/50 transition-all group">
                    <BarChart3 className="text-[#E60000] mb-6" size={32}/>
                    <h3 className="text-xl font-bold mb-3">Data-Driven Decision</h3>
                    <p className="text-slate-400 font-light text-sm leading-relaxed">ทุกการตัดสินใจและจัดสรรทรัพยากรต้องอ้างอิงจากข้อมูลเชิงลึกและการวิเคราะห์ความคุ้มค่า เพื่อลดความสูญเปล่าและสร้าง Impact สูงสุด</p>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-[#E60000]/50 transition-all group">
                    <TrendingUp className="text-[#E60000] mb-6" size={32}/>
                    <h3 className="text-xl font-bold mb-3">Global Competitiveness</h3>
                    <p className="text-slate-400 font-light text-sm leading-relaxed">มองภาพรวมเศรษฐกิจแบบไร้พรมแดน การแก้ปัญหาภายในองค์กรหรือประเทศ ต้องสอดคล้องกับพลวัตของ Supply Chain ระดับโลก</p>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-[#E60000]/50 transition-all group">
                    <Globe className="text-[#E60000] mb-6" size={32}/>
                    <h3 className="text-xl font-bold mb-3">Diplomatic Negotiation</h3>
                    <p className="text-slate-400 font-light text-sm leading-relaxed">ศิลปะแห่งการเจรจาเพื่อรักษาผลประโยชน์ร่วม (Win-Win Solution) ทั้งในระดับคู่ค้าทางธุรกิจไปจนถึงการบริหารวิกฤตความขัดแย้งเชิงโครงสร้าง</p>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-[#E60000]/50 transition-all group">
                    <Cpu className="text-[#E60000] mb-6" size={32}/>
                    <h3 className="text-xl font-bold mb-3">Innovation as Standard</h3>
                    <p className="text-slate-400 font-light text-sm leading-relaxed">เทคโนโลยี (เช่น AI หรือ Automation) ไม่ใช่แค่เครื่องมือทางเลือก แต่คือ "มาตรฐานใหม่" ที่ต้องถูกนำมาใช้เพื่อยกระดับขีดความสามารถของทุนมนุษย์</p>
                </div>
            </div>
        </div>
      </section>

      {/* Bio / Executive Profile Section */}
      <section id="bio" className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <span className="text-[#E60000] font-bold tracking-[0.3em] uppercase text-xs">Executive Profile</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mt-2">บูรณาการ "ธุรกิจ" สู่ "ยุทธศาสตร์"</h2>
                <p className="text-lg text-slate-600 font-light mt-4 max-w-2xl mx-auto">
                    ความสำเร็จที่เกิดจากการผสานมุมมองของนักธุรกิจ ผู้เชี่ยวชาญด้านเศรษฐศาสตร์ และนักเจรจาระดับสากล
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6">
                        <Briefcase size={24} />
                    </div>
                    <span className="text-[#E60000] text-xs font-bold uppercase tracking-wider mb-2 block">Business & Global Trade</span>
                    <h4 className="font-bold text-xl text-slate-900 mb-3">ผู้บริหาร & ผู้ก่อตั้งองค์กร</h4>
                    <p className="text-slate-600 font-light text-sm leading-relaxed">
                        บริหาร Win Food Industry สร้างยอดขายระดับร้อยล้านบาท เชี่ยวชาญการจัดตั้ง Global Supply Chain ฝ่าวิกฤตเศรษฐกิจด้วยระบบ Data-Driven ทำให้เข้าใจโครงสร้างปัญหาทางธุรกิจระดับสากล
                    </p>
                </div>

                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className="w-14 h-14 bg-[#E60000] text-white rounded-2xl flex items-center justify-center mb-6">
                        <Globe size={24} />
                    </div>
                    <span className="text-[#E60000] text-xs font-bold uppercase tracking-wider mb-2 block">Diplomacy & Security</span>
                    <h4 className="font-bold text-xl text-slate-900 mb-3">อดีตคณะทำงาน รมว.ยุติธรรม</h4>
                    <p className="text-slate-600 font-light text-sm leading-relaxed">
                        รับบทบาทเจรจาการทูตเชิงเศรษฐกิจ สิทธิมนุษยชนระดับสากล และบริหารจัดการภาวะวิกฤต (Crisis Management)
                    </p>
                </div>

                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className="w-14 h-14 bg-slate-800 text-white rounded-2xl flex items-center justify-center mb-6">
                        <Target size={24} />
                    </div>
                    <span className="text-[#E60000] text-xs font-bold uppercase tracking-wider mb-2 block">Strategic Policy</span>
                    <h4 className="font-bold text-xl text-slate-900 mb-3">ผู้เชี่ยวชาญด้านงบประมาณ</h4>
                    <p className="text-slate-600 font-light text-sm leading-relaxed">
                        นำหลักเศรษฐศาสตร์และการวิเคราะห์ต้นทุนทางธุรกิจ มาใช้ประเมินความคุ้มค่าของโครงการระดับรัฐ (งบประมาณ 3.78 ล้านล้านบาท) เพื่อเพิ่มประสิทธิภาพการจัดสรรทรัพยากร
                    </p>
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-[40px] p-8 md:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
                <Database className="absolute -left-10 -bottom-10 text-white/5" size={200} />
                <div className="relative z-10 md:w-1/3 text-center lg:text-left">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#E60000] rounded-full mb-4">
                        <GraduationCap size={20} className="text-white"/>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold">รากฐานทางการศึกษา<br/>และวิสัยทัศน์</h3>
                </div>
                
                <div className="relative z-10 w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="border-l border-white/20 pl-6">
                        <p className="text-[#E60000] text-xs font-bold uppercase tracking-widest mb-1">Economics</p>
                        <h5 className="font-bold">University of Victoria, Canada</h5>
                        <p className="text-xs text-slate-400 font-light italic mt-1">Bachelor of Arts</p>
                    </div>
                    <div className="border-l border-white/20 pl-6">
                        <p className="text-[#E60000] text-xs font-bold uppercase tracking-widest mb-1">Managerial Economics</p>
                        <h5 className="font-bold">จุฬาลงกรณ์มหาวิทยาลัย</h5>
                        <p className="text-xs text-slate-400 font-light italic mt-1">Master of Arts</p>
                    </div>
                    <div className="border-l border-white/20 pl-6">
                        <p className="text-[#E60000] text-xs font-bold uppercase tracking-widest mb-1">Executive Leadership</p>
                        <h5 className="font-bold">วิทยาลัยป้องกันราชอาณาจักร (วปอ.)</h5>
                        <p className="text-xs text-slate-400 font-light italic mt-1">หลักสูตรผู้บริหารระดับสูง รุ่นที่ 1</p>
                    </div>
                </div>
            </div>
            
        </div>
      </section>

      {/* Work Log / Stories Grid */}
      <section id="stories" className="py-24 px-4 md:px-12 max-w-8xl mx-auto bg-[#F5F5F7] border-t border-slate-200">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900">Execution Log</h2>
            <div className="w-16 h-1 bg-[#E60000] mx-auto mt-6"></div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#E60000]" size={40} /></div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {stories.length > 0 ? (
                stories.map(s => <StoryCard key={s.id} story={s} />)
            ) : (
                <div className="col-span-full text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                    <p className="text-slate-500 font-light mb-4">ระบบกำลังรวบรวมบันทึกผลงาน...</p>
                </div>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#121212] text-white py-20 px-6 border-t-16 border-[#E60000]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-center md:text-left">
                <div className="text-4xl font-black tracking-tighter mb-4">RAVIT<span className="text-[#E60000]">.</span></div>
                <p className="text-slate-400 max-w-md text-sm leading-relaxed">
                    ยกระดับศักยภาพด้วยมุมมองของนักบริหาร ผสานนวัตกรรม ข้อมูลเชิงลึก และยุทธศาสตร์การทำงานที่มุ่งเน้นผลสัมฤทธิ์ที่เป็นรูปธรรม
                </p>
            </div>
            <div className="flex gap-4">
                <a href="https://www.facebook.com/profile.php?id=61554124575777" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E60000] hover:border-[#E60000] transition-all"><Facebook size={20}/></a>
                <a href="https://www.instagram.com/ravit.ss" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E60000] hover:border-[#E60000] transition-all"><Instagram size={20}/></a>
                <a href="https://www.tiktok.com/@ravitsodsong" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E60000] hover:border-[#E60000] transition-all">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                    </svg>
                </a>
            </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p className="uppercase tracking-widest font-light">© 2026 Ravit Sodsong. All Rights Reserved.</p>
            <div className="flex gap-4">
                <button 
                  onClick={() => setIsTermsOpen(true)} 
                  className="hover:text-white transition-colors cursor-pointer uppercase tracking-widest font-light"
                >
                    Terms of Use
                </button>
            </div>
        </div>
      </footer>

      {/* Terms of Use Modal (Popup) */}
      <AnimatePresence>
        {isTermsOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsTermsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-4xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 md:p-12 z-10"
            >
              <button
                onClick={() => setIsTermsOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-[#E60000] bg-slate-100 hover:bg-red-50 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-6">
                ข้อตกลงและเงื่อนไขการใช้งาน
              </h3>
              
              <div className="space-y-6 text-slate-600 text-sm leading-relaxed font-light">
                <section>
                  <h4 className="font-bold text-slate-900 text-base mb-2">1. วัตถุประสงค์ของเว็บไซต์</h4>
                  <p>เว็บไซต์นี้จัดทำขึ้นเพื่อนำเสนอข้อมูล ประวัติการทำงาน ผลงาน และวิสัยทัศน์เชิงยุทธศาสตร์ของ รวิศ สอดส่อง เพื่อเป็นช่องทางในการสื่อสารสาธารณะและแลกเปลี่ยนแนวคิดที่เป็นประโยชน์ต่อสังคม</p>
                </section>
                
                <section>
                  <h4 className="font-bold text-slate-900 text-base mb-2">2. ทรัพย์สินทางปัญญา (Intellectual Property)</h4>
                  <p>ข้อความ บทความ รูปภาพ กราฟิก และข้อมูลทั้งหมดที่ปรากฏบนเว็บไซต์นี้ (เว้นแต่จะระบุไว้เป็นอย่างอื่น) ถือเป็นลิขสิทธิ์และทรัพย์สินทางปัญญาของเจ้าของเว็บไซต์ ห้ามมิให้ผู้ใดทำซ้ำ ดัดแปลง เผยแพร่ หรือนำไปใช้เพื่อแสวงหาผลกำไรทางการค้าโดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร</p>
                </section>
                
                <section>
                  <h4 className="font-bold text-slate-900 text-base mb-2">3. ความถูกต้องของข้อมูล (Disclaimer)</h4>
                  <p>แม้เราจะพยายามอย่างเต็มที่ในการรวบรวมและนำเสนอข้อมูลที่ถูกต้อง ทันสมัย และเชื่อถือได้ แต่เราไม่อาจรับประกันความครบถ้วนสมบูรณ์ของข้อมูลในทุกกรณี ข้อมูลหรือบทวิเคราะห์บนเว็บไซต์อาจมีการเปลี่ยนแปลง อัปเดต หรือปรับปรุงได้ตลอดเวลาโดยไม่ต้องแจ้งให้ทราบล่วงหน้า</p>
                </section>

                <section>
                  <h4 className="font-bold text-slate-900 text-base mb-2">4. การเชื่อมโยงไปยังเว็บไซต์ภายนอก (Third-Party Links)</h4>
                  <p>เว็บไซต์นี้อาจมีลิงก์เชื่อมโยงไปยังแพลตฟอร์มหรือเว็บไซต์ของบุคคลที่สามเพื่ออำนวยความสะดวกแก่ผู้ใช้งาน เราไม่มีส่วนรับผิดชอบต่อความถูกต้องของเนื้อหา แนวทางปฏิบัติ หรือนโยบายความเป็นส่วนตัวของเว็บไซต์เหล่านั้น</p>
                </section>
                
                <div className="pt-6 border-t border-slate-100 mt-8">
                  <p className="text-xs text-slate-400">อัปเดตล่าสุด: กุมภาพันธ์ 2569</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}