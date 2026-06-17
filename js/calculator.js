// ==================== CALCULATOR FUNCTIONS ====================

let pembandingCounter = 0;

// Add Pembanding Form
function addPembanding() {
    pembandingCounter++;
    const container = document.getElementById('pembanding-container');
    
    const card = document.createElement('div');
    card.id = `pembanding-${pembandingCounter}`;
    card.className = 'p-4 bg-slate-50 rounded-lg border border-slate-200 relative animate-fade-in';
    card.innerHTML = `
        <button onclick="removePembanding(${pembandingCounter})" class="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h4 class="font-bold text-sm mb-3 text-lime-700">Pembanding ${pembandingCounter}</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
                <label class="block text-xs font-medium mb-1">NOP PBB-P2</label>
                <input type="text" id="pb${pembandingCounter}-nop" class="w-full p-2 border rounded text-sm" placeholder="NOP">
            </div>
            <div>
                <label class="block text-xs font-medium mb-1">Nama Pemilik</label>
                <input type="text" id="pb${pembandingCounter}-pemilik" class="w-full p-2 border rounded text-sm" placeholder="Pemilik">
            </div>
            <div>
                <label class="block text-xs font-medium mb-1">Alamat</label>
                <input type="text" id="pb${pembandingCounter}-alamat" class="w-full p-2 border rounded text-sm" placeholder="Alamat">
            </div>
            <div>
                <label class="block text-xs font-medium mb-1">Kecamatan</label>
                <select id="pb${pembandingCounter}-kecamatan" onchange="updateKelurahan('pb${pembandingCounter}-kecamatan', 'pb${pembandingCounter}-kelurahan')" class="w-full p-2 border rounded text-sm">
                    ${generateKecamatanOptions()}
                </select>
            </div>
            <div>
                <label class="block text-xs font-medium mb-1">Kelurahan/Desa</label>
                <select id="pb${pembandingCounter}-kelurahan" class="w-full p-2 border rounded text-sm">
                    <option value="">-- Pilih Kelurahan/Desa --</option>
                </select>
            </div>
            <div>
                <label class="block text-xs font-medium mb-1">Jenis Properti</label>
                <select id="pb${pembandingCounter}-jenis" class="w-full p-2 border rounded text-sm">
                    ${generateJenisPropertiOptions()}
                </select>
            </div>
            <div>
                <label class="block text-xs font-medium mb-1">Luas Tanah (m²)</label>
                <input type="number" id="pb${pembandingCounter}-luas-tanah" class="w-full p-2 border rounded text-sm" placeholder="0">
            </div>
            <div>
                <label class="block text-xs font-medium mb-1">Luas Bangunan (m²)</label>
                <input type="number" id="pb${pembandingCounter}-luas-bangunan" class="w-full p-2 border rounded text-sm" placeholder="0">
            </div>
            <div>
                <label class="block text-xs font-medium mb-1">Tahun Dibangun</label>
                <input type="number" id="pb${pembandingCounter}-tahun" class="w-full p-2 border rounded text-sm" placeholder="2020">
            </div>
            <div>
                <label class="block text-xs font-medium mb-1">Kondisi</label>
                <select id="pb${pembandingCounter}-kondisi" class="w-full p-2 border rounded text-sm">
                    ${generateKondisiOptions()}
                </select>
            </div>
            <div>
                <label class="block text-xs font-medium mb-1">Harga Transaksi (Rp)</label>
                <input type="text" id="pb${pembandingCounter}-harga" onkeyup="formatInputCurrency(this)" class="w-full p-2 border rounded text-sm bg-yellow-50" placeholder="1.000.000.000">
            </div>
            <div>
                <label class="block text-xs font-medium mb-1">Tanggal Transaksi</label>
                <input type="date" id="pb${pembandingCounter}-tgl-transaksi" class="w-full p-2 border rounded text-sm">
            </div>
            <div>
                <label class="block text-xs font-medium mb-1">Sumber Data</label>
                <select id="pb${pembandingCounter}-sumber" class="w-full p-2 border rounded text-sm">
                    ${generateSumberDataOptions()}
                </select>
            </div>
            <div>
                <label class="block text-xs font-medium mb-1">Penyesuaian (%)</label>
                <input type="number" id="pb${pembandingCounter}-adj" class="w-full p-2 border rounded text-sm bg-blue-50" placeholder="+/- %">
            </div>
            <div class="md:col-span-2">
                <label class="block text-xs font-medium mb-1">Keterangan</label>
                <input type="text" id="pb${pembandingCounter}-keterangan" class="w-full p-2 border rounded text-sm" placeholder="Catatan tambahan...">
            </div>
        </div>
    `;
    container.appendChild(card);
}

