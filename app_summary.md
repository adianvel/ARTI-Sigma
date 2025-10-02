Product Requirements Document (PRD) - Diperbarui
Nama Proyek: PetLog
Versi: 1.1 – "Paspor Digital Level 1: Sertifikat Kepemilikan"
Tanggal Pembaruan: 27 September 2025
Target Jaringan: Cardano Pre-Production Testnet
1. Latar Belakang & Visi
(Tidak ada perubahan dari PRD sebelumnya, visi tetap solid)
Visi Jangka Panjang: PetLog bertujuan untuk menyelesaikan krisis kepercayaan dan efisiensi pada provenance (asal-usul) hewan ras dengan menciptakan ekosistem Paspor Digital terverifikasi.
Fokus V1.1: PRD ini secara spesifik mendefinisikan Versi 1, yang berfokus pada fondasi paling fundamental: memungkinkan pemilik hewan untuk membuat Sertifikat Kepemilikan yang diisi sendiri oleh pengguna (self-attested) dalam bentuk NFT.
2. Rumusan Masalah
(Tidak ada perubahan, rumusan masalah sudah tajam)
Kerentanan terhadap Pemalsuan & Kurangnya Transparansi.
Fragmentasi Data Kritis.
Ketergantungan pada Otoritas Sentral yang Tidak Efisien.
3. Target Pengguna (V1)
Primer: Semua Pemilik Kucing Modern & Komunitas Kripto.
Sekunder: Peternak/Cattery (Sebagai Pengguna Awal).
4. Tujuan Produk (V1)
Produk: Meluncurkan platform minting NFT yang fungsional, stabil, dan mudah digunakan di Cardano Pre-Production Testnet.
Pengguna: Memberikan cara termudah bagi pemilik kucing untuk mengabadikan identitas inti hewan mereka dalam sebuah aset digital yang indah.
Strategis: Memvalidasi minat pasar dan membangun basis pengguna awal sebagai fondasi untuk fitur validasi di masa depan.
5. Fitur Utama (V1)
F-01: Autentikasi & Manajemen Sesi Wallet
Pengguna dapat menghubungkan dan memutuskan wallet Cardano (Nami, Eternl, GameChanger) yang terkonfigurasi untuk Pre-Production Testnet. Status koneksi persisten selama sesi.
F-02: Fungsionalitas Inti: Alur Minting Paspor
Sebuah alur terpandu multi-langkah yang mencakup:
Input Data: Form untuk data inti kucing (nama, tgl lahir, ras, dll).
Unggah Foto: Komponen uploader gambar dengan pratinjau.
Pratinjau Real-time: Visualisasi dari desain akhir Paspor NFT sebelum minting.
Proses Minting Terintegrasi: Proses end-to-end yang menangani persiapan metadata, unggah ke IPFS, pembuatan transaksi, dan pengiriman ke blockchain dengan umpan balik UI yang jelas.
F-03: Manajemen Aset Pengguna
Galeri "Paspor Saya": Halaman pribadi yang menampilkan semua PetLog NFT yang dimiliki pengguna.
Tampilan Detail Paspor: Tampilan detail untuk setiap NFT, menampilkan semua metadata dan disclaimer "belum diverifikasi".
6. Alur Aplikasi Detail
Langkah
Layar / Kondisi
Aksi Pengguna
Respon Sistem & UI
1.1
Halaman Utama (Belum Terhubung)
Mengklik "Connect Wallet".
Menampilkan modal pilihan wallet, memicu pop-up ekstensi.
1.2
Pop-up Ekstensi Wallet
Menyetujui koneksi.
Header berubah menampilkan alamat. Aplikasi dalam status "Terhubung".
2.1
Halaman Utama (Sudah Terhubung)
Mengklik "Mulai Buat Sertifikat".
Mengarahkan pengguna ke halaman /mint.
2.2
Halaman Minting (Multi-langkah)
Mengisi data, mengunggah foto, melihat pratinjau.
UI memandu pengguna dari langkah ke langkah, menyimpan data di state.
2.3
Halaman Minting (Pratinjau)
Mengklik "Mint Paspor Saya".
Sistem memulai proses minting, UI menampilkan status loading.
2.4
Proses Latar Belakang
(Sistem bekerja)
Mengunggah aset ke IPFS, membangun transaksi, menyajikan ke wallet.
2.5
Pop-up Ekstensi Wallet
Menandatangani transaksi.
Sistem mengirimkan transaksi, UI menampilkan status "Processing...".
2.6
Halaman Sukses
Transaksi berhasil.
UI menampilkan pesan sukses dengan link ke galeri dan explorer.
3.1
Navigasi Header
Mengklik "Paspor Saya".
Mengarahkan ke /my-passports.
3.2
Halaman Galeri
(Sistem bekerja)
Query ke blockchain, menampilkan semua PetLog NFT yang dimiliki.

