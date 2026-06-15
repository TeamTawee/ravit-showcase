"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Loader2, Facebook, Instagram, Send, Menu, ArrowRight, 
  Target, Lightbulb, BarChart3, 
  Briefcase, Globe, Database, GraduationCap, TrendingUp, Cpu,
  Award, MapPin, Phone, Mail, MessageCircle, Calendar
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Kanit, Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const kanit = Kanit({ subsets: ["thai", "latin"], weight: ["300", "400", "500", "600", "700"], display: "swap" });

// ส่วนแสดงผล Card ข่าวสาร/กิจกรรม
const StoryCard = ({ story }) => (
  <Link href={`/story/${story.slug || story.id}`} className="block">
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
          <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-2 py-1 bg-[#E60000] text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-sm">
                {story.category}
              </span>
              <span className="text-[10px] text-slate-300 font-medium flex items-center gap-1 drop-shadow-md">
                  <Calendar size={10}/>
                  {story.storyDate 
                      ? new Date(story.storyDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) 
                      : (story.createdAt?.toDate ? new Date(story.createdAt.toDate()).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '')
                  }
              </span>
          </div>
          {/* เอาการแสดงผลชื่อหัวข้อ (Title) ออกจากหน้า Showcase */}
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
  const [activeTab, setActiveTab] = useState('experiences');

  useEffect(() => {
    const fetchStories = async () => {
      try {
        // 🟢 เปลี่ยนมาเรียงตาม storyDate แบบ desc (ใหม่ไปเก่า)
        const q = query(collection(db, "projects"), orderBy("storyDate", "desc"));
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
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-white border-b border-slate-100">
        <div className="font-black text-2xl tracking-tighter cursor-pointer" onClick={() => window.scrollTo({top: 0})}>
            RAVIT<span className="text-[#E60000]">.</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest items-center">
          <a href="#home" className="hover:text-[#E60000] transition-colors">Intro</a>
          <a href="#expertise" className="hover:text-[#E60000] transition-colors">Core Expertise</a>
          <a href="#Profile" className="hover:text-[#E60000] transition-colors">Professional Profile</a>
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
                        className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl md:hidden rounded-b-3xl p-6 flex flex-col gap-4 z-10"
                    >
                        <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Intro</a>
                        <a href="#expertise" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Core Expertise</a>
                        <a href="#Profile" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Professional Profile</a>
                        <a href="#stories" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Execution Log</a>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <header id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-x-clip bg-white">
        <div className="absolute top-20 md:top-40 left-0 md:left-10 w-full text-center md:text-left text-[12vw] font-black text-slate-50 opacity-[0.08] select-none leading-none z-0 pointer-events-none">
            EXECUTION
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-6 lg:gap-12 relative z-10">
            
            <div className="w-full md:w-3/5 lg:w-1/2 text-left order-1 z-20">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <span className="inline-block px-3 py-1 bg-slate-900 text-white text-[10px] font-bold tracking-[0.3em] uppercase rounded-full mb-6">
                        Public Policy Expert
                    </span>
                    <h1 className="text-6xl md:text-6xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[1.05] mb-6">
                        RAVIT<br/><span className="text-[#E60000]">SODSONG.</span>
                    </h1>
                    
                    <div className="text-xl md:text-2xl text-slate-600 font-medium max-w-xl ml-0 leading-relaxed mb-8">
                        <strong className="text-slate-900">รวิศ</strong> (วิน) <strong className="text-[#E60000]">สอดส่อง</strong>
                        
                        <div className="text-[15px] md:text-base lg:text-lg font-light mt-4 leading-snug md:leading-relaxed text-slate-500 border-l-4 border-[#E60000] pl-4 text-left">
                            <span className="block mb-2">
                                นักบริหารและผู้เชี่ยวชาญด้านนโยบายสาธารณะ มีประสบการณ์รอบด้านทั้งงานประสานส่วนราชการ งานนิติบัญญัติ และการบริหารธุรกิจระหว่างประเทศกว่า 10 ปี
                            </span>
                            <span className="block">
                                โดยเฉพาะด้านการวางกลยุทธ์มหภาค การวิเคราะห์นโยบายเชิงลึก และในการประสานยุทธศาสตร์ร่วมกับองค์กรภาครัฐและต่างประเทศเพื่อบรรลุเป้าหมายเชิงนโยบายระดับชาติ
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 items-center">
                        <a href="#Profile" className="inline-flex px-8 py-4 rounded-full bg-[#121212] text-white font-bold text-sm hover:bg-[#E60000] transition-all items-center gap-2 group shadow-xl hover:shadow-[#E60000]/20">
                            Professional Profile<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                        </a>
                    </div>
                </motion.div>
            </div>
            
            <div className="w-full md:w-2/5 lg:w-1/2 flex justify-center md:justify-end items-end relative order-2 mt-12 md:mt-0 z-10">
                <div className="relative w-full max-w-87.5 sm:max-w-87.5 md:max-w-85 lg:max-w-105 xl:max-w-115 aspect-3/4 mx-auto md:ml-auto md:mr-0">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="absolute bottom-0 left-0 w-full h-[75%] bg-linear-to-tr from-slate-200 to-slate-50 rounded-[40px] shadow-2xl z-0"
                    />
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
                                className="object-contain object-bottom scale-[1.05] origin-bottom drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)]"
                                priority 
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
            
        </div>
      </header>

      {/* Core Expertise Section (แทนที่ Core Values เดิมด้วยข้อมูลจาก Resume) */}
      <section id="expertise" className="-mt-15 md:-mt-15 py-24 bg-[#121212] text-white relative z-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 md:text-center max-w-3xl mx-auto">
                <span className="text-[#E60000] font-bold tracking-[0.3em] uppercase text-xs">Core Expertise</span>
                <h2 className="text-3xl md:text-5xl font-black mt-2">ความเชี่ยวชาญหลัก</h2>
                <p className="text-slate-400 mt-4 font-light text-lg">จากประสบการณ์กว่า 10 ปีในส่วนราชการ งานนิติบัญญัติ และการบริหารธุรกิจระหว่างประเทศ</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-[#E60000]/50 transition-all group">
                    <Globe className="text-[#E60000] mb-6" size={32}/>
                    <h3 className="text-xl font-bold mb-3">International Business</h3>
                    <p className="text-slate-400 font-light text-sm leading-relaxed">การบริหารธุรกิจระหว่างประเทศ สร้างเครือข่ายและเจรจากับหน่วยงานเอกชนและรัฐในระดับสากล</p>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-[#E60000]/50 transition-all group">
                    <Target className="text-[#E60000] mb-6" size={32}/>
                    <h3 className="text-xl font-bold mb-3">Macro Strategy</h3>
                    <p className="text-slate-400 font-light text-sm leading-relaxed">การวางกลยุทธ์มหภาค เพื่อกำหนดทิศทางขององค์กรและนโยบายระดับชาติให้สอดคล้องกับเป้าหมาย</p>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-[#E60000]/50 transition-all group">
                    <BarChart3 className="text-[#E60000] mb-6" size={32}/>
                    <h3 className="text-xl font-bold mb-3">Policy Analysis</h3>
                    <p className="text-slate-400 font-light text-sm leading-relaxed">การวิเคราะห์นโยบายเชิงลึก โดยใช้หลักเศรษฐศาสตร์เพื่อประเมินและกลั่นกรองข้อเสนอแนะเชิงยุทธศาสตร์</p>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-[#E60000]/50 transition-all group">
                    <Briefcase className="text-[#E60000] mb-6" size={32}/>
                    <h3 className="text-xl font-bold mb-3">Strategic Coordination</h3>
                    <p className="text-slate-400 font-light text-sm leading-relaxed">การประสานยุทธศาสตร์ร่วมกับองค์กรภาครัฐและต่างประเทศ เพื่อบรรลุเป้าหมายเชิงนโยบายระดับชาติ</p>
                </div>
            </div>
        </div>
      </section>

      {/* Professional Profile Section (Interactive Tabs) */}
      <section id="Profile" className="py-24 px-6 md:px-12 bg-slate-50 relative overflow-hidden scroll-mt-20">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#121212 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-12">
                <span className="text-[#E60000] font-bold tracking-[0.3em] uppercase text-xs">Professional Profile</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mt-2">การทำงานและการศึกษา</h2>
                <div className="w-16 h-1 bg-[#E60000] mx-auto mt-6"></div>
            </div>

            {/* 🎛 Interactive Tabs Navigation */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                <button onClick={() => setActiveTab('experiences')} className={`px-6 py-3.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'experiences' ? 'bg-[#E60000] text-white shadow-xl shadow-red-500/20 scale-105' : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 shadow-sm border border-slate-200'}`}>
                    <Briefcase size={16} /> ประวัติการทำงาน
                </button>
                <button onClick={() => setActiveTab('education')} className={`px-6 py-3.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'education' ? 'bg-[#E60000] text-white shadow-xl shadow-red-500/20 scale-105' : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 shadow-sm border border-slate-200'}`}>
                    <GraduationCap size={16} /> การศึกษา
                </button>
                <button onClick={() => setActiveTab('training')} className={`px-6 py-3.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'training' ? 'bg-[#E60000] text-white shadow-xl shadow-red-500/20 scale-105' : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 shadow-sm border border-slate-200'}`}>
                    <Award size={16} /> การฝึกอบรม
                </button>
            </div>

            {/* 📦 Tab Content Area */}
            <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                    
                    {/* --- TAB 1: ประวัติการทำงาน --- */}
                    {activeTab === 'experiences' && (
                        <motion.div key="exp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                            
                            {/* Card 1 */}
                            <div className="relative bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#E60000]/30 transition-all overflow-hidden group">
                                <div className="absolute -bottom-6 -right-2 text-[100px] font-black text-slate-50 z-0 select-none group-hover:scale-110 group-hover:text-red-50/50 transition-all duration-500 leading-none pointer-events-none">2025</div>
                                <div className="relative z-10 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <span className="inline-block px-3 py-1 bg-red-50 text-[#E60000] text-xs font-bold rounded-full mb-3">2015 - 2025</span>
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">กรรมการผู้จัดการ</h4>
                                        <p className="text-sm font-medium text-slate-500 mb-3">บริษัท วิน ฟู้ด อินดัสตรี คอร์ปอเรชั่น จำกัด และบริษัทในเครือ</p>
                                        <p className="text-sm text-slate-600 font-light leading-relaxed">บริหารการค้าระหว่างประเทศและการขับเคลื่อนองค์กรในอุตสาหกรรมอาหาร วางกลยุทธ์และคัดสรรผลิตภัณฑ์อาหารจากต่างประเทศ ตลอดจนควบคุมดูแลการเจรจาเชิงกลยุทธ์กับหน่วยงานเอกชนและหน่วยงานของรัฐทั้งในและต่างประเทศ</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="relative bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#E60000]/30 transition-all overflow-hidden group">
                                <div className="absolute -bottom-6 -right-2 text-[100px] font-black text-slate-50 z-0 select-none group-hover:scale-110 group-hover:text-red-50/50 transition-all duration-500 leading-none pointer-events-none">2025</div>
                                <div className="relative z-10 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <span className="inline-block px-3 py-1 bg-red-50 text-[#E60000] text-xs font-bold rounded-full mb-3">2025 - 2025</span>
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">โฆษกและกรรมาธิการวิสามัญ</h4>
                                        <p className="text-sm font-medium text-slate-500 mb-3">คณะกรรมาธิการวิสามัญพิจารณาร่างพระราชบัญญัติงบประมาณรายจ่ายประจำปี พ.ศ. 2569</p>
                                        <p className="text-sm text-slate-600 font-light leading-relaxed">พิจารณากลั่นกรองงบประมาณรายจ่ายของกระทรวง ส่วนราชการ และรัฐวิสาหกิจ รวมทั้งแถลงผลการดำเนินงาน ชี้แจงประเด็นข้อซักถาม และสื่อสารสาระสำคัญของร่างพระราชบัญญัติงบประมาณฯ ต่อสื่อมวลชนและสาธารณชน</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="relative bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#E60000]/30 transition-all overflow-hidden group">
                                <div className="absolute -bottom-6 -right-2 text-[100px] font-black text-slate-50 z-0 select-none group-hover:scale-110 group-hover:text-red-50/50 transition-all duration-500 leading-none pointer-events-none">2025</div>
                                <div className="relative z-10 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <span className="inline-block px-3 py-1 bg-red-50 text-[#E60000] text-xs font-bold rounded-full mb-3">2024 - 2025</span>
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">หัวหน้าคณะทำงาน</h4>
                                        <p className="text-sm font-medium text-slate-500 mb-3">คณะทำงานรัฐมนตรีว่าการกระทรวงยุติธรรม</p>
                                        <p className="text-sm text-slate-600 font-light leading-relaxed">สนับสนุนและขับเคลื่อนภารกิจตามนโยบายฯ รวมทั้งประสานงานกับหน่วยงานทั้งในและต่างประเทศ เพื่อขับเคลื่อนยุทธศาสตร์ของรัฐมนตรีว่าการกระทรวงยุติธรรม</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4 */}
                            <div className="relative bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#E60000]/30 transition-all overflow-hidden group">
                                <div className="absolute -bottom-6 -right-2 text-[100px] font-black text-slate-50 z-0 select-none group-hover:scale-110 group-hover:text-red-50/50 transition-all duration-500 leading-none pointer-events-none">2025</div>
                                <div className="relative z-10 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <span className="inline-block px-3 py-1 bg-red-50 text-[#E60000] text-xs font-bold rounded-full mb-3">2024 - 2025</span>
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">รองประธานอนุกรรมาธิการ</h4>
                                        <p className="text-sm font-medium text-slate-500 mb-3">คณะอนุกรรมาธิการศึกษาราคาพลังงานและเพิ่มขีดความสามารถในการแข่งขันด้านพลังงาน</p>
                                        <p className="text-sm text-slate-600 font-light leading-relaxed">ศึกษาโครงสร้างราคาพลังงาน ตลอดจนการวางแนวทางเชิงนโยบายเพื่อส่งเสริมขีดความสามารถในการแข่งขันด้านพลังงานของประเทศ เพื่อจัดทำข้อเสนอแนะเชิงยุทธศาสตร์</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 5 */}
                            <div className="relative bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#E60000]/30 transition-all overflow-hidden group">
                                <div className="absolute -bottom-6 -right-2 text-[100px] font-black text-slate-50 z-0 select-none group-hover:scale-110 group-hover:text-red-50/50 transition-all duration-500 leading-none pointer-events-none">2023</div>
                                <div className="relative z-10 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <span className="inline-block px-3 py-1 bg-red-50 text-[#E60000] text-xs font-bold rounded-full mb-3">2022 - 2023</span>
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">กรรมาธิการวิสามัญ</h4>
                                        <p className="text-sm font-medium text-slate-500 mb-3">คณะกรรมาธิการวิสามัญพิจารณาร่างพระราชบัญญัติอาหาร (ฉบับที่..) พ.ศ. …</p>
                                        <p className="text-sm text-slate-600 font-light leading-relaxed">พิจารณากลั่นกรองร่างพระราชบัญญัติอาหารเพื่อยกระดับมาตรฐานคุณภาพและความปลอดภัยของผลิตภัณฑ์อาหารสู่ระดับสากล พร้อมทั้งประสานความร่วมมือเชิงนโยบายและระดมความคิดเห็นร่วมกับภาครัฐ ผู้เชี่ยวชาญ และภาคเอกชน เพื่อนำเสนอต่อรัฐสภา</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 6 */}
                            <div className="relative bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#E60000]/30 transition-all overflow-hidden group">
                                <div className="absolute -bottom-6 -right-2 text-[100px] font-black text-slate-50 z-0 select-none group-hover:scale-110 group-hover:text-red-50/50 transition-all duration-500 leading-none pointer-events-none">2015</div>
                                <div className="relative z-10 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <span className="inline-block px-3 py-1 bg-red-50 text-[#E60000] text-xs font-bold rounded-full mb-3">2012 - 2015</span>
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">พนักงานปฎิบัติการ (ระดับกลาง)</h4>
                                        <p className="text-sm font-medium text-slate-500 mb-3">สำนักงานคณะกรรมการกิจการกระจายเสียง กิจการโทรทัศน์ และกิจการโทรคมนาคมแห่งชาติ</p>
                                        <div className="text-sm text-slate-600 font-light leading-relaxed">
                                            <p className="mb-2">ปฎิบัติงานประจำกองทุนวิจัยและพัฒนากิจการกระจายเสียง กิจการโทรทัศน์ และกิจการโทรคมนาคมแห่งชาติ (กทปส.) และปฎิบัติงานตามที่ได้รับมอบหมาย อาทิ</p>
                                            <ul className="list-disc pl-5 space-y-1.5 marker:text-slate-400">
                                                <li>ผู้ช่วยเลขานุการคณะอนุกรรมการพิจารณาศึกษาแนวทางการสนับสนุนให้ประชาชนได้รับชมฟุตบอลโลกรอบสุดท้ายปี 2014 และคณะทำงานฯ</li>
                                                <li>ผู้ช่วยเลขานุการคณะอนุกรรมการขับเคลื่อนโยบายและแผนยุทธศาสตร์กองทุนฯ และคณะทำงานฯ</li>
                                                <li>ฝ่ายเลขานุการคณะอนุกรรมการบริหารและติดตามประเมินผลโครงการกองทุนฯ และคณะทำงานฯ</li>
                                                <li>ฝ่ายเลขานุการคณะอนุกรรมการนโยบายและยุทธศาสตร์การบริหารกองทุน</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 7 */}
                            <div className="relative bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#E60000]/30 transition-all overflow-hidden group">
                                <div className="absolute -bottom-6 -right-2 text-[100px] font-black text-slate-50 z-0 select-none group-hover:scale-110 group-hover:text-red-50/50 transition-all duration-500 leading-none pointer-events-none">2011</div>
                                <div className="relative z-10 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <span className="inline-block px-3 py-1 bg-red-50 text-[#E60000] text-xs font-bold rounded-full mb-3">2010 - 2011</span>
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">ผู้ช่วยเลขานุการ ประจำกรรมการกิจการโทรคมนาคมแห่งชาติ</h4>
                                        <p className="text-sm font-medium text-slate-500 mb-3">สำนักงานคณะกรรมการโทรคมนาคมแห่งชาติ</p>
                                        <p className="text-sm text-slate-600 font-light leading-relaxed">สนับสนุนงานภารกิจกรรมการฯ อาทิ การกลั่นกรองข้อมูล ประสานงาน ติดตามข้อสั่งการ หรือตามที่ได้รับมอบหมาย</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- TAB 2: การศึกษา --- */}
                    {activeTab === 'education' && (
                        <motion.div key="edu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                            
                            {/* Edu 1 */}
                            <div className="relative bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#E60000]/30 transition-all overflow-hidden group">
                                <div className="absolute -bottom-6 -right-2 text-[100px] font-black text-slate-50 z-0 select-none group-hover:scale-110 group-hover:text-red-50/50 transition-all duration-500 leading-none pointer-events-none">2012</div>
                                <div className="relative z-10 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <span className="inline-block px-3 py-1 bg-red-50 text-[#E60000] text-xs font-bold rounded-full mb-3">2011 - 2012</span>
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">ปริญญาโท: ศิลปศาสตรมหาบัณฑิต สาขาเศรษฐศาสตร์ธุรกิจและการจัดการ</h4>
                                        <p className="text-sm font-medium text-slate-500">จุฬาลงกรณ์มหาวิทยาลัย (Chulalongkorn University), กรุงเทพฯ, ประเทศไทย</p>
                                    </div>
                                </div>
                            </div>

                            {/* Edu 2 */}
                            <div className="relative bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#E60000]/30 transition-all overflow-hidden group">
                                <div className="absolute -bottom-6 -right-2 text-[100px] font-black text-slate-50 z-0 select-none group-hover:scale-110 group-hover:text-red-50/50 transition-all duration-500 leading-none pointer-events-none">2009</div>
                                <div className="relative z-10 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <span className="inline-block px-3 py-1 bg-red-50 text-[#E60000] text-xs font-bold rounded-full mb-3">2006 - 2009</span>
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">ปริญญาตรี: Bachelor of Arts in Economics</h4>
                                        <p className="text-sm font-medium text-slate-500">University of Victoria, Victoria, British Columbia, Canada</p>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    )}

                    {/* --- TAB 3: การฝึกอบรม --- */}
                    {activeTab === 'training' && (
                        <motion.div key="train" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                            
                            {/* Train 1 */}
                            <div className="relative bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#E60000]/30 transition-all overflow-hidden group">
                                <div className="absolute -bottom-6 -right-2 text-[100px] font-black text-slate-50 z-0 select-none group-hover:scale-110 group-hover:text-red-50/50 transition-all duration-500 leading-none pointer-events-none">2026</div>
                                <div className="relative z-10 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <span className="inline-block px-3 py-1 bg-red-50 text-[#E60000] text-xs font-bold rounded-full mb-3">2026</span>
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">งานสัมมนาระดับผู้นำนโยบายสาธารณะ ด้านการค้าการลงทุนและการระงับข้อพิพาททางเลือก</h4>
                                        <p className="text-sm font-medium text-slate-500">สถาบันอนุญาโตตุลาการ กระทรวงยุติธรรม (Thailand Arbitration Center), กรุงเทพฯ, ประเทศไทย</p>
                                    </div>
                                </div>
                            </div>

                            {/* Train 2 */}
                            <div className="relative bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#E60000]/30 transition-all overflow-hidden group">
                                <div className="absolute -bottom-6 -right-2 text-[100px] font-black text-slate-50 z-0 select-none group-hover:scale-110 group-hover:text-red-50/50 transition-all duration-500 leading-none pointer-events-none">2025</div>
                                <div className="relative z-10 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <span className="inline-block px-3 py-1 bg-red-50 text-[#E60000] text-xs font-bold rounded-full mb-3">2025</span>
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">DongFang Program</h4>
                                        <p className="text-sm font-medium text-slate-500">Peking University, Beijing, People's Republic of China</p>
                                    </div>
                                </div>
                            </div>

                            {/* Train 3 */}
                            <div className="relative bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#E60000]/30 transition-all overflow-hidden group">
                                <div className="absolute -bottom-6 -right-2 text-[100px] font-black text-slate-50 z-0 select-none group-hover:scale-110 group-hover:text-red-50/50 transition-all duration-500 leading-none pointer-events-none">2024</div>
                                <div className="relative z-10 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <span className="inline-block px-3 py-1 bg-red-50 text-[#E60000] text-xs font-bold rounded-full mb-3">2024</span>
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">หลักสูตรการป้องกันราชอาณาจักร สำหรับผู้บริหารแห่งอนาคต (วปอ.บอ.) รุ่นที่ 1</h4>
                                        <p className="text-sm font-medium text-slate-500">สถาบันวิชาการป้องกันประเทศ (National Defence College), กรุงเทพฯ, ประเทศไทย</p>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
      </section>

      {/* Work Log / Stories Grid (Execution Log) */}
      <section id="stories" className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full scroll-mt-20">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900">Execution Log</h2>
            <div className="w-16 h-1 bg-[#E60000] mx-auto mt-6"></div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#E60000]" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.length > 0 ? (
                stories.map(s => <StoryCard key={s.id} story={s} />)
            ) : (
                <div className="col-span-full text-center py-24 bg-[#F5F5F7] rounded-3xl border border-dashed border-slate-300">
                    <p className="text-slate-500 font-light mb-4">ระบบกำลังรวบรวมบันทึกผลงาน...</p>
                </div>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#121212] text-white py-20 px-6 border-t-16 border-[#E60000]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start border-b border-white/10 pb-12">
            
            {/* Column 1: Logo & Vision Text */}
            <div className="md:col-span-5 text-left">
                <div className="text-4xl font-black tracking-tighter mb-4">RAVIT<span className="text-[#E60000]">.</span></div>
                <p className="text-slate-400 max-w-md text-sm leading-relaxed font-light">
                    มุ่งมั่นขับเคลื่อนนโยบายสาธารณะและยุทธศาสตร์ระดับชาติ ด้วยวิสัยทัศน์ที่กว้างไกลและประสบการณ์บริหารระดับสากล เพื่อผลลัพธ์ที่เป็นรูปธรรมและการเติบโตอย่างยั่งยืน
                </p>
            </div>

            {/* Column 2: Contact Info */}
            <div className="md:col-span-4 text-left">
                <h4 className="text-lg font-bold mb-6 flex items-center justify-start gap-2">
                    <MapPin className="text-[#E60000]" size={20} /> ช่องทางการติดต่อ
                </h4>
                <div className="space-y-4 text-sm text-slate-300 font-light">
                    <p className="flex items-center justify-start gap-3">
                        <Phone size={16} className="text-[#E60000]" /> 098-249-9999
                    </p>
                    <p className="flex items-center justify-start gap-3">
                        <Mail size={16} className="text-[#E60000]" /> ravit@sodsong.com
                    </p>
                    <p className="flex items-center justify-start gap-3">
                        <MessageCircle size={16} className="text-[#E60000]" /> Line ID: wiinns
                    </p>
                    <p className="flex items-start justify-start gap-3 mt-2">
                        <MapPin size={16} className="text-[#E60000] shrink-0 mt-1" /> 
                        <span className="leading-relaxed text-left">9 ถ.เฉลิมพระเกียรติ ร.9 ซ.48 แยก 15<br/>แขวงดอกไม้ เขตประเวศ กรุงเทพมหานคร 10250</span>
                    </p>
                </div>
            </div>

            {/* Column 3: Social Media (ยกเว้น ยังคงจัดกลางบนมือถือ) */}
            <div className="md:col-span-3 flex flex-col items-center md:items-start lg:items-end">
                <h4 className="text-lg font-bold mb-6 text-center md:text-left lg:text-right w-full">ติดตามความเคลื่อนไหว</h4>
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

        </div>
        
        {/* Bottom Bar (ยกเว้น ยังคงจัดตามเดิม) */}
        <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
              className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 md:p-12 z-10"
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