"use client";
import { useState, useEffect, useRef } from "react";
import { db, auth } from "../../lib/firebase"; 
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, orderBy, query, writeBatch } from "firebase/firestore"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { 
  Pencil, Trash2, LogOut, PlusCircle, 
  Image as ImageIcon, Video, Quote,
  ArrowUp, ArrowDown, Save, ChevronUp, ChevronDown, Plus, X, 
  Link as LinkIcon, Wand2, Eye, EyeOff,
  LayoutTemplate, Bold, Italic, Layers, Settings, ExternalLink, Minus,
  Underline, AlignCenter, List 
} from "lucide-react";

// 🟢 1. นำเข้าและตั้งค่า Font ให้เหมือน Frontend
import { Kanit, Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], display: "swap" });
const kanit = Kanit({ subsets: ["thai", "latin"], weight: ["300", "400", "500", "600", "700"], display: "swap" });

// --- Custom Layout Icons ---
const IconPicLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="stroke-current"><rect x="3" y="4" width="8" height="16" rx="2" fill="currentColor" fillOpacity="0.3" strokeWidth="1.5" /><path d="M14 6H21 M14 10H21 M14 14H19" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const IconPicTop = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="stroke-current"><rect x="4" y="3" width="16" height="10" rx="2" fill="currentColor" fillOpacity="0.3" strokeWidth="1.5" /><path d="M4 17H20 M4 21H16" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const IconPicRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="stroke-current"><rect x="13" y="4" width="8" height="16" rx="2" fill="currentColor" fillOpacity="0.3" strokeWidth="1.5" /><path d="M3 6H10 M3 10H10 M3 14H8" strokeWidth="1.5" strokeLinecap="round"/></svg>
);

