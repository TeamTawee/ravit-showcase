"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase"; 
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Facebook, Instagram, Send, Menu, ArrowRight, Zap, Users, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// 1. Import Inter (อังกฤษ) และ Kanit (ไทย)
import { Kanit, Inter } from "next/font/google";

// 2. ตั้งค่า Font
const inter = Inter({ 
  subsets: ["latin"], 
  display: "swap" 
});

const kanit = Kanit({ 
  subsets: ["thai", "latin"], 
  weight: ["300", "400", "500", "600", "700"], 
  display: "swap" 
});

const StoryCard = ({ story }) => (
  <Link href={`/story/${story.slug || story.id}`} className="block break-inside-avoid mb-6">
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 group relative"
    >
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute inset-0">
          <Image src={story.image || "https://via.placeholder.com/400"} alt={story.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
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
    // 3. ใช้ style fontFamily เพื่อบังคับลำดับ: Inter (อังกฤษ) -> Kanit (ไทย)
    <div 
      className="min-h-screen bg-[#F5F5F7] text-[#121212]"
      style={{ fontFamily: `${inter.style.fontFamily}, ${kanit.style.fontFamily}, sans-serif` }}
    >
      
      <nav className="fixed top-0 left-0 right-0 z-100 p-6 flex justify-between items-center bg-white/80 backdrop-blur-md">
        <div className="font-black text-2xl tracking-tighter cursor-pointer" onClick={() => window.scrollTo({top: 0})}>
            RAVIT<span className="text-[#E60000]">.</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest items-center">
          <a href="#home" className="hover:text-[#E60000] transition-colors">Home</a>
          <a href="#vision" className="hover:text-[#E60000] transition-colors">Vision</a>
          <a href="#bio" className="hover:text-[#E60000] transition-colors">About</a>
        </div>

        <button className="md:hidden p-2 text-slate-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>

        <AnimatePresence>
    {isMenuOpen && (
        <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            // 👇 จุดแก้ความสวยอยู่ตรงนี้ครับ
            className="absolute top-full left-0 right-0 
                       bg-linear-to-b from-white/80 to-white/60 
                       backdrop-blur-2xl backdrop-saturate-150
                       border-b border-white/10 
                       shadow-xl md:hidden 
                       rounded-b-3xl p-6 flex flex-col gap-4"
        >
            <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Home</a>
            <a href="#vision" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Vision</a>
            <a href="#bio" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">About</a>
        </motion.div>
    )}
</AnimatePresence>
      </nav>

      {/* Hero Section */}
      <header id="home" className="relative pt-32 md:pt-48 pb-10 md:pb-20 px-6 overflow-hidden bg-white">
        <div className="absolute top-20 md:top-40 left-0 md:left-10 w-full text-center md:text-left text-[15vw] font-black text-slate-50 opacity-[0.03] select-none leading-none z-0 pointer-events-none">
            RAVIT SODSONG
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="w-full md:flex-1 text-center md:text-left order-1">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <span className="inline-block px-3 py-1 bg-[#E60000] text-white text-[10px] font-bold tracking-[0.3em] uppercase rounded-full mb-6 shadow-xl shadow-red-500/20">
                        Pheu Thai Party
                    </span>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tight leading-none mb-8">
                        RAVIT<br/><span className="text-[#E60000]">SODSONG.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-xl mx-auto md:mx-0 leading-relaxed">
                        เชื่อมต่อคนรุ่นใหม่<br/>ขับเคลื่อนไทยด้วยเทคโนโลยี
                    </p>
                </motion.div>
            </div>
            
            <div className="w-full md:flex-1 flex justify-center items-end relative h-100 md:h-150 max-w-md mx-auto order-2 mt-8 md:mt-0">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
                    className="absolute bottom-0 w-[95%] h-[80%] bg-linear-to-tr from-slate-50 to-slate-100 rounded-[40px] md:rounded-[60px] border-4 border-white shadow-2xl z-0"
                />
                <motion.div 
                    initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="relative w-full h-full z-10 flex justify-center items-end"
                >
                    <div className="relative w-[95%] h-full rounded-b-[36px] md:rounded-b-[56px] overflow-hidden flex items-end justify-center">
                        <Image 
                            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi4vCdqBt6QZT0OU6mh1hCH3LRHSKy4eoRqVKbee0JbRzHxWJ3AO84HsEDpA8SSHljW4jzVgpuc453DkhJxb6rsf89eGTL6HViFuqXLaFO0MWO8VAnWxr5kBWL7csqRWa_HAELgv2HxFjYcrzHUcJSAdWskVK6Nfwwq5eWi_C_FIlWojve8moiMWvTArwz6/s0/photo%20win.png" 
                            alt="Ravit" fill className="object-contain object-bottom scale-105" priority 
                        />
                    </div>
                </motion.div>
            </div>
        </div>
      </header>

      {/* Vision Section */}
      <section id="vision" className="py-20 bg-[#121212] text-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                    <Zap className="text-[#E60000] mb-4" size={40}/>
                    <h3 className="text-xl font-bold mb-2">Digital Transformation</h3>
                    <p className="text-slate-400 font-light text-sm">เปลี่ยนรัฐบาลให้ทันสมัย ลดขั้นตอนเอกสาร ด้วยเทคโนโลยี Blockchain และ AI</p>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                    <Users className="text-[#E60000] mb-4" size={40}/>
                    <h3 className="text-xl font-bold mb-2">New Gen Power</h3>
                    <p className="text-slate-400 font-light text-sm">สร้างพื้นที่ให้คนรุ่นใหม่มีส่วนร่วมในการออกแบบนโยบายและทิศทางประเทศ</p>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                    <Globe className="text-[#E60000] mb-4" size={40}/>
                    <h3 className="text-xl font-bold mb-2">Global Connectivity</h3>
                    <p className="text-slate-400 font-light text-sm">เชื่อมไทยสู่โลก สร้างโอกาสทางเศรษฐกิจไร้พรมแดนให้กับผู้ประกอบการรายย่อย</p>
                </div>
            </div>
        </div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
            <div className="w-full md:w-5/12 space-y-8">
                <div>
                    <span className="text-[#E60000] font-bold tracking-[0.3em] uppercase text-xs">Who I Am</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mt-2">รวิศ สอดส่อง</h2>
                </div>
                <p className="text-lg text-slate-600 font-light leading-relaxed">
                    "ผมเชื่อว่าเทคโนโลยีไม่ใช่แค่เครื่องมือ แต่คือโอกาสในการสร้างความเสมอภาค" <br/><br/>
                    จากประสบการณ์การทำงานด้านบริหารและนวัตกรรม ผมพร้อมที่จะนำแนวคิดใหม่ๆ มาปรับใช้กับการเมืองไทย เพื่อสร้างสังคมที่ทุกคนมีสิทธิ์ มีเสียง และมีโอกาสเท่าเทียมกัน
                </p>
                <div className="flex gap-4">
                     <a href="#stories" className="px-6 py-3 rounded-full bg-[#121212] text-white font-bold text-sm hover:bg-[#E60000] transition-all flex items-center gap-2">
                        ดูผลงานล่าสุด <ArrowRight size={16}/>
                     </a>
                </div>
            </div>
            <div className="w-full md:w-7/12 relative pl-8 md:pl-16 border-l-2 border-slate-100">
                <div className="space-y-12">
                    <div className="relative">
                        <div className="absolute -left-10.25 md:-left-18.25 top-1 w-5 h-5 bg-[#E60000] rounded-full ring-4 ring-white"></div>
                        <h3 className="text-xl font-bold text-slate-900">ผู้สมัคร สส. บัญชีรายชื่อ</h3>
                        <p className="text-[#E60000] text-xs font-bold uppercase tracking-wider mb-2">พรรคเพื่อไทย • ปัจจุบัน</p>
                        <p className="text-slate-500 text-sm">มุ่งมั่นขับเคลื่อนนโยบายดิจิทัลเพื่อเศรษฐกิจและสังคม</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-10.25 md:-left-18.25 top-1 w-5 h-5 bg-slate-200 rounded-full ring-4 ring-white"></div>
                        <h3 className="text-xl font-bold text-slate-900">นักบริหารจัดการนวัตกรรม</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">ภาคเอกชน • 2020 - 2024</p>
                        <p className="text-slate-500 text-sm">ที่ปรึกษาด้าน Digital Transformation ให้กับองค์กรชั้นนำ</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-10.25 md:-left-18.25 top-1 w-5 h-5 bg-slate-200 rounded-full ring-4 ring-white"></div>
                        <h3 className="text-xl font-bold text-slate-900">การศึกษา</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">International Business Management</p>
                        <p className="text-slate-500 text-sm">ศึกษาดูงานด้าน Smart City และนโยบายสาธารณะในต่างประเทศ</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section id="stories" className="py-24 px-4 md:px-12 max-w-8xl mx-auto bg-[#F5F5F7]">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-none">The Movement</h2>
            <div className="w-12 h-1 bg-[#E60000] mx-auto mt-4"></div>
        </div>
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#E60000]" size={40} /></div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {stories.length > 0 ? (
                stories.map(s => <StoryCard key={s.id} story={s} />)
            ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 italic font-light">ยังไม่มีความเคลื่อนไหวในขณะนี้...</p>
                    <a href="/admin" className="text-xs font-bold text-[#E60000] mt-2 inline-block hover:underline">เพิ่มเนื้อหาแรก</a>
                </div>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#121212] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-center md:text-left">
                <div className="text-4xl font-black tracking-tighter mb-4">RAVIT<span className="text-[#E60000]">.</span></div>
                <p className="text-slate-500 max-w-xs text-sm">ออกแบบอนาคตประเทศไทย ด้วยพลังของคนรุ่นใหม่และเทคโนโลยีที่จับต้องได้จริง</p>
            </div>
            <div className="flex gap-6">
                <a href="#" className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center hover:bg-[#E60000] hover:border-[#E60000] hover:text-white text-slate-400 transition-all"><Facebook size={20}/></a>
                <a href="#" className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center hover:bg-[#E60000] hover:border-[#E60000] hover:text-white text-slate-400 transition-all"><Instagram size={20}/></a>
                <a href="#" className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center hover:bg-[#E60000] hover:border-[#E60000] hover:text-white text-slate-400 transition-all"><Send size={20}/></a>
            </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-900 text-center text-[10px] text-slate-600 uppercase tracking-[0.3em]">
            © 2026 Ravit Sodsong Official. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}