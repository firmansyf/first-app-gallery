import type { Metadata } from "next";
import Link from "next/link";
import { AUTHOR_NAME, AUTHOR_JOB_TITLE, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `About ${AUTHOR_NAME}`,
  description: `Tentang ${AUTHOR_NAME}, seorang ${AUTHOR_JOB_TITLE}, dan cerita di balik ${SITE_NAME} — gallery online pribadinya untuk berbagi momen.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About ${AUTHOR_NAME} | ${SITE_NAME}`,
    description: `Tentang ${AUTHOR_NAME}, seorang ${AUTHOR_JOB_TITLE}, dan cerita di balik ${SITE_NAME}.`,
    url: "/about",
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-xl mx-auto mt-2 sm:mt-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 font-serif">About</h1>
          <p className="text-sm text-gray-500">
            Sedikit cerita tentang FirstMate dan orang di baliknya.
          </p>
        </header>

        <section className="space-y-3 text-gray-700 leading-relaxed">
          <p>
            <span className="font-semibold text-blue-600">FirstMate</span>{" "}
            adalah gallery online milik Yusuf Firmansyah. Dia adalah seorang{" "}
            <span className="font-medium">software engineer</span> yang senang
            membangun produk digital — mulai dari web apps, API, sampai
            eksperimen kecil yang lahir dari rasa penasaran.
          </p>
          <p>
            Di luar kode, Yusuf suka mengabadikan momen: jalanan di pagi hari,
            langit sore, makanan di warung favorit, atau wajah orang-orang
            terdekat. FirstMate dibuat sebagai tempat menyimpan semua itu —
            bukan sekadar folder di hard drive, tapi ruang yang bisa dibagikan
            dan ditelusuri kembali.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900 font-serif">
            Kenapa FirstMate?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Nama <em>First Mate</em> diambil dari istilah pelayaran: pendamping
            kapten, orang yang paling dipercaya selama perjalanan. Website ini
            adalah pendamping Yusuf dalam perjalanan dokumentasi hidup — tempat
            momen-momen kecil mendapat panggung yang layak.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900 font-serif">
            Apa yang ada di sini?
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>
                <span className="font-medium">Gallery</span> — koleksi foto dan
                video beserta lokasi serta cerita singkat di baliknya.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>
                <span className="font-medium">Pesan</span> — ruang bagi
                pengunjung untuk menyapa langsung, tanpa perlu akun atau
                media sosial.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>
                <span className="font-medium">Desain ringan</span> — dibuat
                agar cepat dibuka dari mana saja, fokus pada konten, tanpa
                gangguan iklan atau pelacak pihak ketiga.
              </span>
            </li>
          </ul>
        </section>

        {/* <section className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900 font-serif">
            Teknologi
          </h2>
          <p className="text-gray-700 leading-relaxed">
            FirstMate dibangun dengan Next.js, React, Tailwind CSS, Prisma,
            dan PostgreSQL, dengan MinIO sebagai penyimpanan media. Semua
            dirangkai untuk satu tujuan: pengalaman yang sederhana dan
            personal.
          </p>
        </section> */}

        <section className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Ingin menyapa? Gunakan tombol pesan di pojok kanan bawah.
          </p>
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Jelajahi gallery →
          </Link>
        </section>
      </div>
    </div>
  );
}
