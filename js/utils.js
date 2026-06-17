// ==================== UTILITY FUNCTIONS ====================

// Format Currency to IDR
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        maximumFractionDigits: 0 
    }).format(number);
}

// Format Input on Keyup (Visual Separators)
function formatInputCurrency(input) {
    let value = input.value.replace(/\D/g, '');
    if (value !== '') {
        value = new Intl.NumberFormat('id-ID').format(value);
    }
    input.value = value;
}

// Parse Formatted Currency String to Number
function parseCurrencyValue(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return 0;
    const raw = el.value;
    const clean = raw.replace(/\./g, '');
    return parseFloat(clean) || 0;
}

// Update Kelurahan dropdown based on Kecamatan
function updateKelurahan(kecamatanSelectId, kelurahanSelectId) {
    const kecamatan = document.getElementById(kecamatanSelectId).value;
    const kelurahanSelect = document.getElementById(kelurahanSelectId);
    
    kelurahanSelect.innerHTML = '<option value="">-- Pilih Kelurahan/Desa --</option>';
    
    if (kecamatan && dataWilayah[kecamatan]) {
        dataWilayah[kecamatan].forEach(kel => {
            const option = document.createElement('option');
            option.value = kel.nama;
            option.textContent = `${kel.nama} (${kel.kodepos})`;
            kelurahanSelect.appendChild(option);
        });
    }
}

// Generate Kecamatan Options HTML
function generateKecamatanOptions() {
    let html = '<option value="">-- Pilih Kecamatan --</option>';
    kecamatanList.forEach(kec => {
        html += `<option value="${kec}">${kec}</option>`;
    });
    return html;
}

// Generate Jenis Properti Options HTML
function generateJenisPropertiOptions() {
    let html = '';
    jenisPropertiOptions.forEach(opt => {
        html += `<option value="${opt.value}">${opt.label}</option>`;
    });
    return html;
}

// Generate Kondisi Bangunan Options HTML
function generateKondisiOptions() {
    let html = '';
    kondisiBangunanOptions.forEach(opt => {
        html += `<option value="${opt.value}">${opt.label}</option>`;
    });
    return html;
}

// Generate Sumber Data Options HTML
function generateSumberDataOptions() {
    let html = '';
    sumberDataOptions.forEach(opt => {
        html += `<option value="${opt.value}">${opt.label}</option>`;
    });
    return html;
}

// Fungsi Terbilang (Number to Words in Indonesian)
function terbilang(angka) {
    const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
    
    if (angka < 12) {
        return bilangan[angka];
    } else if (angka < 20) {
        return terbilang(angka - 10) + ' Belas';
    } else if (angka < 100) {
        return terbilang(Math.floor(angka / 10)) + ' Puluh ' + terbilang(angka % 10);
    } else if (angka < 200) {
        return 'Seratus ' + terbilang(angka - 100);
    } else if (angka < 1000) {
        return terbilang(Math.floor(angka / 100)) + ' Ratus ' + terbilang(angka % 100);
    } else if (angka < 2000) {
        return 'Seribu ' + terbilang(angka - 1000);
    } else if (angka < 1000000) {
        return terbilang(Math.floor(angka / 1000)) + ' Ribu ' + terbilang(angka % 1000);
    } else if (angka < 1000000000) {
        return terbilang(Math.floor(angka / 1000000)) + ' Juta ' + terbilang(angka % 1000000);
    } else if (angka < 1000000000000) {
        return terbilang(Math.floor(angka / 1000000000)) + ' Milyar ' + terbilang(angka % 1000000000);
    } else if (angka < 1000000000000000) {
        return terbilang(Math.floor(angka / 1000000000000)) + ' Triliun ' + terbilang(angka % 1000000000000);
    }
    return '';
}

// Format Date to Indonesian
function formatDateID(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
}

// Format DateTime to Indonesian
function formatDateTimeID(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Generate unique ID
function generateUniqueId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Show toast notification
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all transform translate-y-0 opacity-100`;
    
    switch(type) {
        case 'success':
            toast.classList.add('bg-green-600', 'text-white');
            break;
        case 'error':
            toast.classList.add('bg-red-600', 'text-white');
            break;
        case 'warning':
            toast.classList.add('bg-yellow-500', 'text-white');
            break;
        default:
            toast.classList.add('bg-blue-600', 'text-white');
    }
    
    toast.innerHTML = message;
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Confirm dialog
function confirmDialog(message) {
    return confirm(message);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Local Storage helpers
const storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage get error:', e);
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    }
};
