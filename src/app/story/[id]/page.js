"use client";
import { useEffect, useState, use } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Share2, User, Link as LinkIcon, Quote, Loader2, FileQuestion } from "lucide-react";
// 1. Import Inter และ Kanit
import { Kanit, Inter } from "next/font/google";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";

// 2. ตั้งค่า Font
const inter = Inter({ subsets: ["latin"], display: "swap" });
const kanit = Kanit({ subsets: ["thai", "latin"], weight: ["300", "400", "500", "600", "700"], display: "swap" });

// --- Content Block Renderer ---
const ContentBlock = ({ block }) => {
    const isQuote = block.textStyle === 'quote';
    
    const MediaSection = () => {
        if (block.mediaType === 'none' || !block.mediaSrc) return null;
        const isVideo = block.mediaType === 'video';
        return (
            <div className="w-full relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 mb-8 shadow-sm">
                <div className={`${isVideo ? 'aspect-video' : 'aspect-auto'}`}>
                    {isVideo ? (
                        <iframe src={block.mediaSrc.replace('watch?v=', 'embed/')} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
                    ) : (
                        <div className="relative w-full">
                            <img src={block.mediaSrc} alt="content" className="w-full h-auto object-cover" />
                        </div>
                    )}
                </div>
                {block.caption && (
                    <div className="bg-slate-100 text-slate-500 text-[10px] py-2 px-4 text-center font-medium tracking-wide border-t border-slate-200">
                        {block.caption}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="mb-12">
            {block.heading && (
                <h3 className={`text-2xl md:text-3xl font-bold text-slate-900 mb-6 ${isQuote ? 'text-center' : 'border-l-4 border-[#E60000] pl-4'}`}>
                    {block.heading}
                </h3>
            )}
            
            {block.layout === 'top' ? (
                <div className="flex flex-col gap-6">
                    <MediaSection />
                    <div className="prose prose-lg max-w-none text-slate-600 font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: block.content }} />
                </div>
            ) : (
                <div className={`flex flex-col md:flex-row gap-8 items-start ${block.layout === 'right' ? 'md:flex-row-reverse' : ''}`}>
                    {block.mediaSrc && (
                        <div className="w-full md:w-1/2">
                            <MediaSection />
                        </div>
                    )}
                    <div className={`w-full ${block.mediaSrc ? 'md:w-1/2' : ''}`}>
                        {isQuote ? (
                            <div className="py-12 px-8 bg-slate-50 rounded-3xl text-center relative border border-slate-200 shadow-inner">
                                <Quote className="absolute top-6 left-6 text-slate-300 transform scale-x-[-1]" size={48}/>
                                <div className="text-xl md:text-3xl font-serif italic text-slate-800 leading-relaxed relative z-10" dangerouslySetInnerHTML={{ __html: block.content }} />
                                <Quote className="absolute bottom-6 right-6 text-slate-300" size={48}/>
                            </div>
                        ) : (
                            <div className="prose prose-lg max-w-none text-slate-600 font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: block.content }} />
                        )}
                        {block.actionUrl && (
                            <a href={block.actionUrl} target="_blank" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[#121212] text-white rounded-full text-sm font-bold hover:bg-[#E60000] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                ไปที่ลิงก์ <LinkIcon size={16}/>
                            </a>
                        )}
                    </div>
                </div>
            )}
            
            {block.hasDivider && <div className="w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent mt-16"></div>}
        </div>
    );
};

export default function StoryDetail({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  const { scrollY } = useScroll();
  const blurY = useTransform(scrollY, [0, 500], [0, 100]); 

  useEffect(() => {
    if (!id) return;
    const fetchStory = async () => {
        try {
            let foundData = null;
            const q = query(collection(db, "projects"), where("slug", "==", id));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                foundData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
            } else {
                const docRef = doc(db, "projects", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) foundData = { id: docSnap.id, ...docSnap.data() };
            }
            if (foundData && foundData.published === false) setStory(null);
            else setStory(foundData);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchStory();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-slate-900" size={40}/></div>;
  if (!story) return <div className="min-h-screen flex flex-col items-center justify-center font-bold text-slate-400 gap-4"><FileQuestion size={48}/>Content not found.</div>;

  return (
    // 3. ใส่ style fontFamily ผสม Inter กับ Kanit
    <div 
        className="min-h-screen bg-white text-[#121212] overflow-x-hidden"
        style={{ fontFamily: `${inter.style.fontFamily}, ${kanit.style.fontFamily}, sans-serif` }}
    >
      
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
        <Link href="/" className="pointer-events-auto flex items-center gap-2 bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full hover:bg-white transition-all font-bold uppercase tracking-wider text-xs border border-slate-200 shadow-sm hover:shadow-md">
            <ArrowLeft size={16}/> Back
        </Link>
        <div className="pointer-events-auto font-black text-xl tracking-tighter bg-white/60 backdrop-blur-md px-4 py-1 rounded-full border border-slate-200/50">
            RAVIT<span className="text-[#E60000]">.</span>
        </div>
      </nav>

      <div className="relative w-full max-w-4xl mx-auto pt-24 md:pt-32 px-4 md:px-0">
          <div className="relative w-full aspect-square z-20 rounded-[40px] overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
              <Image 
                  src={story.image || "/placeholder.jpg"} 
                  alt={story.title} 
                  fill 
                  className="object-cover"
                  priority
              />
          </div>

          <motion.div 
            style={{ y: blurY }}
            className="absolute top-[75%] left-4 right-4 h-[70%] -z-10 opacity-70"
          >
              <div className="relative w-full h-full blur-[120px] saturate-150">
                 <Image 
                    src={story.image || "/placeholder.jpg"} 
                    alt="blur-bg" 
                    fill 
                    className="object-cover object-bottom mask-image-fade"
                 />
              </div>
          </motion.div>
      </div>

      <div className="relative z-30 max-w-3xl mx-auto px-6 -mt-2">
          <div className="bg-white/40 backdrop-blur-3xl rounded-[40px] p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/40 ring-1 ring-white/60">
              <div className="text-center space-y-6">
                  <div className="flex justify-center items-center gap-3">
                      <span className="bg-[#E60000] text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-red-500/20 shadow-lg">
                          {story.category}
                      </span>
                      <span className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
                          <Calendar size={12}/> {story.createdAt?.toDate ? new Date(story.createdAt.toDate()).toLocaleDateString('th-TH') : 'Today'}
                      </span>
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.1] text-slate-900 tracking-tight drop-shadow-sm">
                      {story.title}
                  </h1>
                  
                  {/* ปรับ font-medium ตามที่ขอให้หนาขึ้น */}
                  <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
                      {story.shortDesc}
                  </p>

                  <div className="flex items-center justify-center gap-6 pt-6 border-t border-slate-200/50">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/50 border border-white flex items-center justify-center text-slate-400 shadow-sm">
                             <User size={18}/>
                          </div>
                          <div className="text-left">
                              <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">Ravit Sodsong</div>
                              <div className="text-[10px] text-slate-500">Author</div>
                          </div>
                      </div>
                      <div className="w-px h-8 bg-slate-300/50"></div>
                      <button 
                          onClick={() => navigator.share({title: story.title, url: window.location.href})}
                          className="flex items-center gap-2 text-slate-500 hover:text-[#E60000] transition-colors text-xs font-bold uppercase tracking-widest"
                      >
                          <Share2 size={16}/> Share
                      </button>
                  </div>
              </div>
          </div>

          <div className="mt-16 md:mt-24 space-y-8">
              {story.contentBlocks?.length > 0 ? (
                  story.contentBlocks.map((block, i) => <ContentBlock key={i} block={block} />)
              ) : (
                  <div className="text-center py-20 text-slate-400 font-light italic">
                      ยังไม่มีเนื้อหาในขณะนี้
                  </div>
              )}
          </div>
          
      </div>

      <footer className="bg-[#121212] text-white py-16 text-center mt-20">
         <div className="font-black text-2xl tracking-tighter mb-4">RAVIT<span className="text-[#E60000]">.</span></div>
         <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em]">Designed for New Generation.</p>
      </footer>

      <style jsx global>{`
        .mask-image-fade {
            mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
        }
      `}</style>
    </div>
  );
}