// Remove Pembanding
function removePembanding(id) {
    const el = document.getElementById(`pembanding-${id}`);
    if (el) {
        el.classList.add('opacity-0', 'scale-95');
        setTimeout(() => el.remove(), 200);
    }
}

// Get Pembanding IDs
function getPembandingIds() {
    const container = document.getElementById('pembanding-container');
    const cards = container.querySelectorAll('[id^="pembanding-"]');
    return Array.from(cards).map(c => c.id.replace('pembanding-', ''));
}

// Get Objek Data
function getObjekData() {
    return {
        nop: document.getElementById('obj-nop')?.value || '',
        pemilik: document.getElementById('obj-pemilik')?.value || '',
        alamat: document.getElementById('obj-alamat')?.value || '',
        kelurahan: document.getElementById('obj-kelurahan')?.value || '',
        kecamatan: document.getElementById('obj-kecamatan')?.value || '',
        jenis: document.getElementById('obj-jenis')?.value || '',
        luasTanah: parseFloat(document.getElementById('obj-luas-tanah')?.value) || 0,
        luasBangunan: parseFloat(document.getElementById('obj-luas-bangunan')?.value) || 0,
        tahun: document.getElementById('obj-tahun')?.value || '',
        kondisi: document.getElementById('obj-kondisi')?.value || '',
        tglNilai: document.getElementById('obj-tgl-nilai')?.value || '',
        penilai: document.getElementById('obj-penilai')?.value || ''
    };
}

// Get Pembanding Data
function getPembandingData(id) {
    const prefix = `pb${id}-`;
    const hargaRaw = document.getElementById(prefix + 'harga')?.value || '0';
    const harga = parseFloat(hargaRaw.replace(/\./g, '')) || 0;
    const luasTanah = parseFloat(document.getElementById(prefix + 'luas-tanah')?.value) || 0;
    const luasBangunan = parseFloat(document.getElementById(prefix + 'luas-bangunan')?.value) || 0;
    const adj = parseFloat(document.getElementById(prefix + 'adj')?.value) || 0;
    
    return {
        id: id,
        nop: document.getElementById(prefix + 'nop')?.value || '',
        pemilik: document.getElementById(prefix + 'pemilik')?.value || '',
        alamat: document.getElementById(prefix + 'alamat')?.value || '',
        kelurahan: document.getElementById(prefix + 'kelurahan')?.value || '',
        kecamatan: document.getElementById(prefix + 'kecamatan')?.value || '',
        jenis: document.getElementById(prefix + 'jenis')?.value || '',
        luasTanah: luasTanah,
        luasBangunan: luasBangunan,
        tahun: document.getElementById(prefix + 'tahun')?.value || '',
        kondisi: document.getElementById(prefix + 'kondisi')?.value || '',
        harga: harga,
        tglTransaksi: document.getElementById(prefix + 'tgl-transaksi')?.value || '',
        sumber: document.getElementById(prefix + 'sumber')?.value || '',
        adj: adj,
        keterangan: document.getElementById(prefix + 'keterangan')?.value || '',
        hargaPerM2: luasTanah > 0 ? harga / luasTanah : 0,
        nilaiIndikasi: harga + (harga * adj / 100)
    };
}