// 🟢 RichTextEditor: เครื่องมือแก้ไขข้อความแบบเห็นภาพจริง (WYSIWYG)
const RichTextEditor = ({ value, onChange, placeholder, isQuote }) => {
  const editorRef = useRef(null);
  const [active, setActive] = useState({ bold: false, italic: false, underline: false, justifyCenter: false, insertUnorderedList: false });

  useEffect(() => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const checkActive = () => {
    setActive({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      justifyCenter: document.queryCommandState('justifyCenter'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
    });
  };

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const exec = (command, val = null) => {
    document.execCommand(command, false, val);
    if (editorRef.current) editorRef.current.focus();
    handleInput();
    checkActive();
  };

  const handleLink = () => {
    const url = prompt("ใส่ URL (เช่น https://www...):", "https://");
    if (url) {
      exec('createLink', url);
      if (editorRef.current) {
         const links = editorRef.current.querySelectorAll('a');
         links.forEach(link => {
            if(!link.getAttribute('target')) {
                link.setAttribute('target', '_blank');
                link.classList.add('text-[#E60000]', 'underline', 'font-bold');
            }
         });
         handleInput();
      }
    }
  };

  const handlePaste = (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text/plain');
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      selection.deleteFromDocument();
      const textNode = document.createTextNode(text);
      const range = selection.getRangeAt(0);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
      handleInput();
  };

  return (
    <div className={`relative group flex-1 flex flex-col shadow-sm overflow-hidden border border-slate-200 focus-within:border-slate-400 transition-all ${isQuote ? 'rounded-t-2xl' : 'rounded-2xl'}`}>
      <div className="flex bg-slate-100 border-b border-slate-200 overflow-x-auto no-scrollbar">
          <button type="button" onClick={() => exec('bold')} className={`p-2 border-r border-slate-200 transition-colors ${active.bold ? 'bg-[#121212] text-white' : 'hover:bg-slate-200 text-slate-700'}`} title="ตัวหนา"><Bold size={14}/></button>
          <button type="button" onClick={() => exec('italic')} className={`p-2 border-r border-slate-200 transition-colors ${active.italic ? 'bg-[#121212] text-white' : 'hover:bg-slate-200 text-slate-700'}`} title="ตัวเอียง"><Italic size={14}/></button>
          <button type="button" onClick={() => exec('underline')} className={`p-2 border-r border-slate-200 transition-colors ${active.underline ? 'bg-[#121212] text-white' : 'hover:bg-slate-200 text-slate-700'}`} title="ขีดเส้นใต้"><Underline size={14}/></button>
          <button type="button" onClick={() => exec('justifyCenter')} className={`p-2 border-r border-slate-200 transition-colors ${active.justifyCenter ? 'bg-[#121212] text-white' : 'hover:bg-slate-200 text-slate-700'}`} title="จัดกึ่งกลาง"><AlignCenter size={14}/></button>
          <button type="button" onClick={() => exec('insertUnorderedList')} className={`p-2 border-r border-slate-200 transition-colors ${active.insertUnorderedList ? 'bg-[#121212] text-white' : 'hover:bg-slate-200 text-slate-700'}`} title="รายการจุด"><List size={14}/></button>
          <button type="button" onClick={handleLink} className="p-2 hover:bg-slate-200 text-slate-700 transition-colors" title="แทรกลิงก์"><LinkIcon size={14}/></button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyUp={checkActive}
        onMouseUp={checkActive}
        onPaste={handlePaste}
        className={`flex-1 w-full p-4 min-h-[150px] outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300 [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside [&_b]:font-bold [&_i]:italic [&_u]:underline [&_p]:mb-4 [&>div]:mb-4 whitespace-pre-wrap ${isQuote ? 'text-center italic font-medium text-amber-900 bg-amber-50/50' : 'text-slate-600 bg-slate-50 focus:bg-white'}`}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default function AdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // --- Main State ---
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [customDate, setCustomDate] = useState(""); 
  const [storyDate, setStoryDate] = useState(""); // 🟢 เพิ่ม State สำหรับเก็บวันที่
  const [shortDesc, setShortDesc] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [order, setOrder] = useState(0); 
  const [isPublished, setIsPublished] = useState(true);

  // --- Category State ---
  const [categories, setCategories] = useState(["Politics", "Vision", "Digital", "Lifestyle"]);
  
  // --- Data & Loading ---
  const [blocks, setBlocks] = useState([]); 
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) { setIsAuthorized(true); fetchProjects(); } 
      else { router.push("/login"); }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchProjects = async () => {
    try {
        // 🟢 เปลี่ยนมาเรียงตาม storyDate แบบ desc (ใหม่ไปเก่า)
        const q = query(collection(db, "projects"), orderBy("storyDate", "desc"));
        const querySnapshot = await getDocs(q);
        const items = [];
        const foundCategories = new Set(categories); 
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            items.push({ id: doc.id, ...data });
            if(data.category) foundCategories.add(data.category);
        });
        setProjectsList(items);
        setCategories(Array.from(foundCategories));
        
        if (!editId) {
             const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order || 0)) : 0;
             setOrder(maxOrder + 1);
        }
    } catch (error) { console.error("Error:", error); }
  };

  // --- Helper Functions ---
  const generateSlug = () => {
      if (!title) { alert("กรุณากรอกชื่อเรื่องก่อนครับ"); return; }
      let newSlug = title.toString().toLowerCase().trim()
          .replace(/[\s\W-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      if (!newSlug) newSlug = `story-${Date.now()}`;
      setSlug(newSlug);
  };

  const normalizeBlock = (block) => ({
      layout: block.layout || 'left', 
      heading: block.heading || "", 
      content: block.content || "", 
      textStyle: block.textStyle || (block.mediaType === 'quote' ? 'quote' : 'normal'),
      mediaType: (block.mediaType === 'quote' ? 'none' : block.mediaType) || 'image',
      mediaSrc: block.mediaSrc || "", 
      caption: block.caption || "", 
      actionUrl: block.actionUrl || "",
      published: block.published !== false,
      hasDivider: block.hasDivider || false
  });

  const addBlock = () => { setBlocks([...blocks, normalizeBlock({ layout: 'left', mediaType: 'image' })]); };
  const updateBlock = (index, field, value) => { const newBlocks = [...blocks]; newBlocks[index][field] = value; setBlocks(newBlocks); };
  const removeBlock = (index) => { if(confirm("ลบ Block นี้?")) setBlocks(blocks.filter((_, i) => i !== index)); };
  
  const moveBlock = (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return;
    const newBlocks = [...blocks];
    const target = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[target]] = [newBlocks[target], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const insertHtmlTag = (index, tagType) => {
      const textarea = document.getElementById(`editor-${index}`);
      if (!textarea) return;
      const start = textarea.selectionStart; 
      const end = textarea.selectionEnd;
      const text = blocks[index].content || "";
      const selectedText = text.substring(start, end);
      let insertion = "";
      
      if (tagType === 'bold') insertion = `<b>${selectedText || 'ตัวหนา'}</b>`;
      else if (tagType === 'italic') insertion = `<i>${selectedText || 'ตัวเอียง'}</i>`;
      else if (tagType === 'underline') insertion = `<u>${selectedText || 'ขีดเส้นใต้'}</u>`;
      else if (tagType === 'center') insertion = `<div class="text-center">${selectedText || 'ข้อความจัดกึ่งกลาง'}</div>`;
      else if (tagType === 'list') insertion = `<ul class="list-disc list-inside"><li>${selectedText}</li></ul>`;
      else if (tagType === 'link') { 
          const url = prompt("ใส่ URL:", "https://"); 
          if(url) insertion = `<a href="${url}" target="_blank" class="text-[#E60000] underline font-bold">${selectedText || 'ลิงก์'}</a>`; 
          else return; 
      }
      updateBlock(index, 'content', text.substring(0, start) + insertion + text.substring(end));
  };

  const handleReorderProject = async (index, direction, e) => {
    e.stopPropagation();
    if (direction === 'up' && index === 0) return; if (direction === 'down' && index === projectsList.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentItem = projectsList[index]; const targetItem = projectsList[targetIndex];
    try { 
        const batch = writeBatch(db); 
        batch.update(doc(db, "projects", currentItem.id), { order: targetItem.order }); 
        batch.update(doc(db, "projects", targetItem.id), { order: currentItem.order }); 
        await batch.commit(); fetchProjects(); 
    } catch (error) { console.error(error); }
  };

  const handleDeleteProject = async (id) => { if(!confirm("ยืนยันลบถาวร?")) return; await deleteDoc(doc(db, "projects", id)); if(editId === id) resetForm(); fetchProjects(); }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    // 🟢 เพิ่ม storyDate เข้าไปใน rawPayload เพื่อเซฟลง Database
    const rawPayload = { title, slug: slug || "", category, storyDate, shortDesc, image: coverImage, order: Number(order) || 0, published: isPublished, contentBlocks: blocks, updatedAt: new Date() };
    try {
      if (editId) { await updateDoc(doc(db, "projects", editId), rawPayload); alert("บันทึกแล้ว!"); } 
      else { await addDoc(collection(db, "projects"), { ...rawPayload, createdAt: new Date() }); alert("สร้างใหม่แล้ว!"); }
      resetForm(); fetchProjects();
    } catch (error) { console.error(error); alert("Error: " + error.message); } finally { setLoading(false); }
  };

  const handleEditClick = (item) => {
      setEditId(item.id); setTitle(item.title); setSlug(item.slug || ""); 
      setCategory(item.category); setStoryDate(item.storyDate || ""); setShortDesc(item.shortDesc); setCoverImage(item.image); // 🟢 ดึง storyDate มาโชว์
      setOrder(item.order || 0); setIsPublished(item.published !== false);
      setBlocks((item.contentBlocks || []).map(normalizeBlock));
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 🟢 เพิ่ม setStoryDate("") เพื่อล้างค่าช่องวันที่
  const resetForm = () => { setEditId(null); setTitle(""); setSlug(""); setCategory(""); setStoryDate(""); setShortDesc(""); setCoverImage(""); setOrder(projectsList.length > 0 ? Math.max(...projectsList.map(i => i.order || 0)) + 1 : 1); setBlocks([]); setIsPublished(true); }

  if (!isAuthorized) return null;

  return (
    // 🟢 2. เรียกใช้ Font ที่ตั้งค่าไว้ครอบทั้งหน้าแอดมิน
    <div 
        className="min-h-screen bg-slate-100 flex flex-col md:flex-row"
        style={{ fontFamily: `${inter.style.fontFamily}, ${kanit.style.fontFamily}, sans-serif` }}
    >
      {/* SIDEBAR: ปรับปรุงการแสดงผล Card Activity */}
      <div className="w-full md:w-80 bg-[#121212] text-white border-r border-slate-800 h-auto md:h-screen sticky top-0 overflow-y-auto flex flex-col z-20 shadow-xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#E60000]">
             <h1 className="font-bold flex items-center gap-2 tracking-tight"><Settings size={18}/> RAVIT ADMIN</h1>
             <button onClick={() => {signOut(auth); router.push("/login");}} className="text-white hover:bg-black/20 p-1.5 rounded"><LogOut size={16}/></button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-widest flex justify-between items-center">
                <span>STORIES ({projectsList.length})</span>
                <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Sort by Order</span>
            </h3>
            <div className="space-y-2">
                {projectsList.map((item, idx) => (
                    <div key={item.id} onClick={() => handleEditClick(item)} className={`p-2.5 rounded-xl border flex gap-3 items-center cursor-pointer group transition-all duration-200 ${editId === item.id ? 'border-[#E60000] bg-white text-black shadow-md scale-[1.02]' : 'border-slate-800 bg-[#1A1A1A] hover:bg-slate-800 text-slate-400'}`}>
                        {/* Thumbnail Image */}
                        <div className={`w-10 h-10 rounded-lg overflow-hidden shrink-0 ${editId === item.id ? 'bg-slate-100' : 'bg-slate-800'}`}>
                             {item.image ? (
                                <img src={item.image} alt="" className="w-full h-full object-cover"/>
                             ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-30"><ImageIcon size={16}/></div>
                             )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs truncate leading-tight mb-1">{item.title}</div>
                            <div className="flex gap-2 text-[9px] opacity-70">
                                <span>{item.category}</span>
                                <span className={item.published ? 'text-green-500 font-bold' : 'text-slate-500'}>{item.published ? '• Live' : '• Draft'}</span>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(item.id); }} className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg self-end transition-all"><Trash2 size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* --- MAIN CANVAS --- */}
      <div className="flex-1 p-4 md:p-8 h-screen overflow-y-auto bg-slate-50">
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                <div>
                    <h2 className={`text-2xl font-black flex items-center gap-2 uppercase tracking-tighter ${editId ? 'text-[#E60000]' : 'text-slate-900'}`}>
                        {editId ? <><Pencil size={24}/> Editing Story</> : <><PlusCircle size={24}/> Create New</>}
                    </h2>
                    {editId && (
                        <button onClick={resetForm} className="mt-2 flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">
                            <X size={14}/> Cancel Editing
                        </button>
                    )}
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button type="button" onClick={() => setIsPublished(!isPublished)} className={`flex-1 md:flex-none flex items-center justify-center gap-1 px-4 py-2 rounded-full text-xs font-bold border transition-all ${isPublished ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-200 text-gray-500 border-gray-300'}`}>
                        {isPublished ? <><Eye size={14}/> Live</> : <><EyeOff size={14}/> Draft</>}
                    </button>
                    <button onClick={handleSubmit} disabled={loading} className={`flex-1 md:flex-none px-6 py-2 rounded-full text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 hover:shadow-red-500/20 transition-all ${editId ? 'bg-[#E60000]' : 'bg-[#121212]'}`}>
                        <Save size={16}/> {loading ? 'Saving...' : (editId ? 'Save Changes' : 'Publish Story')}
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4 mb-6">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ชื่อรายการ (สำหรับอ้างอิงในระบบ / ไม่แสดงหน้าเว็บ)</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full text-2xl font-bold border-b-2 border-slate-100 focus:border-[#E60000] outline-none py-2 transition-colors" placeholder="ระบุชื่อเพื่อให้หาง่ายในระบบหลังบ้าน..."/>
                </div>
                
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <LinkIcon size={14} className="text-slate-400"/>
                    <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="bg-transparent text-xs w-full outline-none text-slate-600" placeholder="url-slug (auto-generated)"/>
                    <button onClick={generateSlug} type="button" className="text-xs text-[#E60000] font-bold hover:bg-red-50 p-1 rounded"><Wand2 size={14}/></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                            <ImageIcon size={14} className="text-slate-400"/>
                            <input type="text" value={coverImage} onChange={e => setCoverImage(e.target.value)} className="bg-transparent text-sm w-full outline-none" placeholder="Cover Image URL"/>
                        </div>
                        {coverImage && <img src={coverImage} alt="Cover" className="w-full h-32 object-cover rounded-xl border border-slate-200" />}
                    </div>
                    <div className="space-y-4">
                        {/* 🟢 แก้ไขช่องป้ายแดง (แทนที่ Category เดิม) */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ข้อความป้ายแดง (หมวดหมู่)</label>
                            <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 text-sm border-none bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-slate-200 transition-all" placeholder="เช่น แถลงข่าว, ลงพื้นที่, สัมมนา..."/>
                            <span className="text-[10px] text-[#E60000] ml-1">* ข้อความสั้นๆ ที่จะไปแสดงบนป้ายสีแดงในหน้า Story</span>
                        </div>
                        
                        {/* 🟢 เพิ่มช่อง Input ปฏิทินตรงนี้ */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">วันที่ (สำหรับแสดงผล)</label>
                            <input type="date" value={storyDate} onChange={e => setStoryDate(e.target.value)} className="w-full p-3 text-sm border-none bg-slate-50 rounded-2xl outline-none text-slate-600 cursor-pointer focus:ring-2 focus:ring-slate-200 transition-all" title="เลือกวันที่แสดงผล" />
                        </div>
                        
                        <textarea value={shortDesc} onChange={e => setShortDesc(e.target.value)} className="w-full p-3 text-sm border-none bg-slate-50 rounded-2xl outline-none h-24 resize-none focus:ring-2 focus:ring-slate-200 transition-all mt-2" placeholder="คำอธิบายสั้นๆ (Short description)..."/>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400 uppercase text-xs font-bold tracking-widest"><LayoutTemplate size={14}/> Content Blocks</div>
                {blocks.map((block, index) => (
                    <div key={index} className={`relative bg-white rounded-3xl border-2 transition-all ${block.published ? 'border-slate-100 shadow-sm' : 'border-dashed border-slate-300 opacity-70'}`}>
                        <div className="flex justify-between items-center p-3 border-b border-slate-50 bg-slate-50/50 rounded-t-3xl">
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col gap-0.5 px-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
                                    <button onClick={() => moveBlock(index, 'up')}><ChevronUp size={12}/></button>
                                    <button onClick={() => moveBlock(index, 'down')}><ChevronDown size={12}/></button>
                                </div>
                                <span className="text-xs font-bold text-slate-400">#{index+1}</span>
                                <div className="h-4 w-px bg-slate-200 mx-1"></div>
                                <div className="flex bg-white rounded-lg border border-slate-100 p-0.5 gap-0.5">
                                    <button type="button" onClick={() => updateBlock(index, 'layout', 'left')} className={`p-1.5 rounded-md ${block.layout === 'left' ? 'bg-[#121212] text-white' : 'text-slate-400 hover:bg-slate-100'}`}><IconPicLeft /></button>
                                    <button type="button" onClick={() => updateBlock(index, 'layout', 'top')} className={`p-1.5 rounded-md ${block.layout === 'top' ? 'bg-[#121212] text-white' : 'text-slate-400 hover:bg-slate-100'}`}><IconPicTop /></button>
                                    <button type="button" onClick={() => updateBlock(index, 'layout', 'right')} className={`p-1.5 rounded-md ${block.layout === 'right' ? 'bg-[#121212] text-white' : 'text-slate-400 hover:bg-slate-100'}`}><IconPicRight /></button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => updateBlock(index, 'published', !block.published)} className={`text-xs flex items-center gap-1 font-bold ${block.published ? 'text-green-500' : 'text-slate-400'}`}>{block.published ? <Eye size={12}/> : <EyeOff size={12}/>}</button>
                                <button onClick={() => removeBlock(index)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={14}/></button>
                            </div>
                        </div>

                        <div className={`p-6 flex gap-6 ${block.layout === 'top' ? 'flex-col' : (block.layout === 'right' ? 'flex-col md:flex-row-reverse' : 'flex-col md:flex-row')}`}>
                            <div className={`flex flex-col gap-3 ${block.layout === 'top' ? 'w-full' : 'w-full md:w-5/12'}`}>
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                    <div className="flex gap-2 mb-3 text-[10px] uppercase font-bold text-slate-400">
                                        <button onClick={() => updateBlock(index, 'mediaType', 'image')} className={`flex items-center gap-1 ${block.mediaType==='image'?'text-[#121212] underline':'hover:text-slate-600'}`}><ImageIcon size={12}/> Image</button>
                                        <button onClick={() => updateBlock(index, 'mediaType', 'video')} className={`flex items-center gap-1 ${block.mediaType==='video'?'text-[#121212] underline':'hover:text-slate-600'}`}><Video size={12}/> Video</button>
                                        <button onClick={() => updateBlock(index, 'mediaType', 'none')} className={`ml-auto ${block.mediaType==='none'?'text-red-500':'hover:text-slate-600'}`}>No Media</button>
                                    </div>
                                    {block.mediaType !== 'none' && (
                                        <>
                                            {block.mediaSrc ? ( 
                                                block.mediaType === 'video' ? 
                                                <div className="w-full h-32 bg-black rounded-xl flex items-center justify-center text-white text-xs mb-2">Video Preview</div> :
                                                <img src={block.mediaSrc} className="w-full h-32 object-cover rounded-xl bg-white border mb-2" alt="preview"/>
                                            ) : ( 
                                                <div className="w-full h-32 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs mb-2">No Media URL</div> 
                                            )}
                                            <input type="text" value={block.mediaSrc || ""} onChange={e => updateBlock(index, 'mediaSrc', e.target.value)} className="w-full p-2 text-xs border-none bg-white rounded-lg mb-2 shadow-sm" placeholder={block.mediaType === 'video' ? "YouTube URL..." : "Image URL..."}/>
                                            <input type="text" value={block.caption || ""} onChange={e => updateBlock(index, 'caption', e.target.value)} className="w-full p-1 text-[10px] text-center bg-transparent border-b border-slate-200 outline-none placeholder:text-slate-300" placeholder="Media Caption..."/>
                                            <div className="mt-2 flex items-center gap-1">
                                                <ExternalLink size={10} className="text-slate-400"/>
                                                <input type="text" value={block.actionUrl || ""} onChange={e => updateBlock(index, 'actionUrl', e.target.value)} className="flex-1 p-1 text-[10px] bg-transparent text-blue-600 outline-none" placeholder="Action URL (Optional)"/>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <input type="text" value={block.heading || ""} onChange={e => updateBlock(index, 'heading', e.target.value)} className="font-bold text-sm bg-transparent outline-none placeholder:text-slate-300 w-2/3" placeholder="Heading (Optional)..."/>
                                    <button onClick={() => updateBlock(index, 'textStyle', block.textStyle === 'quote' ? 'normal' : 'quote')} className={`text-[10px] border px-2 py-1 rounded-full flex items-center gap-1 ${block.textStyle === 'quote' ? 'bg-amber-100 text-amber-700 border-amber-200 font-bold' : 'bg-white text-slate-400 border-slate-200'}`}>
                                        <Quote size={10}/> {block.textStyle === 'quote' ? 'Quote Mode' : 'Normal Text'}
                                    </button>
                                </div>
                                <div className="relative flex-1 flex flex-col">
                                    <RichTextEditor 
                                        value={block.content || ""}
                                        onChange={(newContent) => updateBlock(index, 'content', newContent)}
                                        placeholder={block.textStyle === 'quote' ? '"พิมพ์คำคมที่นี่..."' : "พิมพ์เนื้อหาบทความ (กด Enter ขึ้นบรรทัดใหม่ได้เลย)..."}
                                        isQuote={block.textStyle === 'quote'}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-slate-50 p-2 flex justify-center bg-slate-50/30 rounded-b-3xl">
                            <button type="button" onClick={() => updateBlock(index, 'hasDivider', !block.hasDivider)} className={`text-[10px] px-3 py-1 rounded-full flex items-center gap-1 transition-all border ${block.hasDivider ? 'bg-[#121212] text-white border-black shadow-sm' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}>
                                {block.hasDivider ? <><Minus size={12} className="rotate-90"/> Divider ON</> : <><Plus size={10}/> Add Divider</>}
                            </button>
                        </div>
                    </div>
                ))}
                <button onClick={addBlock} className="w-full py-8 border-2 border-dashed border-slate-300 rounded-3xl text-slate-400 font-bold hover:bg-white hover:border-[#E60000] hover:text-[#E60000] transition-all flex flex-col items-center gap-2">
                    <PlusCircle size={24}/>
                    <span>ADD CONTENT BLOCK</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}