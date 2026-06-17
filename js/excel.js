// ==================== EXCEL IMPORT/EXPORT FUNCTIONS ====================

// Export to Excel
function exportToExcel() {
    const objek = getObjekData();
    const ids = getPembandingIds();
    
    // Sheet 1: Objek
    const objekSheet = [{
        'NOP PBB-P2': objek.nop,
        'Nama Pemilik': objek.pemilik,
        'Alamat': objek.alamat,
        'Kelurahan': objek.kelurahan,
        'Kecamatan': objek.kecamatan,
        'Jenis Properti': objek.jenis,
        'Luas Tanah (m2)': objek.luasTanah,
        'Luas Bangunan (m2)': objek.luasBangunan,
        'Tahun Dibangun': objek.tahun,
        'Kondisi': objek.kondisi,
        'Tanggal Penilaian': objek.tglNilai,
        'Penilai': objek.penilai
    }];
    
    // Sheet 2: Pembanding
    const pembandingSheet = ids.map((id, i) => {
        const pb = getPembandingData(id);
        return {
            'No': i + 1,
            'NOP PBB-P2': pb.nop,
            'Nama Pemilik': pb.pemilik,
            'Alamat': pb.alamat,
            'Kelurahan': pb.kelurahan,
            'Kecamatan': pb.kecamatan,
            'Jenis Properti': pb.jenis,
            'Luas Tanah (m2)': pb.luasTanah,
            'Luas Bangunan (m2)': pb.luasBangunan,
            'Tahun Dibangun': pb.tahun,
            'Kondisi': pb.kondisi,
            'Harga Transaksi': pb.harga,
            'Tanggal Transaksi': pb.tglTransaksi,
            'Sumber Data': pb.sumber,
            'Penyesuaian (%)': pb.adj,
            'Harga Per M2': pb.hargaPerM2,
            'Nilai Indikasi': pb.nilaiIndikasi,
            'Keterangan': pb.keterangan
        };
    });

    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(objekSheet);
    const ws2 = XLSX.utils.json_to_sheet(pembandingSheet.length > 0 ? pembandingSheet : [{}]);
    
    // Set column widths
    ws1['!cols'] = [
        {wch: 20}, {wch: 25}, {wch: 30}, {wch: 15}, {wch: 15},
        {wch: 15}, {wch: 12}, {wch: 12}, {wch: 10}, {wch: 12},
        {wch: 15}, {wch: 20}
    ];
    
    ws2['!cols'] = [
        {wch: 5}, {wch: 20}, {wch: 25}, {wch: 30}, {wch: 15},
        {wch: 15}, {wch: 15}, {wch: 12}, {wch: 12}, {wch: 10},
        {wch: 12}, {wch: 18}, {wch: 15}, {wch: 12}, {wch: 12},
        {wch: 15}, {wch: 18}, {wch: 25}
    ];
    
    XLSX.utils.book_append_sheet(wb, ws1, 'Objek Penilaian');
    XLSX.utils.book_append_sheet(wb, ws2, 'Data Pembanding');
    
    const filename = `Penilaian_Aset_${objek.nop || 'Data'}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, filename);
    
    showToast('File Excel berhasil diunduh!', 'success');
}

// Import from Excel
function importFromExcel(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Read Objek Sheet
            const objekSheet = workbook.Sheets['Objek Penilaian'];
            if (objekSheet) {
                const objekData = XLSX.utils.sheet_to_json(objekSheet)[0];
                if (objekData) {
                    document.getElementById('obj-nop').value = objekData['NOP PBB-P2'] || '';
                    document.getElementById('obj-pemilik').value = objekData['Nama Pemilik'] || '';
                    document.getElementById('obj-alamat').value = objekData['Alamat'] || '';
                    document.getElementById('obj-kecamatan').value = objekData['Kecamatan'] || '';
                    updateKelurahan('obj-kecamatan', 'obj-kelurahan');
                    setTimeout(() => {
                        document.getElementById('obj-kelurahan').value = objekData['Kelurahan'] || '';
                    }, 100);
                    document.getElementById('obj-jenis').value = objekData['Jenis Properti'] || '';
                    document.getElementById('obj-luas-tanah').value = objekData['Luas Tanah (m2)'] || '';
                    document.getElementById('obj-luas-bangunan').value = objekData['Luas Bangunan (m2)'] || '';
                    document.getElementById('obj-tahun').value = objekData['Tahun Dibangun'] || '';
                    document.getElementById('obj-kondisi').value = objekData['Kondisi'] || '';
                    document.getElementById('obj-tgl-nilai').value = objekData['Tanggal Penilaian'] || '';
                    document.getElementById('obj-penilai').value = objekData['Penilai'] || '';
                }
            }
            
            // Read Pembanding Sheet
            const pbSheet = workbook.Sheets['Data Pembanding'];
            if (pbSheet) {
                const pbData = XLSX.utils.sheet_to_json(pbSheet);
                
                // Clear existing
                document.getElementById('pembanding-container').innerHTML = '';
                pembandingCounter = 0;
                
                pbData.forEach(row => {
                    if (row['NOP PBB-P2'] || row['Alamat'] || row['Harga Transaksi']) {
                        addPembanding();
                        const id = pembandingCounter;
                        const prefix = `pb${id}-`;
                        
                        document.getElementById(prefix + 'nop').value = row['NOP PBB-P2'] || '';
                        document.getElementById(prefix + 'pemilik').value = row['Nama Pemilik'] || '';
                        document.getElementById(prefix + 'alamat').value = row['Alamat'] || '';
                        document.getElementById(prefix + 'kecamatan').value = row['Kecamatan'] || '';
                        updateKelurahan(prefix + 'kecamatan', prefix + 'kelurahan');
                        setTimeout(() => {
                            document.getElementById(prefix + 'kelurahan').value = row['Kelurahan'] || '';
                        }, 100);
                        document.getElementById(prefix + 'jenis').value = row['Jenis Properti'] || '';
                        document.getElementById(prefix + 'luas-tanah').value = row['Luas Tanah (m2)'] || '';
                        document.getElementById(prefix + 'luas-bangunan').value = row['Luas Bangunan (m2)'] || '';
                        document.getElementById(prefix + 'tahun').value = row['Tahun Dibangun'] || '';
                        document.getElementById(prefix + 'kondisi').value = row['Kondisi'] || '';
                        
                        const harga = row['Harga Transaksi'] || 0;
                        document.getElementById(prefix + 'harga').value = new Intl.NumberFormat('id-ID').format(harga);
                        
                        document.getElementById(prefix + 'tgl-transaksi').value = row['Tanggal Transaksi'] || '';
                        document.getElementById(prefix + 'sumber').value = row['Sumber Data'] || '';
                        document.getElementById(prefix + 'adj').value = row['Penyesuaian (%)'] || '';
                        document.getElementById(prefix + 'keterangan').value = row['Keterangan'] || '';
                    }
                });
            }
            
            showToast('Data berhasil diimport!', 'success');
            updateSummaryTable();
        } catch (err) {
            console.error(err);
            showToast('Gagal membaca file. Pastikan format Excel sesuai.', 'error');
        }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = ''; // Reset input
}
