// ==================== REKAP/REPORT FUNCTIONS ====================

// Generate Rekap Data
function generateRekap() {
    const objek = getObjekData();
    const ids = getPembandingIds();
    
    // A. Info Penilaian
    const infoPenilaian = document.getElementById('rekap-info-penilaian');
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    
    if (infoPenilaian) {
        infoPenilaian.innerHTML = `
            <div class="flex gap-2"><span class="font-semibold w-40">Tanggal Penilaian</span>: <span>${objek.tglNilai ? formatDateID(objek.tglNilai) : today}</span></div>
            <div class="flex gap-2"><span class="font-semibold w-40">Nama Penilai</span>: <span>${objek.penilai || '-'}</span></div>
            <div class="flex gap-2"><span class="font-semibold w-40">Tujuan Penilaian</span>: <span>Penentuan Nilai Pasar</span></div>
            <div class="flex gap-2"><span class="font-semibold w-40">Metode Penilaian</span>: <span>Pendekatan Data Pasar (Market Data Approach)</span></div>
        `;
    }
    
    const rekapTanggal = document.getElementById('rekap-tanggal');
    if (rekapTanggal) rekapTanggal.textContent = today;
    
    const rekapPenilai = document.getElementById('rekap-ttd-penilai');
    if (rekapPenilai && objek.penilai) rekapPenilai.textContent = objek.penilai;

    // B. Data Objek
    const tabelObjek = document.getElementById('rekap-tabel-objek');
    if (tabelObjek) {
        const tbody = tabelObjek.querySelector('tbody');
        tbody.innerHTML = `
            <tr><td class="border border-slate-300 p-2 bg-slate-50 font-semibold w-48">NOP PBB-P2</td><td class="border border-slate-300 p-2">${objek.nop || '-'}</td></tr>
            <tr><td class="border border-slate-300 p-2 bg-slate-50 font-semibold">Nama Pemilik/Wajib Pajak</td><td class="border border-slate-300 p-2">${objek.pemilik || '-'}</td></tr>
            <tr><td class="border border-slate-300 p-2 bg-slate-50 font-semibold">Alamat Objek</td><td class="border border-slate-300 p-2">${objek.alamat || '-'}</td></tr>
            <tr><td class="border border-slate-300 p-2 bg-slate-50 font-semibold">Kelurahan/Desa</td><td class="border border-slate-300 p-2">${objek.kelurahan || '-'}</td></tr>
            <tr><td class="border border-slate-300 p-2 bg-slate-50 font-semibold">Kecamatan</td><td class="border border-slate-300 p-2">${objek.kecamatan || '-'}</td></tr>
            <tr><td class="border border-slate-300 p-2 bg-slate-50 font-semibold">Kabupaten</td><td class="border border-slate-300 p-2">${APP_CONFIG.kabupaten}</td></tr>
            <tr><td class="border border-slate-300 p-2 bg-slate-50 font-semibold">Provinsi</td><td class="border border-slate-300 p-2">${APP_CONFIG.provinsi}</td></tr>
            <tr><td class="border border-slate-300 p-2 bg-slate-50 font-semibold">Jenis Properti</td><td class="border border-slate-300 p-2">${objek.jenis || '-'}</td></tr>
            <tr><td class="border border-slate-300 p-2 bg-slate-50 font-semibold">Luas Tanah</td><td class="border border-slate-300 p-2">${objek.luasTanah ? objek.luasTanah.toLocaleString('id-ID') + ' m²' : '-'}</td></tr>
            <tr><td class="border border-slate-300 p-2 bg-slate-50 font-semibold">Luas Bangunan</td><td class="border border-slate-300 p-2">${objek.luasBangunan ? objek.luasBangunan.toLocaleString('id-ID') + ' m²' : '-'}</td></tr>
            <tr><td class="border border-slate-300 p-2 bg-slate-50 font-semibold">Tahun Dibangun</td><td class="border border-slate-300 p-2">${objek.tahun || '-'}</td></tr>
            <tr><td class="border border-slate-300 p-2 bg-slate-50 font-semibold">Kondisi Bangunan</td><td class="border border-slate-300 p-2">${objek.kondisi || '-'}</td></tr>
        `;
    }

    // C. Data Pembanding
    const tbodyPembanding = document.getElementById('rekap-tbody-pembanding');
    if (tbodyPembanding) {
        tbodyPembanding.innerHTML = '';
        
        let totalHarga = 0;
        let totalHargaPerM2 = 0;
        let totalIndikasi = 0;
        let totalAdj = 0;
        let minHarga = Infinity;
        let maxHarga = 0;
        let minHargaPerM2 = Infinity;
        let maxHargaPerM2 = 0;
        
        if (ids.length === 0) {
            tbodyPembanding.innerHTML = '<tr><td colspan="13" class="border p-4 text-center text-slate-400">Belum ada data pembanding</td></tr>';
        } else {
            ids.forEach((id, i) => {
                const pb = getPembandingData(id);
                
                if (pb.harga > 0) {
                    totalHarga += pb.harga;
                    totalHargaPerM2 += pb.hargaPerM2;
                    totalIndikasi += pb.nilaiIndikasi;
                    totalAdj += pb.adj;
                    
                    if (pb.harga < minHarga) minHarga = pb.harga;
                    if (pb.harga > maxHarga) maxHarga = pb.harga;
                    if (pb.hargaPerM2 < minHargaPerM2) minHargaPerM2 = pb.hargaPerM2;
                    if (pb.hargaPerM2 > maxHargaPerM2) maxHargaPerM2 = pb.hargaPerM2;
                }
                
                const row = document.createElement('tr');
                row.className = 'hover:bg-slate-50';
                row.innerHTML = `
                    <td class="border border-slate-300 p-2 text-center">${i + 1}</td>
                    <td class="border border-slate-300 p-2">${pb.nop || '-'}</td>
                    <td class="border border-slate-300 p-2">${pb.alamat || '-'}</td>
                    <td class="border border-slate-300 p-2">${pb.kelurahan || '-'}</td>
                    <td class="border border-slate-300 p-2">${pb.kecamatan || '-'}</td>
                    <td class="border border-slate-300 p-2">${pb.jenis || '-'}</td>
                    <td class="border border-slate-300 p-2 text-right">${pb.luasTanah ? pb.luasTanah.toLocaleString('id-ID') : '-'}</td>
                    <td class="border border-slate-300 p-2 text-right">${pb.luasBangunan ? pb.luasBangunan.toLocaleString('id-ID') : '-'}</td>
                    <td class="border border-slate-300 p-2 text-right">${formatRupiah(pb.harga)}</td>
                    <td class="border border-slate-300 p-2 text-right">${formatRupiah(pb.hargaPerM2)}</td>
                    <td class="border border-slate-300 p-2 text-center">${pb.sumber || '-'}</td>
                    <td class="border border-slate-300 p-2 text-right ${pb.adj > 0 ? 'text-green-600' : pb.adj < 0 ? 'text-red-600' : ''}">${pb.adj > 0 ? '+' : ''}${pb.adj}%</td>
                    <td class="border border-slate-300 p-2 text-right font-semibold">${formatRupiah(pb.nilaiIndikasi)}</td>
                `;
                tbodyPembanding.appendChild(row);
            });
        }

        const count = ids.filter(id => getPembandingData(id).harga > 0).length;
        const avgHarga = count > 0 ? totalHarga / count : 0;
        const avgHargaPerM2 = count > 0 ? totalHargaPerM2 / count : 0;
        const avgIndikasi = count > 0 ? totalIndikasi / count : 0;
        const avgAdj = count > 0 ? totalAdj / count : 0;

        // D. Statistik & Penyesuaian
        const statistikTable = document.getElementById('rekap-statistik');
        if (statistikTable) {
            statistikTable.querySelector('tbody').innerHTML = `
                <tr><td class="py-1">Jumlah Data Pembanding</td><td class="py-1 text-right font-semibold">${count}</td></tr>
                <tr><td class="py-1">Harga Terendah</td><td class="py-1 text-right font-semibold">${count > 0 ? formatRupiah(minHarga) : '-'}</td></tr>
                <tr><td class="py-1">Harga Tertinggi</td><td class="py-1 text-right font-semibold">${count > 0 ? formatRupiah(maxHarga) : '-'}</td></tr>
                <tr><td class="py-1">Rata-rata Harga</td><td class="py-1 text-right font-semibold">${count > 0 ? formatRupiah(avgHarga) : '-'}</td></tr>
                <tr class="border-t"><td class="py-1">Harga/m² Terendah</td><td class="py-1 text-right font-semibold">${count > 0 ? formatRupiah(minHargaPerM2) : '-'}</td></tr>
                <tr><td class="py-1">Harga/m² Tertinggi</td><td class="py-1 text-right font-semibold">${count > 0 ? formatRupiah(maxHargaPerM2) : '-'}</td></tr>
                <tr><td class="py-1">Rata-rata Harga/m²</td><td class="py-1 text-right font-semibold">${count > 0 ? formatRupiah(avgHargaPerM2) : '-'}</td></tr>
            `;
        }

        const penyesuaianTable = document.getElementById('rekap-penyesuaian');
        if (penyesuaianTable) {
            penyesuaianTable.querySelector('tbody').innerHTML = `
                <tr><td class="py-1">Total Nilai Indikasi</td><td class="py-1 text-right font-semibold">${formatRupiah(totalIndikasi)}</td></tr>
                <tr><td class="py-1">Rata-rata Penyesuaian</td><td class="py-1 text-right font-semibold">${avgAdj.toFixed(2)}%</td></tr>
                <tr class="border-t"><td class="py-1">Rata-rata Nilai Indikasi</td><td class="py-1 text-right font-semibold">${formatRupiah(avgIndikasi)}</td></tr>
                <tr><td class="py-1">Nilai per m² Tanah Objek</td><td class="py-1 text-right font-semibold">${objek.luasTanah > 0 ? formatRupiah(avgIndikasi / objek.luasTanah) : '-'}</td></tr>
            `;
        }

        // E. Kesimpulan
        const kesimpulan = document.getElementById('rekap-kesimpulan');
        if (kesimpulan) {
            const nilaiPasar = avgIndikasi;
            const nilaiPerM2Tanah = objek.luasTanah > 0 ? nilaiPasar / objek.luasTanah : 0;
            const nilaiPerM2Bgn = objek.luasBangunan > 0 ? nilaiPasar / objek.luasBangunan : 0;
            
            kesimpulan.innerHTML = `
                <p class="text-sm text-slate-600 mb-2">Berdasarkan analisis data pembanding dan penyesuaian yang dilakukan, maka:</p>
                <p class="text-lg font-bold text-slate-700 mb-3">ESTIMASI NILAI PASAR OBJEK</p>
                <p class="text-4xl font-bold text-lime-700 mb-4">${formatRupiah(nilaiPasar)}</p>
                <p class="text-sm text-slate-600 italic">(${terbilang(Math.round(nilaiPasar))} Rupiah)</p>
                <div class="mt-4 pt-4 border-t border-lime-200 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p class="text-slate-500">Nilai per m² Tanah</p>
                        <p class="font-bold text-slate-700">${formatRupiah(nilaiPerM2Tanah)}</p>
                    </div>
                    <div>
                        <p class="text-slate-500">Nilai per m² Bangunan</p>
                        <p class="font-bold text-slate-700">${objek.luasBangunan > 0 ? formatRupiah(nilaiPerM2Bgn) : '-'}</p>
                    </div>
                </div>
            `;
        }
    }
}

// Print Rekap
function printRekap() {
    generateRekap();
    window.print();
}

// Export PDF (using print)
function exportRekapToPDF() {
    generateRekap();
    showToast('Pilih "Save as PDF" pada dialog print', 'info');
    setTimeout(() => window.print(), 500);
}
