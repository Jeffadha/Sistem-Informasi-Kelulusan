import { NextResponse } from "next/server";
// Sesuaikan path ini dengan lokasi file JSON Anda disimpan
import dataSiswa from "../../../data/data_siswa.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nisQuery = searchParams.get("nis");

  // Jika tidak ada NIS yang dikirim
  if (!nisQuery) {
    return NextResponse.json(
      { success: false, message: "NISN tidak diberikan" },
      { status: 400 }
    );
  }

  // 1. CARI DATA SISWA
  // Kita bungkus pakai String() karena di JSON Anda ada NISN yang berupa Angka (Int) dan ada yang Teks (String)
  const siswa = dataSiswa.find((s: any) => String(s.NISN) === String(nisQuery));

  if (siswa) {
    // 2. BERSIHKAN STATUS
    // Mengubah "L U L U S" menjadi "LULUS" agar cocok dengan logika Frontend kita
    const statusClean = siswa["STATUS KELULUSAN"].replace(/\s+/g, "");

    // 3. BUAT PESAN OTOMATIS BERDASARKAN KELAS
    const pesanPersonal = statusClean === "LULUS"
      ? `Selamat! Tiga tahun perjalanan hebatmu di SMPN 1 Jaten telah berbuah manis. Keluarga besar kelas ${siswa.KELAS} sangat bangga padamu. Teruslah bersinar dan raih cita-citamu di jenjang yang lebih tinggi!`
      : `Jangan patah semangat! Kegagalan hari ini bukanlah akhir dari perjalananmu. Silakan hubungi Wali Kelas ${siswa.KELAS} untuk mendapatkan arahan dan bimbingan lebih lanjut. Kamu pasti bisa bangkit!`;
    // 4. KIRIM KE FRONTEND
    return NextResponse.json({
      success: true,
      data: {
        nis: siswa.NISN,
        nama: siswa["NAMA SISWA"],
        status: statusClean,
        pesan: pesanPersonal
      }
    });
  } else {
    // Jika NISN tidak ditemukan di dalam JSON
    return NextResponse.json(
      { success: false, message: "Data tidak ditemukan" },
      { status: 404 }
    );
  }
}