"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

// 1. KITA PINDAHKAN SEMUA LOGIKA KE DALAM KOMPONEN "HasilContent"
function HasilContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nis = searchParams.get("nis") || "";

  const [loading, setLoading] = useState(true);
  const [dataSiswa, setDataSiswa] = useState<any>(null);
  const [error, setError] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!nis) {
      router.push("/");
      return;
    }

    // PENGAMAN WAKTU (Mencegah Bypass URL)
    const targetDate = new Date("2026-05-28T01:30:00+07:00");
    const now = new Date();
    if (now.getTime() < targetDate.getTime()) {
      alert("Portal pengumuman belum dibuka!");
      router.push("/");
      return;
    }

    // Efek loading dramatis
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/cek?nis=${nis}`);
        const data = await res.json();
        
        setTimeout(() => {
          if (data.success) {
            setDataSiswa(data.data);
          } else {
            setError(true);
          }
          setLoading(false);
          setTimeout(() => setShowContent(true), 100);
        }, 1500); 
      } catch (err) {
        setTimeout(() => {
          setError(true);
          setLoading(false);
          setShowContent(true);
        }, 1500);
      }
    };

    fetchData();
  }, [nis, router]);

  // ANIMASI LOADING DEG-DEGAN
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050a17] flex flex-col items-center justify-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="w-32 h-32 relative flex items-center justify-center mb-8">
          <div className="absolute inset-0 border-t-4 border-amber-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-r-4 border-blue-500 rounded-full animate-[spin_1.5s_reverse_linear_infinite]"></div>
          <div className="absolute inset-4 border-b-4 border-white/30 rounded-full animate-pulse"></div>
          <img src="/logo-smp.png" alt="Logo" className="w-12 h-12 rounded-full z-10 animate-pulse opacity-50" onError={(e) => { e.currentTarget.src = "https://placehold.co/48?text=L"; }} />
        </div>
        <h2 className="text-2xl font-black tracking-widest animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">MENGAKSES SERVER...</h2>
        <p className="text-blue-300/50 mt-3 font-mono text-sm tracking-[0.3em] uppercase">Verifikasi Nomor Induk: {nis}</p>
      </div>
    );
  }

  // JIKA DATA TIDAK DITEMUKAN / ERROR
  if (error || !dataSiswa) {
    return (
      <div className="min-h-screen bg-[#050a17] flex flex-col items-center justify-center p-4 relative">
        <div className="absolute inset-0 bg-red-900/10 blur-[100px]"></div>
        <div className={`bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 max-w-md w-full rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 text-center relative z-10 transition-all duration-700 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">DATA TIDAK DITEMUKAN</h2>
          <p className="text-slate-400 mb-8 font-light">NISN <span className="font-bold text-amber-500">{nis}</span> tidak terdaftar dalam sistem kelulusan tahun ini.</p>
          <button onClick={() => router.push("/")} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 rounded-xl transition-all tracking-widest uppercase">
            Kembali Cari NISN Lain
          </button>
        </div>
      </div>
    );
  }

  // TEMA WARNA BERDASARKAN STATUS
  const isLulus = dataSiswa.status === "LULUS";
  const bgBase = isLulus ? "bg-[#022c22]" : "bg-[#4c0519]";
  const glowAccent = isLulus ? "bg-emerald-500/20" : "bg-rose-500/20";
  const cardBorder = isLulus ? "border-emerald-500/40" : "border-rose-500/40";
  const textHighlight = isLulus ? "text-emerald-400" : "text-rose-400";
  const statusBg = isLulus ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-rose-500/10 border-rose-500/30 text-rose-300";

  return (
    <div className={`min-h-screen ${bgBase} font-sans relative overflow-hidden transition-colors duration-1000 flex flex-col`}>
      
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none mix-blend-overlay"></div>
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] rounded-full blur-[150px] ${glowAccent} pointer-events-none`}></div>
      <div className={`absolute bottom-0 right-0 w-[50%] h-[50%] rounded-full blur-[120px] ${glowAccent} pointer-events-none`}></div>

      <div className="relative z-20 p-4 md:p-6 flex justify-between items-center print:hidden">
        <button onClick={() => router.push("/")} className="bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Kembali
        </button>
        {isLulus && (
          <button onClick={() => window.print()} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center gap-2 uppercase tracking-wide">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Cetak Bukti Lulus
          </button>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10 pb-12">
        <div className={`w-full max-w-3xl bg-[#0f172a]/60 backdrop-blur-2xl border ${cardBorder} rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-1000 transform ${showContent ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'}`}>
          
          <div className="p-8 border-b border-white/10 text-center relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${isLulus ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-rose-400 to-red-500'}`}></div>
            <img src="/logo-smp.png" alt="Logo SMPN 1 Jaten" className="w-20 h-20 mx-auto mb-5 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" onError={(e) => { e.currentTarget.src = "https://placehold.co/80x80?text=Logo"; }} />
            <p className="text-xs md:text-sm font-bold text-slate-400 tracking-[0.3em] uppercase mb-2">Sistem Informasi Kelulusan 2026</p>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider drop-shadow-md">{dataSiswa.nama}</h2>
            <div className="mt-4 inline-flex items-center gap-3 bg-black/30 px-5 py-2 rounded-full border border-white/5">
              <span className="text-slate-400 text-sm uppercase tracking-widest font-semibold">NISN</span>
              <span className="text-amber-400 font-mono text-lg font-bold tracking-wider">{dataSiswa.nis}</span>
            </div>
          </div>

          <div className="p-8 md:p-12 text-center relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <img src="/logo-smp.png" alt="watermark" className="w-64 h-64 grayscale" />
            </div>

            <p className="text-slate-400 font-medium mb-4 uppercase tracking-[0.2em] text-sm">Menyatakan bahwa siswa di atas:</p>
            
            <div className={`inline-block border-2 ${statusBg} rounded-3xl px-12 md:px-20 py-6 md:py-8 mb-8 shadow-2xl backdrop-blur-sm relative overflow-hidden group`}>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <h1 className={`text-5xl md:text-7xl font-black ${textHighlight} tracking-tighter drop-shadow-[0_0_20px_currentColor]`}>
                {dataSiswa.status}
              </h1>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 text-left max-w-2xl mx-auto relative z-10">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${isLulus ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">Catatan Sekolah</p>
                  <p className="text-white/90 text-lg leading-relaxed font-light">
                    {dataSiswa.pesan || (isLulus 
                      ? "Selamat! Usaha dan kerja kerasmu selama 3 tahun ini telah membuahkan hasil. Teruslah bersinar dan semoga sukses melangkah ke jenjang yang lebih tinggi!" 
                      : "Jangan patah semangat! Kegagalan hari ini bukanlah akhir dari segalanya, melainkan awal untuk bangkit dan menjadi jauh lebih baik lagi.")}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        @media print {
          body { background: white !important; color: black !important; }
          .min-h-screen { background: none !important; }
          .backdrop-blur-2xl, .bg-black\\/40, .bg-\\[\\#0f172a\\]\\/60 { background: white !important; backdrop-filter: none !important; border: 2px solid #ccc !important; box-shadow: none !important; color: black !important; }
          h2, h1, p, span { color: black !important; text-shadow: none !important; }
          .text-amber-400 { color: #000 !important; }
          img { filter: drop-shadow(0 0 0 white) !important; }
        }
      `}</style>
    </div>
  );
}

// 2. KITA BUNGKUS "HasilContent" DENGAN <Suspense> DI KOMPONEN UTAMA (HasilPage)
export default function HasilPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050a17] flex items-center justify-center text-white">
        <h2 className="text-2xl font-black tracking-widest animate-pulse text-amber-500">MEMUAT HALAMAN...</h2>
      </div>
    }>
      <HasilContent />
    </Suspense>
  );
}