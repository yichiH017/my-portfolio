import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Twitter, Github, 
  Cpu, MousePointer2, Layers, 
  ChevronRight, ArrowDownRight, Share2, Download,
  Maximize, Code, Zap, Sparkles, Shapes, Sun,
  Aperture, Command, Fingerprint, ArrowDown,
  X, Mail, Globe, Braces, Terminal, CheckCircle2,
  Box, Workflow, Binary, ShieldCheck, 
  Activity, Infinity, Blocks, Bot, GitBranch,
  Send, MessageSquare, Radio, HardDrive, Play, Monitor, Palette,
  Wifi, Shield, ZapOff, Link, Copy, ExternalLink, Linkedin, MessageCircle, Info
} from 'lucide-react';

// --- 作品數據庫 ---
const WORKS_DATA = [
  {
    id: "work_01",
    title: "THE SILENT\nSANCTUARY",
    subTitle: "Atmospheric Environment & Volumetric Study",
    category: "CG",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1400&auto=format&fit=crop",
    workflowUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=1400&auto=format&fit=crop",
    tech: "Midjourney v6.1 / ComfyUI / Magnific",
    description: "這是一場關於光影與孤寂的視覺實驗。透過 AI 生成複雜的建築幾何，並利用影像修復技術強化細節。",
    workflowDetail: "Base generated in MJ -> Multi-pass upscaling -> Localized in-painting."
  },
  {
    id: "work_02",
    title: "NEO-KINETIC\nARMOR",
    subTitle: "Industrial Hard-Surface & Material Pipeline",
    category: "角色設計",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1400&auto=format&fit=crop",
    workflowUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1400&auto=format&fit=crop",
    tech: "Stable Diffusion XL / ControlNet / Photoshop",
    description: "展示如何在保持工業設計合理性的前提下，利用 AIGC 技術迭代高精度的盔甲組件。",
    workflowDetail: "Canny & Depth maps used to lock silhouette -> Custom metal LoRA."
  },
  {
    id: "work_03",
    title: "AGENTIC FLOW:\nAUTO-PROD",
    subTitle: "n8n Powered AI Agent Production Line",
    category: "N8N工作流",
    imageUrl: "https://images.unsplash.com/photo-1518433278988-c7ef4e902102?q=80&w=1400&auto=format&fit=crop",
    workflowUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop",
    tech: "n8n / OpenAI API / Webhooks / SDXL API",
    description: "開發了一套全自動化的資產生產線。利用 n8n 編排 AI Agent 進行需求分析與批次圖形渲染。",
    workflowDetail: "n8n Logic Flow -> GPT-4o Reasoning Agent -> ComfyUI API Execution."
  },
  {
    id: "work_04",
    title: "ETHERSCAPE\nICONS",
    subTitle: "High-Fidelity UI Component System",
    category: "UI",
    imageUrl: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1400&auto=format&fit=crop",
    workflowUrl: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1400&auto=format&fit=crop",
    tech: "Custom SD Model / Python Batch Scripts",
    description: "為 3A 等級遊戲開發的大型 UI 圖標庫方案。展示了如何利用自動化腳本配合 AI 進行產出。",
    workflowDetail: "Automated batch processing -> Background removal -> SVG pipeline."
  },
  {
    id: "work_05",
    title: "NEURAL\nCHRONICLES",
    subTitle: "Cinematic Sequence & Motion Study",
    category: "影片",
    imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1400&auto=format&fit=crop",
    workflowUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1400&auto=format&fit=crop",
    tech: "Runway Gen-3 / Luma / DaVinci Resolve",
    description: "探索 AI 動態影像的極限。將靜態概念圖轉化為流暢的敘事鏡頭。",
    workflowDetail: "Image-to-Video Seed -> Motion Brush -> Neural Interpolation.",
    isVideo: true
  }
];

const CATEGORIES = ["ALL", "CG", "角色設計", "UI", "影片", "N8N工作流"];

