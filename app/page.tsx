"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [nis, setNis] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // STATE BARU: Untuk mengunci tombol
  const [isOpened, setIsOpened] = useState(false); 

  // Logika Countdown
  useEffect(() => {
    const targetDate = new Date("2026-05-28T01:30:00+07:00");

    const checkTime = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsOpened(true); // <-- BUKA GEMBOK
        return true;
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
        return false;
      }
    };

    // Cek langsung saat web pertama kali dibuka
    const alreadyOpened = checkTime();

    // Jika belum buka, jalankan timer mundurnya
    if (!alreadyOpened) {
      const interval = setInterval(() => {
        const opened = checkTime();
        if (opened) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nis.trim()) return;
    
    setIsLoading(true);
    router.push(`/hasil?nis=${nis}`);
  };

  return (
    <div className="min-h-screen bg-[#0a1128] font-sans selection:bg-amber-500 selection:text-white relative overflow-hidden flex flex-col">
      
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-amber-500/10 blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="flex-1 container mx-auto px-4 pt-12 pb-20 max-w-4xl relative z-10">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-10">
          <div className="inline-block p-1 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 mb-6 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform duration-500">
            <img
              src="/logo-smp.png"
              alt="Logo SMPN 1 Jaten"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border-4 border-white object-cover"
              onError={(e) => { e.currentTarget.src = "https://placehold.co/128x128?text=Logo"; }}
            />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-wider mb-2 drop-shadow-lg">
            PENGUMUMAN KELULUSAN
          </h1>
          <h2 className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 mb-1">
            SMP NEGERI 1 JATEN
          </h2>
          <p className="text-blue-200 text-lg md:text-xl font-medium tracking-widest">
            TAHUN AJARAN 2025/2026
          </p>
        </div>

        {/* COUNTDOWN SECTION */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl mb-8 hover:bg-white/15 transition-colors duration-500">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 mb-8">
            <div className="text-center">
              <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-1">Tanggal Dibuka</p>
              <p className="text-white text-xl font-bold">Kamis, 28 Mei 2026</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-1">Waktu Pengumuman</p>
              <p className="text-white text-xl font-bold">02:00 WIB</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto">
            {[
              { label: 'HARI', value: timeLeft.days },
              { label: 'JAM', value: timeLeft.hours },
              { label: 'MENIT', value: timeLeft.minutes },
              { label: 'DETIK', value: timeLeft.seconds }
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-b from-white/10 to-transparent border border-white/20 rounded-2xl p-3 md:p-5 text-center shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-amber-500/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500"></div>
                <span className="relative z-10 block text-3xl md:text-5xl font-black text-white mb-1 drop-shadow-md">
                  {item.value.toString().padStart(2, '0')}
                </span>
                <span className="relative z-10 block text-[10px] md:text-xs text-amber-400 font-bold tracking-widest">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PESAN ALMAMATER (Pengganti Himbauan) */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5 md:p-6 mb-10 backdrop-blur-sm flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left transition-all hover:bg-blue-500/20">
          <div className="p-3 bg-blue-500/20 rounded-full text-blue-400 shrink-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div>
            <h4 className="text-blue-400 font-bold text-lg mb-1 tracking-wide">PESAN KELULUSAN</h4>
            <p className="text-white/80 text-sm leading-relaxed">
              Kemanapun langkahmu pergi, bawalah selalu nama baik <span className="font-bold text-white">SMP Negeri 1 Jaten</span>. Jadikan setiap ilmu yang telah kalian dapatkan di bangku sekolah sebagai bekal berharga untuk meraih masa depan yang gemilang.
            </p>
          </div>
        </div>

        {/* SAMBUTAN KEPALA SEKOLAH */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 mb-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-bl-full -z-0 opacity-50 transition-transform group-hover:scale-110 duration-700"></div>
          <div className="absolute text-9xl text-slate-100 right-4 top-4 font-serif -z-0 leading-none">"</div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex-shrink-0">
              <div className="relative">
                <img 
                  src="/kepsek.jpeg" 
                  alt="Suroso S.Pd" 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-lg border-4 border-slate-50"
                  onError={(e) => { e.currentTarget.src = "https://randomuser.me/api/portraits/men/44.jpg"; }}
                />
                <div className="absolute -bottom-4 -right-4 bg-amber-500 text-white p-2 rounded-xl shadow-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
              </div>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h3 className="text-2xl font-bold text-slate-800 border-b-2 border-amber-400 pb-2 inline-block mb-4">
                Sambutan Kepala Sekolah
              </h3>
              
              <div className="text-slate-700 leading-relaxed space-y-4">
                <p className="font-semibold text-lg">Assalamualaikum Warahmatullahi Wabarakatuh</p>
                <p className="italic text-slate-600">
                  Dengan penuh Rasa Syukur, kami mengucapkan selamat kepada seluruh siswa kelas IX SMP N 1 Jaten Tahun ajaran 2025/2026 yang telah menyelesaikan Pendidikan selama 3 tahun. Semoga ilmu yang diperoleh menjadi bermanfaat dan dapat mengantarkan kepada gerbang cita-cita.
                </p>
                <p className="font-semibold text-lg">Wassalamualaikum Warahmatullahi Wabarokatuh.</p>
              </div>

              <div className="mt-6">
                <p className="text-xl font-bold text-slate-900">Suroso S.Pd</p>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Kepala Sekolah SMPN 1 Jaten</p>
              </div>
            </div>
          </div>
        </div>

        {/* ALUR PENGECEKAN */}
        <div className="mb-12">
          <h3 className="text-center text-white text-xl font-bold mb-6 tracking-widest uppercase">Panduan Pengecekan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Siapkan NISN", desc: "Pastikan Anda mengetahui Nomor Induk Siswa Nasional (NISN) Anda yang berjumlah 10 digit." },
              { step: "2", title: "Klik Tombol Cek", desc: "Klik tombol di bawah dan masukkan NISN Anda dengan benar pada kolom yang tersedia." },
              { step: "3", title: "Simpan Bukti", desc: "Jika dinyatakan lulus, Anda dapat langsung mencetak (Print) atau menyimpan halaman ini sebagai bukti kelulusan." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl text-center hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center text-xl font-black mx-auto mb-4 shadow-lg">{item.step}</div>
                <h4 className="text-white font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-blue-200/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CALL TO ACTION BUTTON YANG SUDAH DIKUNCI */}
        <div className="text-center relative z-20 mt-10">
          <button
            onClick={() => {
              if (isOpened) setIsModalOpen(true);
              else alert("Mohon bersabar, portal pengumuman belum dibuka!");
            }}
            disabled={!isOpened}
            className={`group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-300 font-pj rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 ${
              isOpened 
                ? "bg-gradient-to-r from-amber-500 to-amber-600 shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:shadow-[0_0_60px_rgba(245,158,11,0.7)] hover:-translate-y-2" 
                : "bg-slate-700/80 cursor-not-allowed opacity-80 border border-slate-600"
            }`}
          >
            <span className="text-xl tracking-wide uppercase flex items-center gap-3">
              {isOpened ? "Cek Kelulusan Sekarang" : "Portal Belum Dibuka"}
              {isOpened && (
                <svg className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
              )}
            </span>
          </button>
        </div>

      </div>

      {/* FOOTER RESMI (Dengan Alamat & Kontak) */}
      <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 py-8 relative z-10 mt-auto">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <img src="/logo-smp.png" alt="Logo SMPN 1 Jaten" className="w-10 h-10 mx-auto mb-3 opacity-50 grayscale" />
          <p className="text-slate-300 font-bold text-sm mb-2 uppercase tracking-widest">SMP NEGERI 1 JATEN</p>
          <p className="text-slate-400 text-xs mb-1">
            Jl. Raya Solo-Tawangmangu, Dusun I, Jaten, Kec. Jaten, Kabupaten Karanganyar
          </p>
          <p className="text-slate-400 text-xs mb-5">
            Telp: (0271) 825726  |  Email: info@smpn1jaten.sch.id  |  Website: <a href="https://www.smpn1jaten.sch.id" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">www.smpn1jaten.sch.id</a>
          </p>
          <div className="w-16 h-px bg-white/20 mx-auto mb-4"></div>
          <p className="text-slate-500 text-xs">
            &copy; 2026 SMPN 1 Jaten. All rights reserved.<br/>
            Sistem Informasi Kelulusan Terpadu
          </p>
        </div>
      </footer>

      {/* POP-UP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050a17]/90 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
          
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden relative">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-[50px]"></div>

            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 z-50 text-white/50 hover:text-white transition bg-white/5 hover:bg-white/10 rounded-full p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="p-8 pb-6 text-center border-b border-white/10 relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-2xl font-black text-white tracking-wide">VERIFIKASI DATA</h3>
              <p className="text-sm text-blue-200 mt-1">Sistem Informasi Kelulusan Terpadu</p>
            </div>

            <div className="p-8 relative z-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-blue-300 mb-2 uppercase tracking-widest">
                    Nomor Induk Siswa Nasional
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={nis}
                      onChange={(e) => setNis(e.target.value)}
                      placeholder="Ketik NISN..."
                      className="w-full px-5 py-4 bg-black/30 border-2 border-white/10 rounded-xl focus:bg-black/50 focus:ring-0 focus:border-amber-500 transition-all text-center text-2xl font-mono tracking-widest text-white outline-none placeholder-white/20"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || !nis}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Memeriksa Database...
                    </span>
                  ) : (
                    <span className="text-lg tracking-wider uppercase">Lihat Hasil</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(12px); }
        }
      `}</style>
    </div>
  );
}