import React, { useState, useRef, useEffect } from 'react';
import { 
  CreditCard, 
  Link2, 
  CheckCircle, 
  UploadCloud, 
  FileCheck, 
  Mail, 
  Zap, 
  Check, 
  Copy, 
  Loader2, 
  MailCheck 
} from 'lucide-react';

export default function SellerTerminal() {
  // --- STATE MANAGEMENT ---
  const [isStripeConnected, setIsStripeConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [email, setEmail] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  const fileInputRef = useRef(null);

  // --- LOGIC: STRIPE CONNECTION ---
  const handleStripeConnect = () => {
    setIsConnecting(true);
    // Simulate API Call to Stripe OAuth
    setTimeout(() => {
      setIsConnecting(false);
      setIsStripeConnected(true);
    }, 1500);
  };

  // --- LOGIC: FILE UPLOAD ---
  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setFile(selectedFile);
      }
    }, 100);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // --- LOGIC: GENERATE ASSET ---
  const handleGenerate = () => {
    // Basic Validation
    if (!file || !title || !price) return;

    setIsGenerating(true);
    
    // Simulate Backend Processing
    setTimeout(() => {
      setIsGenerating(false);
      const randomId = Math.random().toString(36).substring(7);
      setGeneratedLink(`quick.as/${randomId}`);
      setShowSuccessModal(true);
    }, 1500);
  };

  const handleReset = () => {
    setFile(null);
    setUploadProgress(0);
    setTitle('');
    setPrice('');
    setEmail('');
    setShowSuccessModal(false);
  };

  // Financial Calcs
  const numPrice = parseFloat(price) || 0;
  const fee = numPrice * 0.05;
  const net = numPrice - fee;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-50 font-sans selection:bg-[#F97316] selection:text-white flex flex-col relative overflow-x-hidden">
      
      {/* INLINE STYLES FOR GRID BG & SCROLLBAR */}
      <style jsx global>{`
        .bg-grid {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0F172A; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>

      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 bg-grid pointer-events-none z-0"></div>

      {/* NAV */}
      <nav className="w-full border-b border-slate-800 bg-[#0F172A]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#F97316] rounded-sm flex items-center justify-center font-mono font-bold text-[#0F172A] text-xl">
              Q
            </div>
            <span className="font-bold text-sm tracking-wider uppercase text-slate-300">
              QuickAsset <span className="text-[#F97316]">Terminal</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-[#1E293B] border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-mono text-slate-400">SYSTEM: ONLINE</span>
            </div>
            <div className="w-8 h-8 bg-slate-700 rounded-full border border-slate-600 flex items-center justify-center text-xs font-bold">
              ME
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN DASHBOARD */}
      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto p-6 md:p-12">
        
        {/* SECTION 1: GATEKEEPER (STRIPE) */}
        <section className="mb-12">
          <div className="bg-[#1E293B] border border-slate-700 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-black/50">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-900 rounded border border-slate-700">
                <CreditCard className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Payout Destination</h2>
                <p className={`text-sm mt-1 ${isStripeConnected ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {isStripeConnected 
                    ? 'Payouts enabled via Stripe Express.' 
                    : 'Link Stripe to enable asset generation.'}
                </p>
              </div>
            </div>
            
            {!isStripeConnected ? (
              <button 
                onClick={handleStripeConnect}
                disabled={isConnecting}
                className="group relative overflow-hidden bg-slate-900 hover:bg-slate-800 text-white border border-slate-600 hover:border-slate-500 px-6 py-3 rounded font-mono text-sm transition-all disabled:opacity-70"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                  {isConnecting ? 'Connecting...' : 'Connect Stripe'}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded text-emerald-400 text-xs font-mono uppercase tracking-wider">
                <CheckCircle className="w-4 h-4" />
                Account Active
              </div>
            )}
          </div>
        </section>

        {/* SECTION 2: ASSET CONFIGURATION */}
        <section 
          className={`transition-opacity duration-500 ${isStripeConnected ? 'opacity-100' : 'opacity-50 pointer-events-none filter blur-sm'}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight">New Asset Configuration</h1>
            <span className="text-xs font-mono text-[#F97316] bg-[#F97316]/10 px-2 py-1 rounded border border-[#F97316]/20">
              draft_mode
            </span>
          </div>

          <div className="grid md:grid-cols-[1.5fr_1fr] gap-8">
            
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              
              {/* 1. Upload */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
                  01 // Asset Payload
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden bg-slate-900/50
                    ${isDragOver ? 'border-[#F97316] bg-slate-800' : 'border-slate-700 hover:border-[#F97316]/50'}
                    ${!file && 'hover:bg-slate-800/50'}
                  `}
                >
                  {!file ? (
                    <div className="flex flex-col items-center z-10">
                      <div className="p-3 bg-[#1E293B] rounded-full mb-3 group-hover:scale-110 transition-transform border border-slate-700">
                        <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-[#F97316] transition-colors" />
                      </div>
                      <p className="text-sm font-medium text-slate-300">Drag file or click to browse</p>
                      <p className="text-xs text-slate-500 mt-1 font-mono">MP4, PDF, ZIP (Max 2GB)</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center z-10 w-full px-8 animate-in fade-in zoom-in duration-300">
                      <FileCheck className="w-8 h-8 text-emerald-500 mb-2" />
                      <p className="text-sm font-mono text-white truncate w-full text-center">{file.name}</p>
                      <p className="text-xs text-emerald-500 mt-1">Upload Complete</p>
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div 
                    className="absolute bottom-0 left-0 h-1 bg-[#F97316] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={(e) => handleFileSelect(e.target.files[0])} 
                    className="hidden" 
                  />
                </div>
              </div>

              {/* 2. Title */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
                  02 // Designation
                </label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q3 Marketing Strategy" 
                  className="w-full bg-[#1E293B] border border-slate-700 rounded p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-all"
                />
              </div>

              {/* 3. Email (Optional) */}
              <div>
                 <label className="flex items-center justify-between text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
                    <span>03 // Targeted Delivery</span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">OPTIONAL</span>
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#F97316] transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@company.com" 
                    className="w-full bg-[#1E293B] border border-slate-700 rounded p-4 pl-11 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-all font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 ml-1">* If left blank, system generates a public link.</p>
              </div>
            </div>

            {/* RIGHT COLUMN: PRICING */}
            <div className="flex flex-col h-full">
              <div className="bg-[#1E293B] border border-slate-700 rounded-lg p-6 flex-1 flex flex-col shadow-xl">
                <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4">
                  Valuation
                </label>
                
                <div className="relative mb-8">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg font-light">$</span>
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00" 
                    className="w-full bg-slate-900 border border-slate-700 rounded p-4 pl-8 text-3xl font-mono font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-[#F97316] transition-all"
                  />
                </div>

                <div className="mt-auto">
                  <div className="bg-slate-900/50 rounded p-4 mb-4 border border-slate-800">
                    <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                      <span>Platform Fee (5%)</span>
                      <span>${fee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-emerald-400 font-bold font-mono border-t border-slate-700 pt-2">
                      <span>Net Revenue</span>
                      <span>${net.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleGenerate}
                    disabled={!file || !title || !price || isGenerating}
                    className="w-full bg-[#F97316] hover:bg-orange-500 text-[#0F172A] font-bold py-4 rounded shadow-lg shadow-orange-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Encrypting...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Generate Asset Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#1E293B] border border-slate-600 rounded-lg shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
            {/* Orange highlight bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#F97316]"></div>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#F97316]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#F97316]/20">
                <Check className="w-8 h-8 text-[#F97316]" />
              </div>
              <h3 className="text-xl font-bold text-white">Asset Deployed</h3>
              <p className="text-sm text-slate-400 mt-1">Ready for transaction.</p>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded p-4 mb-6">
              <p className="text-[10px] text-slate-500 uppercase font-mono mb-2">Secure Link</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-emerald-400 font-mono text-sm truncate">
                  {generatedLink}
                </code>
                <button 
                  className="text-slate-400 hover:text-white transition-colors"
                  onClick={() => navigator.clipboard.writeText(generatedLink)}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {email && (
              <div className="bg-emerald-900/20 border border-emerald-500/20 rounded p-3 mb-6 flex items-start gap-3">
                <MailCheck className="w-4 h-4 text-emerald-500 mt-0.5" />
                <div className="text-xs text-emerald-400">
                  <span className="font-bold">Sent:</span> Invoice emailed directly to <span className="underline">{email}</span>
                </div>
              </div>
            )}

            <button 
              onClick={handleReset}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded transition-colors text-sm"
            >
              Create New Asset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