export default function App() {
  const [currentView, setCurrentView] = useState('gallery');
  const [activeCategory, setActiveCategory] = useState("CG"); // 一開始預設為 CG
  const [showNav, setShowNav] = useState(false); // 首訪頂部隱藏
  const [isMouseAtTop, setIsMouseAtTop] = useState(false);
  const [hasExplored, setHasExplored] = useState(false); 
  const [lastScrollTop, setLastScrollTop] = useState(0);
  
  const containerRef = useRef(null);

  // --- 滾動偵測與常駐邏輯 ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container || currentView !== 'gallery') return;

    const handleContainerScroll = () => {
      const currentScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const totalHeight = container.scrollHeight;
      
      const isAtTop = currentScrollTop < 20;
      const isAtBottom = currentScrollTop + containerHeight >= totalHeight - 20;

      // 追蹤使用者是否離開過首屏
      if (currentScrollTop > 100 && !hasExplored) {
        setHasExplored(true);
      }

      // 選單顯示邏輯
      if (isAtBottom || (isAtTop && hasExplored) || isMouseAtTop) {
        setShowNav(true);
      } else {
        // 中間區域：向上捲動顯示，向下捲動隱藏
        if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
          setShowNav(false);
        } else if (currentScrollTop < lastScrollTop) {
          setShowNav(true);
        }
      }
      setLastScrollTop(currentScrollTop);
    };

    container.addEventListener('scroll', handleContainerScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleContainerScroll);
  }, [currentView, isMouseAtTop, hasExplored, lastScrollTop]);

  const handleMouseEnterTop = () => {
    setIsMouseAtTop(true);
    setShowNav(true);
  };

  const handleMouseLeaveTop = () => {
    setIsMouseAtTop(false);
    const container = containerRef.current;
    if (container) {
      const isAtTop = container.scrollTop < 20;
      const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 20;
      if (!isAtBottom && !(isAtTop && hasExplored)) {
        setShowNav(false);
      }
    }
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setShowNav(false);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  const filteredWorks = useMemo(() => {
    return activeCategory === "ALL" 
      ? WORKS_DATA 
      : WORKS_DATA.filter(work => work.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    if (currentView !== 'gallery') {
      setShowNav(false); // 進入分頁時強制隱藏導覽列
      setIsMouseAtTop(false); // 重置感應狀態
    }
  }, [currentView]);

  return (
    <div className="bg-[#050505] text-stone-100 min-h-screen font-serif selection:bg-orange-500 selection:text-white overflow-hidden text-left">
      
      {/* 頂部感應觸發區：只在主畫廊模式下啟用 */}
      {currentView === 'gallery' && (
        <div 
          className="fixed top-0 left-0 w-full h-16 z-[120] pointer-events-auto cursor-ns-resize"
          onMouseEnter={handleMouseEnterTop}
          onMouseLeave={handleMouseLeaveTop}
        />
      )}

      {/* 頂部導覽列：增加畫廊模式的顯示判斷 */}
      <nav 
        onMouseEnter={() => currentView === 'gallery' && setShowNav(true)}
        onMouseLeave={() => !isMouseAtTop && setShowNav(false)}
        className={`fixed top-0 w-full z-[130] px-6 py-6 md:px-12 md:py-8 flex justify-between items-center mix-blend-difference transition-all duration-700 ease-in-out pointer-events-auto ${showNav && currentView === 'gallery' ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col cursor-pointer text-white" onClick={() => { setCurrentView('gallery'); setActiveCategory("ALL"); }}>
          <span className="text-lg md:text-xl font-black tracking-tighter leading-none uppercase italic">Archive</span>
          <span className="text-[8px] md:text-[10px] tracking-[0.4em] font-sans font-bold opacity-60 uppercase text-left">System 2025</span>
        </div>
        <div className="flex gap-4 md:gap-12 font-sans text-[8px] md:text-[10px] font-black tracking-widest text-white uppercase">
          <button onClick={() => setCurrentView('overview')} className="hover:opacity-50 transition-all">Overview</button>
          <button onClick={() => setCurrentView('methodology')} className="hover:opacity-50 transition-all">Methodology</button>
          <button onClick={() => setCurrentView('inquiry')} className="hover:opacity-50 transition-all">Inquiry</button>
        </div>
      </nav>

      {/* 分類篩選器 */}
      {currentView === 'gallery' && (
        <div 
          onMouseEnter={() => setShowNav(true)}
          className={`fixed top-20 md:top-24 left-0 w-full z-[131] px-4 md:px-12 flex items-center justify-center py-4 pointer-events-none transition-all duration-700 ease-in-out ${showNav ? 'translate-y-0 opacity-100' : '-translate-y-48 opacity-0'}`}
        >
          <div className="pointer-events-auto flex items-center gap-1 bg-stone-900/90 backdrop-blur-2xl p-1.5 rounded-full border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] max-w-full overflow-x-auto no-scrollbar whitespace-nowrap">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                onClick={() => handleCategoryChange(cat)}
                className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] px-5 py-2.5 rounded-full transition-all duration-300 ${activeCategory === cat ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'text-stone-400 hover:text-white hover:bg-white/5'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 內容容器 - 啟動 Scroll Snap */}
      <div 
        ref={containerRef}
        className={`h-screen w-full relative ${currentView === 'gallery' ? 'snap-container custom-scrollbar' : 'overflow-y-auto'}`}
      >
        {currentView === 'gallery' ? (
          <div className="animate-in fade-in duration-1000">
            <HeroSection onScrollRequest={() => containerRef.current?.scrollTo({ top: window.innerHeight, behavior: 'smooth' })} />
            <main>
              {filteredWorks.map((work) => (
                <FullBleedWorkSection key={`${work.id}-${activeCategory}`} work={work} />
              ))}
            </main>
            <FooterSection onInquiry={() => setCurrentView('inquiry')} />
          </div>
        ) : (
          <div className="fixed inset-0 z-[110] animate-in slide-in-from-right duration-700">
             {currentView === 'overview' && <OverviewPage onClose={() => setCurrentView('gallery')} />}
             {currentView === 'methodology' && <MethodologyPage onClose={() => setCurrentView('gallery')} />}
             {currentView === 'inquiry' && <InquiryPage onClose={() => setCurrentView('gallery')} />}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .snap-container { scroll-snap-type: y mandatory; overflow-y: scroll; }
        .snap-section { scroll-snap-align: start; scroll-snap-stop: always; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

// --- 組件庫 ---

function HeroSection({ onScrollRequest }) {
  return (
    <header className="relative h-screen w-full flex flex-col justify-center px-8 md:px-12 bg-[#050505] overflow-hidden text-left text-stone-100 snap-section">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] md:opacity-[0.03] select-none pointer-events-none transform -translate-y-20">
        <h1 className="text-[60vw] md:text-[50vw] font-black text-white text-center uppercase">AI</h1>
      </div>
      <div className="relative z-10">
        <div className="overflow-hidden">
          <h2 className="text-[14vw] md:text-[14vw] font-black leading-[0.75] tracking-tighter uppercase mb-8 md:mb-12 animate-in slide-in-from-bottom-full duration-1000 text-white italic text-left">Digital<br/>Visions.</h2>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 animate-in fade-in duration-1000 delay-500 text-left">
          <div className="h-[2px] w-16 md:w-24 bg-white"></div>
          <p className="font-sans text-[10px] md:text-sm font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase opacity-60 text-white text-left">High-Precision AIGC & Automation Artist</p>
        </div>
      </div>
      <button 
        onClick={onScrollRequest}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 group cursor-pointer transition-all hover:translate-y-2"
      >
         <span className="text-[8px] md:text-[10px] font-black tracking-[0.5em] uppercase text-white opacity-40 group-hover:opacity-100 transition-opacity">Launch Exploration</span>
         <div className="w-10 h-16 border border-white/20 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-orange-500 rounded-full animate-bounce"></div>
         </div>
      </button>
    </header>
  );
}

function FooterSection({ onInquiry }) {
  return (
    <footer className="relative h-screen w-full flex flex-col justify-center bg-stone-100 text-stone-900 px-8 md:px-12 overflow-hidden text-left py-20 md:py-0 snap-section">
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] hidden md:block"><Fingerprint className="w-[50vw] h-[50vw]" /></div>
      <div className="max-w-screen-2xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 items-end">
        <div className="animate-in slide-in-from-left duration-1000 text-left text-stone-900">
          <span className="font-sans text-[10px] font-black tracking-[0.5em] uppercase mb-6 md:mb-8 block opacity-40 text-stone-900 text-left">Initialize Phase 02</span>
          <h3 className="text-6xl md:text-[12vw] font-black leading-[0.85] tracking-tighter uppercase mb-10 md:mb-12 italic text-left text-stone-900">Sync<br/>Nodes.</h3>
          <div className="flex flex-col sm:flex-row gap-6 text-left">
             <button onClick={onInquiry} className="w-full sm:w-auto px-10 md:px-12 py-5 bg-stone-900 text-white font-sans text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-stone-800 transition-all shadow-2xl active:scale-95 pointer-events-auto">Contact Director</button>
             <div className="flex gap-4 pointer-events-auto">
                <button className="w-14 h-14 border border-stone-300 rounded-full flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all active:scale-90 text-stone-900 shadow-sm"><Twitter size={20} /></button>
                <button className="w-14 h-14 border border-stone-300 rounded-full flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all active:scale-90 text-stone-900 shadow-sm"><Github size={20} /></button>
             </div>
          </div>
        </div>
        <div className="lg:text-right font-sans opacity-40 text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] text-stone-600 leading-relaxed text-right">
          <p>Intelligence Integrity © 2025</p>
        </div>
      </div>
    </footer>
  );
}

function FullBleedWorkSection({ work }) {
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0), 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden group text-left border-b border-white/5 snap-section text-white">
      <div className="absolute inset-0 bg-[#050505]">
        <div className="w-full h-full transform transition-transform duration-1000 ease-out" style={{ transform: `scale(${1.2 - (scrollProgress * 0.2)})` }}>
          <img src={work.imageUrl} alt={work.title} className={`w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 ${isHovered ? 'brightness-[0.3]' : 'brightness-75'}`} />
        </div>
        <div className="absolute inset-0 transition-all duration-1000 ease-in-out pointer-events-none z-10"
          style={{ clipPath: isHovered ? 'inset(0 0 0 0)' : 'inset(0 0 0 100%)', background: `url(${work.workflowUrl}) center/cover no-repeat`, mixBlendMode: 'screen', opacity: 0.7 }}>
          <div className="absolute inset-y-0 left-0 w-[1px] bg-white shadow-[0_0_30px_white] h-full text-left"></div>
        </div>
      </div>

      <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-16 pointer-events-none text-white text-left">
        <div className={`flex justify-between items-start mix-blend-difference transition-all duration-700 delay-300 ${isHovered ? 'opacity-10' : 'opacity-100'} text-left text-white`}>
          <div className="flex flex-col gap-2 text-left">
            <span className="font-sans text-[9px] md:text-[11px] font-black tracking-[0.3em] md:opacity-60 uppercase text-left">{work.category}</span>
            <div className="h-[1px] w-12 md:w-20 bg-white/40 text-left"></div>
          </div>
        </div>

        <div className={`mix-blend-difference transition-all duration-700 ${isHovered ? 'opacity-5' : 'opacity-100'} text-left`}>
          <h3 className="text-4xl sm:text-6xl md:text-[10vw] font-black leading-[0.9] tracking-tighter uppercase whitespace-pre-line italic text-left">{work.title}</h3>
          <p className="font-sans text-[8px] md:text-xs font-bold tracking-[0.3em] md:opacity-60 mt-4 md:mt-6 text-left">{work.subTitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pointer-events-auto transition-all duration-700 delay-500 text-left text-white">
          <div className={`lg:col-span-5 flex flex-col gap-4 md:gap-6 mix-blend-difference transition-opacity duration-700 ${isHovered ? 'opacity-5' : 'opacity-100'} text-left text-white`}>
            <p className="text-[11px] md:text-sm leading-relaxed max-w-md font-medium opacity-80 text-left text-white">{work.description}</p>
            <div className="flex flex-col gap-1 text-left text-white text-white"><span className="text-[8px] font-black uppercase tracking-widest opacity-40 text-left text-white">Tech Stack</span><span className="text-[9px] md:text-[11px] font-bold font-mono text-white break-words text-left text-white">{work.tech}</span></div>
          </div>
          <div className="lg:col-span-7 flex justify-end text-right">
            <button 
              onMouseEnter={() => setIsHovered(true)} 
              onMouseLeave={() => setIsHovered(false)}
              className="group flex items-center gap-4 md:gap-6 bg-stone-900/80 backdrop-blur-xl px-8 md:px-10 py-4 md:py-6 rounded-full border border-white/20 hover:bg-white hover:text-stone-900 transition-all duration-500 active:scale-95 text-white"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">Peek Pipeline</span>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border border-current flex items-center justify-center transition-transform ${isHovered ? 'rotate-45' : ''}`}><ArrowDownRight className="w-4 h-4" /></div>
            </button>
          </div>
        </div>
      </div>

      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-700 pointer-events-none ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} text-left text-stone-900 w-[85%] md:w-auto`}>
        <div className="bg-white text-stone-900 p-6 md:p-8 rounded-sm shadow-2xl max-w-md border-l-[8px] md:border-l-[12px] border-stone-800 text-left">
           <div className="flex items-center gap-3 mb-4 text-stone-900 text-left">{work.category === "N8N工作流" ? <Bot className="text-orange-500" size={20} /> : <Activity className="text-orange-500" size={20} />}<span className="font-sans text-[8px] md:text-[10px] font-black tracking-widest uppercase text-stone-400 text-left">DATA LOG</span></div>
           <p className="font-sans text-[11px] md:text-xs leading-relaxed font-black italic mb-4 md:mb-6 text-stone-900 text-left">"{work.workflowDetail}"</p>
           <div className="flex gap-2 text-stone-900 text-left"><div className="h-1 w-4 bg-orange-500 text-left"></div><div className="h-1 w-4 bg-stone-200 text-left"></div></div>
        </div>
      </div>
    </section>
  );
}

function OverviewPage({ onClose }) {
  return (
    <div className="h-full w-full bg-stone-100 text-stone-900 pt-32 md:pt-40 pb-20 px-8 md:px-12 relative overflow-y-auto custom-scrollbar text-left text-stone-900">
      <div className="fixed top-6 right-6 md:top-10 md:right-10 z-[150] text-stone-900"><button onClick={onClose} className="w-12 h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur-md border border-stone-300 rounded-full hover:bg-stone-900 hover:text-white transition-all shadow-xl active:scale-90 flex items-center justify-center text-stone-900 shadow-stone-300"><X size={24} /></button></div>
      <div className="max-w-screen-xl mx-auto text-stone-900">
        <header className="mb-16 md:mb-24 text-left text-stone-900"><h2 className="text-5xl sm:text-7xl md:text-[12vw] font-black tracking-tighter uppercase leading-[0.8] mb-8 md:mb-12 italic text-stone-900 text-left">Artist Profile.</h2><div className="flex items-baseline gap-6 md:gap-12 text-left text-stone-900"></div><p className="font-sans text-[10px] md:text-xs font-bold tracking-[0.4em] opacity-60 uppercase text-left text-stone-900">AIGC Specialist</p></header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-start text-stone-900 text-left">
          <div className="lg:col-span-7 space-y-8 md:space-y-12 text-stone-900 text-left"><p className="text-xl md:text-4xl font-medium leading-tight italic text-left text-stone-900">我致力於開發具備「智慧」的生產管線。建立一套能夠理解創意需求並自動轉化為高品質資產的自動化系統。</p><p className="text-stone-500 text-sm md:text-lg leading-relaxed text-left text-stone-600">透過 n8n, ComfyUI 與 GPT-4 接口，將 AIGC 轉化為可控的數位工業流程。</p></div>
          <div className="lg:col-span-5 relative text-left text-stone-900"><div className="aspect-[4/5] bg-stone-200 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 rounded-sm shadow-2xl text-left text-stone-900"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover text-left" /></div></div>
        </div>
      </div>
    </div>
  );
}

function MethodologyPage({ onClose }) {
  const roadmap = [
    { id: "M1", title: "Agentic Orchestration", icon: <GitBranch size={48} />, desc: "利用 n8n 建立核心邏輯。透過 AI Agent 進行自動化解析，將創意 Brief 拆解為任務流。" },
    { id: "M2", title: "Neural Synthesis", icon: <Workflow size={48} />, desc: "利用 ComfyUI 建立多節點自定義管線。將生成過程分解為構圖、光影與材質。" },
    { id: "M3", title: "Control Precision", icon: <Binary size={48} />, desc: "使用 ControlNet 技術進行嚴格的幾何結構鎖定。徹底排除 AI 生成的隨機性。" },
    { id: "M4", title: "High-Fidelity", icon: <ShieldCheck size={48} />, desc: "最終工藝。透過疊代放大與局部重繪，將精度提升至 8K 工業標準。" }
  ];
  return (
    <div className="h-full w-full bg-[#fdfdfb] text-stone-900 pt-32 md:pt-40 pb-20 px-8 md:px-12 relative overflow-y-auto custom-scrollbar text-left text-stone-900">
      <div className="fixed top-6 right-6 md:top-10 md:right-10 z-[150] text-stone-900"><button onClick={onClose} className="w-12 h-12 md:w-14 md:h-14 bg-white border border-stone-200 rounded-full hover:bg-stone-900 hover:text-white transition-all shadow-xl flex items-center justify-center text-stone-900 shadow-stone-300"><X size={24} /></button></div>
      <div className="max-w-screen-xl mx-auto text-stone-900 text-left"><div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-32 border-b border-stone-200 pb-12 text-left text-stone-900"><div className="text-left text-stone-900"><span className="text-orange-600 text-[10px] font-black uppercase mb-6 block text-left">Logic</span><h2 className="text-5xl md:text-[9vw] font-black tracking-tighter uppercase leading-none text-stone-900 text-left">Methodology.</h2></div></div><div className="space-y-20 md:space-y-40 text-stone-900 text-left">{roadmap.map((item, i) => (<div key={i} className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-start group text-left text-stone-900"><div className="lg:col-span-2 text-2xl md:text-3xl font-black text-stone-200 italic group-hover:text-orange-500 transition-colors text-left italic">Phase</div><div className="lg:col-span-10 grid md:grid-cols-12 gap-6 md:gap-10 text-left text-stone-900"><div className="md:col-span-7 text-left text-stone-900 text-left"><h4 className="text-2xl md:text-3xl font-black mb-4 md:mb-8 uppercase tracking-tighter text-left text-stone-900">{item.title}</h4><p className="text-stone-500 text-[13px] md:text-lg leading-relaxed text-left text-stone-600">{item.desc}</p></div><div className="md:col-span-5 flex justify-end text-right text-stone-900"><div className="w-20 h-20 md:w-40 md:h-40 bg-white border border-stone-200 flex items-center justify-center text-stone-200 group-hover:text-orange-500 transition-all rounded-3xl shadow-sm">{item.icon}</div></div></div></div>))}</div></div>
    </div>
  );
}

function InquiryPage({ onClose }) {
  const [copied, setCopied] = useState(false);
  const emailAddress = "studio@archive.aigc";

  const handleCopy = () => {
    const textArea = document.createElement("textarea");
    textArea.value = emailAddress;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { console.error(err); }
    document.body.removeChild(textArea);
  };

  const contactProtocols = [
    { id: "MAIL_PRIORITY", title: "Direct Pipeline", sub: "Email Protocol", value: emailAddress, icon: <Mail className="text-orange-500" size={24} />, action: "COPY_ADDRESS", note: "隨時歡迎附上參考圖或專案 Briefing。" },
    { id: "COMM_SYNC", title: "Instant Interface", sub: "Discord / Community", value: "Agent_Archive#0000", icon: <MessageCircle className="text-blue-400" size={24} />, action: "LAUNCH_LINK", link: "https://discord.com", note: "用於即時技術討論或快速諮詢。" },
    { id: "PROF_RELAY", title: "Corporate Network", sub: "LinkedIn / Professional", value: "AIGC Architect", icon: <Linkedin className="text-sky-600" size={24} />, action: "VISIT_PROFILE", link: "https://linkedin.com", note: "查看完整的履歷與正式職業背景。" }
  ];

  return (
    <div className="h-full w-full bg-[#050505] text-white relative flex flex-col justify-start overflow-y-auto custom-scrollbar overflow-x-hidden text-left text-white">
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 text-center text-white">
        <h2 className="text-[25vw] font-black leading-[0.7] uppercase italic opacity-[0.03] select-none tracking-tighter whitespace-nowrap text-white">
          Let's<br/>Interface.
        </h2>
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] overflow-hidden z-10 text-left">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px]"></div>
      </div>
      <div className="fixed top-6 right-6 md:top-10 md:right-10 z-[150] text-white">
        <button onClick={onClose} className="w-12 h-12 md:w-14 md:h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white hover:text-black transition-all flex items-center justify-center text-white pointer-events-auto shadow-2xl active:scale-90"><X size={20} /></button>
      </div>
      <div className="max-w-screen-xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-24 items-start relative z-20 px-6 md:px-12 pt-32 pb-40 text-left text-white">
        <div className="lg:col-span-5 lg:sticky lg:top-40 text-left space-y-12 text-white">
          <div className="space-y-6 text-left text-white">
            <div className="flex items-center gap-3 text-orange-500 text-left">
               <Shield size={16} className="animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-left">Node Operational</span>
            </div>
            <p className="font-sans text-sm md:text-lg text-stone-400 max-w-xs font-medium leading-relaxed italic text-left">
              專業 AIGC 自動化管線。跳過繁瑣表單，直接發起同步協議。
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 text-left text-white">
             <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md text-left text-white">
                <div className="flex justify-between items-center text-stone-500 uppercase text-[9px] font-black mb-4 text-left"><span>Availability</span><Activity size={12} className="text-orange-500" /></div>
                <div className="text-xl font-black text-white tracking-tighter uppercase">READY / Q1 2025</div>
             </div>
             <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md text-left text-white">
                <div className="flex justify-between items-center text-stone-500 uppercase text-[9px] font-black mb-4 text-left"><span>Latency</span><Terminal size={12} className="text-orange-500" /></div>
                <div className="text-xl font-black text-white tracking-tighter uppercase">&lt; 24H SCALE</div>
             </div>
          </div>
        </div>
        <div className="lg:col-span-7 space-y-4 md:space-y-6 w-full text-left text-white">
          {contactProtocols.map((protocol) => (
            <div key={protocol.id} className="group relative p-6 md:p-10 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-500 hover:border-orange-500/50 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] text-left text-white">
              <div className="absolute top-6 right-8 text-[9px] font-mono text-stone-700 uppercase text-left">{protocol.id}</div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 text-left text-white">
                <div className="flex items-start gap-6 text-left text-white">
                  <div className="p-4 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors text-left text-white">
                     {protocol.icon}
                  </div>
                  <div className="space-y-1 text-left text-white">
                    <span className="text-[10px] font-black uppercase text-stone-500 tracking-[0.2em] text-stone-500 text-left">{protocol.sub}</span>
                    <h4 className="text-2xl font-black text-white tracking-tight text-white text-left">{protocol.title}</h4>
                    <p className="text-sm font-mono text-stone-400 pt-2 text-stone-400 text-left">{protocol.value}</p>
                  </div>
                </div>
                <div className="flex justify-end text-right text-white">
                  <button 
                    onClick={protocol.action === "COPY_ADDRESS" ? handleCopy : undefined} 
                    className={`flex items-center gap-3 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${copied && protocol.action === "COPY_ADDRESS" ? 'bg-orange-600 text-white' : 'bg-white text-black hover:bg-orange-500 hover:text-white'}`}
                  >
                    {copied && protocol.action === "COPY_ADDRESS" ? (
                      <CheckCircle2 size={14} />
                    ) : protocol.action === "COPY_ADDRESS" ? (
                      <Copy size={14} />
                    ) : (
                      <ExternalLink size={14} />
                    )} 
                    {copied && protocol.action === "COPY_ADDRESS" ? "Copied" : protocol.action === "COPY_ADDRESS" ? "Copy Email" : "Connect"}
                  </button>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 text-left text-stone-500"><p className="font-sans text-[11px] md:text-xs text-stone-500 italic flex items-center gap-2 text-stone-500 text-left text-white"><Info size={12} className="text-orange-500 opacity-50" /> {protocol.note}</p></div>
            </div>
          ))}
          <div className="pt-8 text-center md:text-right text-stone-800">
             <p className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-800 text-left">Communication Nodes Operational</p>
          </div>
        </div>
      </div>
    </div>
  );
}