7. Model Data & Representasi Objek
7.1 Data yang Disimpan
Data yang dikumpulkan dari pengguna bersifat self-attested dan mencakup:
Identitas Inti: cat_name, date_of_birth
Atribut Fisik: breed, coat_color, sex
Identifikasi Unik: microchip_number
Silsilah (Opsional): sire_name, dam_name
7.2 Representasi Objek (DigitalPetPassport)
Data ini akan distrukturkan dalam sebuah objek JSON (disimpan di IPFS) sebagai berikut (direpresentasikan dalam TypeScript):
TypeScript
interface DigitalPetPassport {
  identity: {
    cat_name: string;
    date_of_birth: string; // "YYYY-MM-DD"
  };
  attributes: {
    breed: string;
    coat_color: string;
    sex: 'Male' | 'Female';
  };
  unique_identification: {
    microchip_number: string;
  };
  provenance?: { // Opsional
    sire_name?: string; 
    dam_name?: string;
  };
  platform_info: {
    image_url: string; // "ipfs://..."
    validation_tier: "Level 1 - Self Attested";
    minted_on: string; // Timestamp ISO 8601
    application_version: "1.0";
  };
}


8. Arsitektur Teknis & Skema Database
8.1 Arsitektur Data
On-Chain (Cardano): Menyimpan bukti kepemilikan (siapa yang memegang NFT) dan pointer (hash IPFS) ke metadata.
Off-Chain (IPFS): Menyimpan file JSON metadata DigitalPetPassport yang detail dan file gambar.
8.2 Skema Tabel Relasional (Backend Cache)
Database ini bersifat opsional namun direkomendasikan untuk performa.
Tabel Users:
user_id (PK, UUID)
wallet_address (UNIQUE, TEXT)
created_at, updated_at (TIMESTAMP)
Tabel Passports:
passport_id (PK, UUID)
owner_user_id (FK, UUID) -> Menunjuk ke Users.user_id
asset_id (UNIQUE, TEXT)
ipfs_hash (TEXT)
cat_name, breed, image_url (TEXT, sebagai cache)
created_at, updated_at (TIMESTAMP)
8.3 Diagram Relasi
[ Users ] 1..* [ Passports ]


Satu User dapat memiliki banyak Passports.
9. Lingkup V1: Apa yang Termasuk & Tidak Termasuk
TERMASUK:
Fungsionalitas minting NFT end-to-end dengan data self-attested.
Galeri untuk melihat NFT yang dimiliki.
Halaman detail paspor dengan disclaimer "belum diverifikasi".
TIDAK TERMASUK:
SEMUA BENTUK VALIDASI PIHAK KETIGA.
Sistem Onboarding & KYC untuk Mitra.
Update Metadata Pasca-Minting.
Integrasi DID.
10. Metrik Keberhasilan (V1)
Jumlah Paspor NFT yang berhasil di-mint di Pre-Production Testnet.
Jumlah wallet unik yang terhubung ke DApp.
Tingkat Konversi dari pengunjung menjadi pemilik NFT.
11. Rencana Pengembangan (Pasca-V1)
V1.5 (Fase Komunitas): Meluncurkan galeri komunitas global, integrasi dengan marketplace.
V2.0 (Fase Kepercayaan): Memperkenalkan Model Validasi Profesional dengan onboarding Mitra Terverifikasi.
V3.0 (Fase Desentralisasi): Menjajaki Model Validasi Komunitas dan integrasi DID.