// Update Summary Table
function updateSummaryTable() {
    const tbody = document.getElementById('table-summary-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const objek = getObjekData();
    const ids = getPembandingIds();
    
    // Object row
    const objRow = document.createElement('tr');
    objRow.className = 'bg-lime-50 font-semibold';
    objRow.innerHTML = `
        <td class="border p-2">OBJEK DINILAI</td>
        <td class="border p-2">${objek.nop || '-'}</td>
        <td class="border p-2">${objek.alamat || '-'}</td>
        <td class="border p-2 text-right">${objek.luasTanah || '-'}</td>
        <td class="border p-2 text-right">${objek.luasBangunan || '-'}</td>
        <td class="border p-2 text-right">-</td>
        <td class="border p-2 text-right">-</td>
        <td class="border p-2 text-right">-</td>
        <td class="border p-2 text-right text-lime-700 font-bold" id="objek-nilai-final">-</td>
    `;
    tbody.appendChild(objRow);
    
    if (ids.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="9" class="border p-4 text-center text-slate-400">Belum ada data pembanding</td>`;
        tbody.appendChild(emptyRow);
        return;
    }

    ids.forEach((id, i) => {
        const pb = getPembandingData(id);
        const row = document.createElement('tr');
        row.className = 'hover:bg-slate-50';
        row.innerHTML = `
            <td class="border p-2">Pembanding ${i + 1}</td>
            <td class="border p-2">${pb.nop || '-'}</td>
            <td class="border p-2">${pb.alamat || '-'}</td>
            <td class="border p-2 text-right">${pb.luasTanah || '-'}</td>
            <td class="border p-2 text-right">${pb.luasBangunan || '-'}</td>
            <td class="border p-2 text-right">${formatRupiah(pb.harga)}</td>
            <td class="border p-2 text-right">${formatRupiah(pb.hargaPerM2)}</td>
            <td class="border p-2 text-right">${pb.adj}%</td>
            <td class="border p-2 text-right font-semibold">${formatRupiah(pb.nilaiIndikasi)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Calculate Market Approach
function calculateMarketApproach() {
    const ids = getPembandingIds();
    
    if (ids.length === 0) {
        alert("Masukkan minimal satu data pembanding.");
        return;
    }

    let sum = 0;
    let count = 0;
    let details = [];

    ids.forEach((id, i) => {
        const pb = getPembandingData(id);
        if (pb.harga > 0) {
            sum += pb.nilaiIndikasi;
            count++;
            details.push({
                label: `Pembanding ${i + 1}`,
                harga: pb.harga,
                adj: pb.adj,
                indikasi: pb.nilaiIndikasi,
                hargaPerM2: pb.hargaPerM2
            });
        }
    });

    if (count === 0) {
        alert("Tidak ada data harga pembanding yang valid.");
        return;
    }

    const finalValue = sum / count;
    const objek = getObjekData();
    const nilaiPerM2 = objek.luasTanah > 0 ? finalValue / objek.luasTanah : 0;

    // Render Result
    const resultDiv = document.getElementById('result-market');
    let html = `<div class="space-y-2 text-left">`;
    
    details.forEach(d => {
        html += `
            <div class="flex justify-between border-b pb-1 text-sm">
                <span>${d.label} (Adj: ${d.adj > 0 ? '+' : ''}${d.adj}%):</span>
                <span class="font-mono">${formatRupiah(d.indikasi)}</span>
            </div>
        `;
    });
    
    html += `
        <div class="pt-4 mt-2 border-t-2 border-lime-200 bg-lime-50 p-4 rounded">
            <p class="text-sm font-bold text-center text-slate-500 mb-1">Estimasi Nilai Pasar</p>
            <p class="text-3xl font-bold text-lime-600 text-center">${formatRupiah(finalValue)}</p>
            <p class="text-xs text-center text-slate-500 mt-2">Nilai per m² Tanah: ${formatRupiah(nilaiPerM2)}</p>
        </div>
    </div>`;
    
    resultDiv.innerHTML = html;

    // Update summary table
    updateSummaryTable();
    const finalEl = document.getElementById('objek-nilai-final');
    if (finalEl) finalEl.innerText = formatRupiah(finalValue);
    
    showToast('Perhitungan selesai!', 'success');
}

// Calculate Cost Approach
function calculateCostApproach() {
    const landVal = parseCurrencyValue('cost-land');
    const rcn = parseCurrencyValue('cost-rcn');
    
    const depPhys = parseFloat(document.getElementById('dep-physical')?.value) || 0;
    const depFunc = parseFloat(document.getElementById('dep-functional')?.value) || 0;
    const depEco = parseFloat(document.getElementById('dep-economic')?.value) || 0;

    let totalDepPct = depPhys + depFunc + depEco;
    if (totalDepPct > 100) totalDepPct = 100;

    const depreciationAmount = rcn * (totalDepPct / 100);
    const buildingValue = rcn - depreciationAmount;
    const totalValue = landVal + buildingValue;

    const resultDiv = document.getElementById('result-cost');
    resultDiv.innerHTML = `
        <div class="space-y-3 text-left">
            <div class="flex justify-between items-center text-sm">
                <span class="text-slate-600">Nilai Tanah:</span>
                <span class="font-semibold">${formatRupiah(landVal)}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
                <span class="text-slate-600">Biaya Baru (RCN):</span>
                <span class="font-mono text-slate-500">${formatRupiah(rcn)}</span>
            </div>
            <div class="flex justify-between items-center text-sm text-red-500">
                <span>(-) Penyusutan (${totalDepPct}%):</span>
                <span class="font-mono">(${formatRupiah(depreciationAmount)})</span>
            </div>
            <div class="flex justify-between items-center text-sm border-t border-slate-200 pt-2 font-semibold">
                <span class="text-slate-600">Nilai Bangunan (Depreciated):</span>
                <span class="text-green-700">${formatRupiah(buildingValue)}</span>
            </div>
            
            <div class="pt-4 mt-2 border-t-2 border-green-100 bg-green-50 p-4 rounded text-center">
                <p class="text-sm font-bold text-green-800 mb-1">Nilai Pasar Properti (Tanah + Bangunan)</p>
                <p class="text-2xl font-bold text-green-700">${formatRupiah(totalValue)}</p>
            </div>
        </div>
    `;
}

// Calculate Income Approach
function calculateIncomeApproach() {
    const gross = parseCurrencyValue('inc-gross');
    const opex = parseCurrencyValue('inc-opex');
    const rate = parseFloat(document.getElementById('inc-rate')?.value) || 0;

    if (rate <= 0) {
        alert("Tingkat Kapitalisasi (Cap Rate) harus lebih besar dari 0.");
        return;
    }

    const noi = gross - opex;
    const value = noi / (rate / 100);

    const resultDiv = document.getElementById('result-income');
    resultDiv.innerHTML = `
        <div class="space-y-3 text-left">
            <div class="flex justify-between items-center text-sm">
                <span class="text-slate-600">Pendapatan Kotor:</span>
                <span class="font-mono">${formatRupiah(gross)}</span>
            </div>
            <div class="flex justify-between items-center text-sm text-red-500">
                <span>(-) Biaya Ops:</span>
                <span class="font-mono">(${formatRupiah(opex)})</span>
            </div>
            <div class="flex justify-between items-center font-bold text-lime-800 border-t border-b border-slate-200 py-2">
                <span>Net Operating Income (NOI):</span>
                <span>${formatRupiah(noi)}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
                <span class="text-slate-600">Cap Rate:</span>
                <span class="font-mono">${rate}%</span>
            </div>

            <div class="pt-4 mt-4 bg-purple-50 p-4 rounded text-center border border-purple-100">
                <p class="text-sm font-bold text-purple-800 mb-1">Indikasi Nilai (Kapitalisasi Langsung)</p>
                <p class="text-3xl font-bold text-purple-700">${formatRupiah(value)}</p>
            </div>
        </div>
    `;
}

// Clear All Data
function clearAllData() {
    if (!confirm('Hapus semua data yang telah diinput?')) return;
    
    // Clear objek
    ['obj-nop', 'obj-pemilik', 'obj-alamat', 'obj-kelurahan', 'obj-kecamatan', 'obj-jenis', 'obj-luas-tanah', 'obj-luas-bangunan', 'obj-tahun', 'obj-kondisi', 'obj-tgl-nilai', 'obj-penilai'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    // Clear pembanding
    document.getElementById('pembanding-container').innerHTML = '';
    pembandingCounter = 0;
    
    // Clear results
    const resultMarket = document.getElementById('result-market');
    if (resultMarket) resultMarket.innerHTML = '<p class="text-slate-400">Silakan masukkan data dan klik hitung</p>';
    
    const tableSummary = document.getElementById('table-summary-body');
    if (tableSummary) tableSummary.innerHTML = '<tr><td colspan="9" class="border p-4 text-center text-slate-400">Belum ada data</td></tr>';
    
    showToast('Data berhasil dihapus!', 'success');
}

// Get All Current Data (for saving)
function getAllCurrentData() {
    const objek = getObjekData();
    const ids = getPembandingIds();
    const pembandingList = ids.map(id => getPembandingData(id));
    
    let totalIndikasi = 0;
    let count = 0;
    pembandingList.forEach(pb => {
        if (pb.harga > 0) {
            totalIndikasi += pb.nilaiIndikasi;
            count++;
        }
    });
    const nilaiPasar = count > 0 ? totalIndikasi / count : 0;
    
    return {
        objek: objek,
        pembanding: pembandingList,
        nilaiPasar: nilaiPasar,
        jumlahPembanding: count
    };
}
