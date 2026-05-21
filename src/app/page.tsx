"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { 
  Sparkles, 
  Send, 
  FileText, 
  FolderOpen, 
  Loader2, 
  Copy, 
  Check, 
  Terminal, 
  ArrowRight, 
  RefreshCw, 
  Globe, 
  Mail, 
  Share2, 
  Search, 
  Download, 
  ChevronRight, 
  ChevronDown, 
  BookOpen, 
  FileCode,
  FileCheck,
  AlertTriangle,
  Play,
  History
} from "lucide-react";
import Link from "next/link";

// Recursive Collapsible JSON Node Tree Viewer
interface JSONViewerProps {
  data: any;
}

function JSONViewer({ data }: JSONViewerProps) {
  const [collapsedKeys, setCollapsedKeys] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleCollapse = (path: string) => {
    setCollapsedKeys(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderValue = (val: any, path: string, depth: number): React.ReactNode => {
    if (val === null) {
      return <span className="text-slate-400 dark:text-slate-500 font-mono text-xs">null</span>;
    }
    if (typeof val === 'boolean') {
      return <span className="text-purple-600 dark:text-purple-400 font-mono text-xs font-semibold">{val ? 'true' : 'false'}</span>;
    }
    if (typeof val === 'number') {
      return <span className="text-amber-600 dark:text-amber-400 font-mono text-xs font-semibold">{val}</span>;
    }
    if (typeof val === 'string') {
      return <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs break-words whitespace-pre-wrap">"{val}"</span>;
    }
    if (Array.isArray(val)) {
      if (val.length === 0) return <span className="text-slate-400 dark:text-slate-500 font-mono text-xs">[]</span>;
      const isCollapsed = collapsedKeys[path] ?? (depth > 1);
      
      return (
        <span className="font-mono text-xs">
          <button 
            type="button"
            onClick={() => toggleCollapse(path)} 
            className="inline-flex items-center text-slate-400 hover:text-indigo-500 transition duration-150 focus:outline-none select-none cursor-pointer"
          >
            {isCollapsed ? <ChevronRight size={14} className="mr-0.5" /> : <ChevronDown size={14} className="mr-0.5" />}
            <span className="text-indigo-500 dark:text-indigo-400 text-xs font-medium">Array({val.length})</span>
          </button>
          {!isCollapsed && (
            <span className="block pl-4 border-l border-slate-200/80 dark:border-slate-800 ml-1.5 my-1 space-y-1">
              {val.map((item, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="text-slate-400 dark:text-slate-500 mr-2 select-none">{idx}:</span>
                  {renderValue(item, `${path}[${idx}]`, depth + 1)}
                  {idx < val.length - 1 && <span className="text-slate-400 dark:text-slate-500">,</span>}
                </div>
              ))}
            </span>
          )}
          {isCollapsed && <span className="text-slate-400 dark:text-slate-500 text-xs ml-1 select-none">[...]</span>}
        </span>
      );
    }
    if (typeof val === 'object') {
      const keys = Object.keys(val);
      if (keys.length === 0) return <span className="text-slate-400 dark:text-slate-500 font-mono text-xs">{"{}"}</span>;
      const isCollapsed = collapsedKeys[path] ?? (depth > 1);

      return (
        <span className="font-mono text-xs">
          <button 
            type="button"
            onClick={() => toggleCollapse(path)} 
            className="inline-flex items-center text-slate-400 hover:text-indigo-500 transition duration-150 focus:outline-none select-none cursor-pointer"
          >
            {isCollapsed ? <ChevronRight size={14} className="mr-0.5" /> : <ChevronDown size={14} className="mr-0.5" />}
            <span className="text-violet-500 dark:text-violet-400 text-xs font-medium">Object({keys.length})</span>
          </button>
          {!isCollapsed && (
            <span className="block pl-4 border-l border-slate-200/80 dark:border-slate-800 ml-1.5 my-1 space-y-1">
              {keys.map((key, idx) => (
                <div key={key} className="flex items-start">
                  <span className="text-slate-600 dark:text-slate-300 font-semibold mr-1.5">"{key}":</span>
                  {renderValue(val[key], `${path}.${key}`, depth + 1)}
                  {idx < keys.length - 1 && <span className="text-slate-400 dark:text-slate-500">,</span>}
                </div>
              ))}
            </span>
          )}
          {isCollapsed && <span className="text-slate-400 dark:text-slate-500 text-xs ml-1 select-none">{"{...}"}</span>}
        </span>
      );
    }
    return <span className="font-mono text-xs">{String(val)}</span>;
  };

  return (
    <div className="relative group text-left">
      <div className="absolute right-3 top-3 z-10 flex gap-2">
        <button 
          onClick={copyToClipboard}
          className="p-1.5 bg-white dark:bg-slate-900/90 text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm transition duration-200 flex items-center gap-1.5 text-xs font-medium select-none cursor-pointer"
          title="Copy full JSON"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-500" />
              <span className="text-emerald-500 text-[10px]">Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span className="text-[10px] hidden sm:inline">Copy JSON</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-900 rounded-2xl leading-relaxed">
        {renderValue(data, 'root', 0)}
      </div>
    </div>
  );
}

export default function Home() {
  const [brief, setBrief] = useState({ topic: "", campaign_goal: "", brand_voice: "", target_audience: "", keywords: "", additional_context: "" });
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [loadingFile, setLoadingFile] = useState(false);
  const [copiedFile, setCopiedFile] = useState(false);

  // Form error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    
    // Quick validation
    const newErrors: Record<string, string> = {};
    if (!brief.topic.trim()) newErrors.topic = "Topic is required";
    if (!brief.campaign_goal.trim()) newErrors.campaign_goal = "Campaign Goal is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setRunning(true);
    setResult(null);
    setSelectedFile(null);
    const payload = {
      brief: {
        topic: brief.topic,
        campaign_goal: brief.campaign_goal,
        brand_voice: brief.brand_voice,
        target_audience: brief.target_audience,
        keywords: brief.keywords ? brief.keywords.split(',').map(s=>s.trim()) : [],
        additional_context: brief.additional_context
      }
    };

    try {
      const res = await fetch('/api/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      setResult(data);
      if (data.run_id) {
        setSelectedFile(null);
      }
    } catch (err) {
      setResult({ error: String(err) });
    } finally {
      setRunning(false);
    }
  }

  async function loadSample() {
    try {
      const res = await fetch('/sample_brief.json');
      const data = await res.json();
      setBrief({
        topic: data.topic || '',
        campaign_goal: data.campaign_goal || '',
        brand_voice: data.brand_voice || '',
        target_audience: data.target_audience || '',
        keywords: Array.isArray(data.keywords) ? data.keywords.join(', ') : (data.keywords || ''),
        additional_context: data.additional_context || ''
      });
      setErrors({});
    } catch (e) {
      console.error('Failed to load sample brief', e);
      alert('Failed to load sample brief');
    }
  }

  async function loadFile(filename: string) {
    if (!result?.run_id) return;
    setLoadingFile(true);
    try {
      const res = await fetch(`/api/files?run=${result.run_id}&file=${filename}`);
      if (!res.ok) throw new Error(`Failed to load ${filename}`);
      const text = await res.text();
      setFileContent(text);
      setSelectedFile(filename);
    } catch (e) {
      console.error('Failed to load file', e);
      setFileContent(`Failed to load file: ${String(e)}`);
      setSelectedFile(filename);
    } finally {
      setLoadingFile(false);
    }
  }

  const copyFileToClipboard = () => {
    navigator.clipboard.writeText(fileContent);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const downloadFile = () => {
    if (!selectedFile) return;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const knownFiles = ['brief.json', 'research.json', 'blog_draft.json', 'blog.md', 'seo.json', 'seo_blog.md', 'social.json', 'social.md', 'email.json', 'email.md', 'final_package.json', 'run.log'];

  const getFileCategory = (filename: string) => {
    if (filename === 'brief.json') return { label: 'Brief Input', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' };
    if (filename.includes('research') || filename.includes('seo.json')) return { label: 'Research & SEO', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' };
    if (filename.includes('blog')) return { label: 'Blogs & Copy', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' };
    if (filename.includes('social') || filename.includes('email')) return { label: 'Distribution Kits', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' };
    if (filename.includes('final_package')) return { label: 'Artifact Pack', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' };
    return { label: 'Terminal Logs', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' };
  };

  const renderContent = () => {
    if (loadingFile) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 className="animate-spin text-indigo-500 mb-3" size={32} />
          <p className="text-sm font-medium animate-pulse">Retrieving artifact content...</p>
        </div>
      );
    }
    
    if (!selectedFile) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <FolderOpen size={48} className="text-slate-300 dark:text-slate-700 mb-4 stroke-[1.5]" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Select a generated file from above to view output details</p>
        </div>
      );
    }

    const ext = selectedFile.split('.').pop();

    if (ext === 'json') {
      try {
        const json = JSON.parse(fileContent);
        return <JSONViewer data={json} />;
      } catch {
        return (
          <div className="relative group">
            <pre className="text-xs overflow-auto font-mono bg-slate-950 text-slate-300 p-5 rounded-2xl whitespace-pre-wrap break-words border border-slate-900 leading-relaxed max-h-[500px]">
              {fileContent}
            </pre>
          </div>
        );
      }
    }

    if (ext === 'md') {
      return (
        <div className="bg-white/50 dark:bg-slate-900/30 p-6 sm:p-8 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-y-auto max-h-[550px] shadow-inner text-left">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-2xl font-extrabold mt-7 mb-4 text-slate-900 dark:text-slate-50 border-b border-slate-200/80 dark:border-slate-850 pb-2.5 tracking-tight" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-6 mb-3 text-slate-800 dark:text-slate-100 tracking-tight" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-5 mb-2 text-slate-800 dark:text-slate-200 tracking-tight" {...props} />,
              h4: ({node, ...props}) => <h4 className="text-base font-semibold mt-4 mb-2 text-slate-800 dark:text-slate-300" {...props} />,
              p: ({node, ...props}) => <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed mb-4" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-sm text-slate-600 dark:text-slate-350 space-y-1.5" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 text-sm text-slate-600 dark:text-slate-350 space-y-1.5" {...props} />,
              li: ({node, ...props}) => <li className="mb-1" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold text-slate-950 dark:text-white" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500/80 pl-4 italic my-4 text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20 py-2 pr-2 rounded-r-lg" {...props} />,
              hr: ({node, ...props}) => <hr className="my-6 border-t border-slate-200/80 dark:border-slate-800" {...props} />,
              code: ({node, className, children, ...props}: any) => {
                const isInline = !className || !className.includes('language-');
                if (isInline) {
                  return <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded text-rose-500 dark:text-rose-450 font-semibold" {...props}>{children}</code>;
                }
                return <code className="block font-mono text-xs text-inherit" {...props}>{children}</code>;
              },
              pre: ({node, ...props}) => <pre className="bg-slate-950 text-slate-100 p-4 rounded-xl overflow-x-auto my-4 border border-slate-900 font-mono text-xs leading-relaxed" {...props} />,
              table: ({node, ...props}) => <div className="overflow-x-auto my-4"><table className="min-w-full border-collapse border border-slate-200 dark:border-slate-800 text-sm" {...props} /></div>,
              thead: ({node, ...props}) => <thead className="bg-slate-50 dark:bg-slate-900/60" {...props} />,
              tbody: ({node, ...props}) => <tbody className="divide-y divide-slate-200 dark:divide-slate-800" {...props} />,
              tr: ({node, ...props}) => <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors" {...props} />,
              th: ({node, ...props}) => <th className="border border-slate-200 dark:border-slate-800 px-4 py-2 text-left font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider" {...props} />,
              td: ({node, ...props}) => <td className="border border-slate-200 dark:border-slate-800 px-4 py-2 text-slate-600 dark:text-slate-350" {...props} />,
            }}
          >
            {fileContent}
          </ReactMarkdown>
        </div>
      );
    }

    if (selectedFile === 'run.log') {
      return (
        <div className="relative overflow-hidden border border-slate-800 rounded-2xl shadow-2xl bg-slate-950 font-mono text-xs">
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 block"></span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold select-none">run.log — shell</span>
            <div className="w-12"></div>
          </div>
          {/* Terminal Log Console */}
          <div className="p-5 overflow-auto max-h-[400px] text-slate-300 space-y-1.5 font-mono whitespace-pre-wrap leading-relaxed select-text text-left">
            {fileContent.split('\n').map((line, idx) => {
              let lineClass = "text-slate-400";
              if (line.includes('[ERROR]') || line.includes('Error')) lineClass = "text-rose-400 font-semibold";
              else if (line.includes('[SUCCESS]') || line.includes('Finished') || line.includes('completed')) lineClass = "text-emerald-400";
              else if (line.includes('[INFO]') || line.includes('Agent')) lineClass = "text-indigo-400";
              else if (line.includes('[WARNING]')) lineClass = "text-amber-400";

              return (
                <div key={idx} className={`${lineClass} border-l border-transparent hover:border-indigo-500/30 pl-2 transition-colors`}>
                  <span className="text-slate-700 mr-3 select-none text-[10px]">{String(idx + 1).padStart(3, '0')}</span>
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <pre className="text-xs overflow-auto font-mono bg-slate-50 dark:bg-slate-950/30 p-5 border border-slate-100 dark:border-slate-800 rounded-2xl whitespace-pre-wrap leading-relaxed max-h-[500px]">
        {fileContent}
      </pre>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/20 dark:bg-slate-950/20 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-200/10 dark:bg-indigo-900/5 rounded-full filter blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-200/10 dark:bg-purple-900/5 rounded-full filter blur-[120px] -z-10 pointer-events-none" />

      {/* Main Workspace Frame */}
      <div className="w-full max-w-7xl mx-auto flex-grow flex flex-col space-y-8">
        
        {/* Navigation / Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl shadow-lg shadow-indigo-500/20">
                <Sparkles className="text-white" size={20} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 dark:from-slate-50 dark:via-indigo-100 dark:to-purple-200 bg-clip-text text-transparent">
                Marketing Agent Studio
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-800/40 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                RAG Engine Active
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Orchestrate autonomous AI agents to research markets, write rich blogs, optimize SEO, and generate newsletter/social campaigns.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/runs"
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all select-none cursor-pointer"
            >
              <History size={13} />
              View History
            </Link>
            <button 
              className="px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-[0.98] select-none cursor-pointer" 
              onClick={loadSample}
            >
              <RefreshCw size={13} className="text-slate-400 group-hover:rotate-180 transition-transform duration-300" />
              Load Sample Brief
            </button>
          </div>
        </header>

        {/* Dashboard Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Panel (Brief Configurator) */}
          <section className="lg:col-span-5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-xl shadow-slate-100/50 dark:shadow-none p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FileCheck size={18} className="text-indigo-500" />
                Campaign Brief
              </h2>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border border-indigo-200/20 px-2 py-0.5 rounded-md font-semibold select-none">
                Input Console
              </span>
            </div>

            <form onSubmit={submit} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide">Topic / Industry Focus <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <input 
                    placeholder="e.g. AI-driven medical imaging software for clinical workflows"
                    className={`w-full bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950/60 focus:bg-white dark:focus:bg-slate-950 border ${errors.topic ? 'border-rose-400 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500/10 focus:border-indigo-500/80'} rounded-xl px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-4`} 
                    value={brief.topic} 
                    onChange={e=>{
                      setBrief({...brief, topic: e.target.value});
                      if(errors.topic) setErrors({...errors, topic: ""});
                    }} 
                  />
                </div>
                {errors.topic && <p className="text-[10px] text-rose-500 font-medium">{errors.topic}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide">Campaign Goal <span className="text-rose-500">*</span></label>
                <input 
                  placeholder="e.g. Generate 50 demo signups from hospital radiologists"
                  className={`w-full bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950/60 focus:bg-white dark:focus:bg-slate-950 border ${errors.campaign_goal ? 'border-rose-400 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500/10 focus:border-indigo-500/80'} rounded-xl px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-4`} 
                  value={brief.campaign_goal} 
                  onChange={e=>{
                    setBrief({...brief, campaign_goal: e.target.value});
                    if(errors.campaign_goal) setErrors({...errors, campaign_goal: ""});
                  }} 
                />
                {errors.campaign_goal && <p className="text-[10px] text-rose-500 font-medium">{errors.campaign_goal}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide">Brand Voice</label>
                  <input 
                    placeholder="e.g. Authoritative, professional"
                    className="w-full bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950/60 focus:bg-white dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/80 rounded-xl px-3 py-2.5 text-sm transition-all focus:outline-none" 
                    value={brief.brand_voice} 
                    onChange={e=>setBrief({...brief, brand_voice: e.target.value})} 
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide">Target Audience</label>
                  <input 
                    placeholder="e.g. Hospital decision makers"
                    className="w-full bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950/60 focus:bg-white dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/80 rounded-xl px-3 py-2.5 text-sm transition-all focus:outline-none" 
                    value={brief.target_audience} 
                    onChange={e=>setBrief({...brief, target_audience: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide">SEO Keywords (comma separated)</label>
                <input 
                  placeholder="e.g. AI radiology, medical imaging AI, clinical software"
                  className="w-full bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950/60 focus:bg-white dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/80 rounded-xl px-3 py-2.5 text-sm transition-all focus:outline-none" 
                  value={brief.keywords} 
                  onChange={e=>setBrief({...brief, keywords: e.target.value})} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide">Additional Context & Core Competence</label>
                <textarea 
                  placeholder="Provide specifications, competitors, unique selling propositions (USPs), pricing context, or product datasheets..."
                  className="w-full bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950/60 focus:bg-white dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/80 rounded-xl px-3 py-2.5 text-sm transition-all focus:outline-none" 
                  rows={4} 
                  value={brief.additional_context} 
                  onChange={e=>setBrief({...brief, additional_context: e.target.value})} 
                />
              </div>

              <div className="pt-2">
                <button 
                  className={`w-full py-3.5 px-4 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99] select-none ${
                    running 
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700/60' 
                      : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 text-white shadow-indigo-500/20 pulse-glow-button hover:shadow-indigo-500/35 hover:-translate-y-0.5'
                  }`} 
                  type="submit" 
                  disabled={running}
                >
                  {running ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Executing Pipeline Agents...
                    </>
                  ) : (
                    <>
                      <Play size={15} fill="currentColor" />
                      Run Agent Workflow
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Right Panel (Interactive Workspace Explorer) */}
          <section className="lg:col-span-7 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-xl shadow-slate-100/50 dark:shadow-none p-6 min-h-[660px] flex flex-col justify-between overflow-hidden">
            
            {/* IDLE STATE */}
            {!running && !result && (
              <div className="flex-grow flex flex-col justify-center text-center py-6">
                <div className="max-w-md mx-auto space-y-6">
                  {/* Title & Badge */}
                  <div className="space-y-2">
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Orchestrator Blueprint
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Autonomous Multi-Agent Cycle</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Your campaign brief is parsed by a coordinated network of LangGraph agents. Watch them collaborate in real-time or review the output packages below.
                    </p>
                  </div>

                  {/* Flow Diagram */}
                  <div className="relative p-6 bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-900 rounded-3xl overflow-hidden mt-2 select-none">
                    
                    {/* Connection Lines (Simulated Grid/Flow) */}
                    <div className="absolute inset-0 flex items-center justify-around px-8 opacity-25 pointer-events-none">
                      <div className="h-[2px] w-full border-t border-dashed border-slate-400 dark:border-slate-600"></div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 relative z-10">
                      {/* Node 1: Brief */}
                      <div className="flex flex-col items-center group">
                        <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-400/30 flex items-center justify-center text-blue-500 dark:text-blue-400 transition-transform group-hover:scale-110 shadow-sm">
                          <FileText size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-2">Brief Config</span>
                        <span className="text-[8px] text-slate-400 block dark:text-slate-500">Intakes targets</span>
                      </div>

                      {/* Node 2: Research Agent */}
                      <div className="flex flex-col items-center group">
                        <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-900/40 border-2 border-emerald-400/30 flex items-center justify-center text-emerald-500 dark:text-emerald-400 transition-transform group-hover:scale-110 shadow-sm">
                          <Globe size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-2">Research Bot</span>
                        <span className="text-[8px] text-slate-400 block dark:text-slate-500">Fetches insights</span>
                      </div>

                      {/* Node 3: Copywriter */}
                      <div className="flex flex-col items-center group">
                        <div className="w-11 h-11 rounded-full bg-purple-100 dark:bg-purple-900/40 border-2 border-purple-400/30 flex items-center justify-center text-purple-500 dark:text-purple-400 transition-transform group-hover:scale-110 shadow-sm">
                          <BookOpen size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-2">Copywriter</span>
                        <span className="text-[8px] text-slate-400 block dark:text-slate-500">Drafts articles</span>
                      </div>

                      {/* Node 4: SEO Agent */}
                      <div className="flex flex-col items-center group">
                        <div className="w-11 h-11 rounded-full bg-rose-100 dark:bg-rose-900/40 border-2 border-rose-400/30 flex items-center justify-center text-rose-500 dark:text-rose-400 transition-transform group-hover:scale-110 shadow-sm">
                          <Search size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-2">SEO Optimizer</span>
                        <span className="text-[8px] text-slate-400 block dark:text-slate-500">Optimizes metadata</span>
                      </div>

                      {/* Node 5: Social Architect */}
                      <div className="flex flex-col items-center group">
                        <div className="w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-900/40 border-2 border-amber-400/30 flex items-center justify-center text-amber-500 dark:text-amber-400 transition-transform group-hover:scale-110 shadow-sm">
                          <Share2 size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-2">Social Hub</span>
                        <span className="text-[8px] text-slate-400 block dark:text-slate-500">Hashtags & tweets</span>
                      </div>

                      {/* Node 6: Email Lead */}
                      <div className="flex flex-col items-center group">
                        <div className="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-900/40 border-2 border-indigo-400/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400 transition-transform group-hover:scale-110 shadow-sm">
                          <Mail size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-2">Email Gen</span>
                        <span className="text-[8px] text-slate-400 block dark:text-slate-500">Sequence flows</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-indigo-500 font-semibold bg-indigo-500/5 py-3.5 px-5 rounded-2xl border border-indigo-500/10">
                    <ArrowRight size={14} className="animate-pulse" />
                    Configure inputs & submit to launch agents.
                  </div>
                </div>
              </div>
            )}

            {/* RUNNING STATE */}
            {running && !result && (
              <div className="flex-grow flex flex-col justify-center py-6">
                <div className="max-w-md mx-auto w-full space-y-6 text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 border-r-purple-500 animate-spin"></div>
                    <Terminal className="absolute text-indigo-500 dark:text-indigo-400" size={24} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Executing Marketing Pipeline</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-6">
                      LangGraph Agents are collaborating synchronously. Fetching competitors, generating target layouts, and parsing packages.
                    </p>
                  </div>

                  {/* Execution Timeline (Simulated steps) */}
                  <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 text-left space-y-3.5 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold">✓</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Validating brief & initializing layout...</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/10 border-2 border-indigo-500/30 text-indigo-500 dark:text-indigo-400 flex items-center justify-center"><Loader2 size={10} className="animate-spin" /></span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold animate-pulse">Running Web Research Agents...</span>
                    </div>
                    <div className="flex items-center gap-3 opacity-50">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 flex items-center justify-center text-[10px] font-bold">3</span>
                      <span className="text-slate-600 dark:text-slate-400">Copywriting raw draft generation...</span>
                    </div>
                    <div className="flex items-center gap-3 opacity-50">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 flex items-center justify-center text-[10px] font-bold">4</span>
                      <span className="text-slate-600 dark:text-slate-400">Performing SEO optimization audits...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RESULTS STATE */}
            {result && !result.error && (
              <div className="flex-grow flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  {/* Run Info & Title */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Execution Artifacts</h3>
                      <p className="text-[10px] text-slate-400 font-mono">Run ID: {result.run_id}</p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/40 rounded-lg text-[10px] font-bold">
                      Completed successfully
                    </span>
                  </div>

                  {/* Files Select Grid */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 select-none">
                      <FolderOpen size={14} className="text-indigo-400" />
                      Generated Outputs
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {knownFiles.map((file) => {
                        const cat = getFileCategory(file);
                        const isSelected = selectedFile === file;
                        return (
                          <button
                            key={file}
                            onClick={() => loadFile(file)}
                            disabled={loadingFile}
                            className={`p-2.5 rounded-xl border text-[10px] font-semibold text-left flex flex-col justify-between gap-2 shadow-sm transition duration-200 group active:scale-[0.98] select-none cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 dark:border-indigo-500 shadow-indigo-600/10'
                                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-700 hover:bg-indigo-500/[0.02] text-slate-800 dark:text-slate-200'
                            } ${loadingFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className="flex items-center gap-1.5 w-full">
                              {file.endsWith('.json') ? (
                                <FileCode size={14} className={isSelected ? 'text-white' : 'text-indigo-500 group-hover:scale-105 transition-transform'} />
                              ) : file.endsWith('.log') ? (
                                <Terminal size={14} className={isSelected ? 'text-white' : 'text-slate-500 group-hover:scale-105 transition-transform'} />
                              ) : (
                                <FileText size={14} className={isSelected ? 'text-white' : 'text-purple-500 group-hover:scale-105 transition-transform'} />
                              )}
                              <span className="truncate w-full font-mono text-[9px]">{file}</span>
                            </div>
                            
                            <span className={`px-1.5 py-0.5 rounded text-[8px] w-fit font-bold ${
                              isSelected ? 'bg-white/20 text-white' : cat.color
                            }`}>
                              {cat.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* File Workspace Preview */}
                <div className="mt-4 flex-grow flex flex-col border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden bg-white/40 dark:bg-slate-950/20">
                  {selectedFile && (
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-slate-500 dark:text-slate-400" />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">{selectedFile}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={copyFileToClipboard}
                          className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-indigo-500 text-slate-400 dark:text-slate-500 rounded-lg transition select-none cursor-pointer"
                          title="Copy file text"
                        >
                          {copiedFile ? <Check size={14} className="text-emerald-500 animate-scale" /> : <Copy size={14} />}
                        </button>
                        <button
                          onClick={downloadFile}
                          className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-indigo-500 text-slate-400 dark:text-slate-500 rounded-lg transition select-none cursor-pointer"
                          title="Download file"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 flex-grow overflow-auto max-h-[480px]">
                    {renderContent()}
                  </div>
                </div>
              </div>
            )}

            {/* ERROR DISPLAY */}
            {result?.error && (
              <div className="flex-grow flex flex-col justify-center py-10">
                <div className="max-w-md mx-auto bg-rose-50 dark:bg-rose-950/20 border border-rose-200/40 dark:border-rose-900/40 rounded-3xl p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-500 dark:text-rose-400 mx-auto">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300">Pipeline Execution Interrupted</h3>
                    <p className="text-xs text-rose-600/80 dark:text-rose-400/80 leading-relaxed font-mono p-3 bg-white/80 dark:bg-slate-950/40 border border-rose-200/20 rounded-xl max-h-32 overflow-auto text-left">
                      {result.error}
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Verify configuration settings or API credentials inside settings directories and re-run.
                  </p>
                </div>
              </div>
            )}

            {/* Footer Workspace Info */}
            <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <Terminal size={10} />
                LangGraph v1.3.2 Workspace
              </span>
              <span>
                System: Local Agent Nodes
              </span>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
