// ==================== CLOUD STORAGE FUNCTIONS ====================

let firebaseApp = null;
let firebaseDB = null;
let isFirebaseConnected = false;

// Load Firebase Config from LocalStorage
function loadFirebaseConfig() {
    const config = localStorage.getItem('firebase_config');
    if (config) {
        const cfg = JSON.parse(config);
        document.getElementById('firebase-apiKey').value = cfg.apiKey || '';
        document.getElementById('firebase-authDomain').value = cfg.authDomain || '';
        document.getElementById('firebase-databaseURL').value = cfg.databaseURL || '';
        document.getElementById('firebase-projectId').value = cfg.projectId || '';
        document.getElementById('firebase-storageBucket').value = cfg.storageBucket || '';
        
        // Auto-connect if config exists
        if (cfg.apiKey && cfg.databaseURL) {
            connectFirebase();
        }
    }
}

// Save Firebase Config
function saveFirebaseConfig() {
    const config = {
        apiKey: document.getElementById('firebase-apiKey').value.trim(),
        authDomain: document.getElementById('firebase-authDomain').value.trim(),
        databaseURL: document.getElementById('firebase-databaseURL').value.trim(),
        projectId: document.getElementById('firebase-projectId').value.trim(),
        storageBucket: document.getElementById('firebase-storageBucket').value.trim()
    };
    
    localStorage.setItem('firebase_config', JSON.stringify(config));
    showToast('Konfigurasi Firebase berhasil disimpan!', 'success');
}

// Connect to Firebase
function connectFirebase() {
    const config = {
        apiKey: document.getElementById('firebase-apiKey').value.trim(),
        authDomain: document.getElementById('firebase-authDomain').value.trim(),
        databaseURL: document.getElementById('firebase-databaseURL').value.trim(),
        projectId: document.getElementById('firebase-projectId').value.trim(),
        storageBucket: document.getElementById('firebase-storageBucket').value.trim()
    };

    if (!config.apiKey || !config.databaseURL) {
        updateFirebaseStatus('error', 'API Key dan Database URL wajib diisi!');
        return;
    }

    try {
        // Initialize Firebase
        if (typeof firebase !== 'undefined') {
            if (!firebase.apps.length) {
                firebaseApp = firebase.initializeApp(config);
            } else {
                firebaseApp = firebase.app();
            }
            
            firebaseDB = firebase.database();
            isFirebaseConnected = true;
            
            updateFirebaseStatus('success', 'Terhubung ke Firebase!');
            loadCloudData();
        } else {
            updateFirebaseStatus('error', 'Firebase SDK tidak tersedia');
        }
        
    } catch (error) {
        console.error('Firebase connection error:', error);
        updateFirebaseStatus('error', 'Gagal terhubung: ' + error.message);
        isFirebaseConnected = false;
    }
}

// Update Firebase Status Display
function updateFirebaseStatus(type, message) {
    const statusEl = document.getElementById('firebase-status');
    if (!statusEl) return;
    
    if (type === 'success') {
        statusEl.className = 'mt-4 p-3 rounded text-sm bg-green-100 text-green-700';
        statusEl.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>${message}`;
    } else if (type === 'error') {
        statusEl.className = 'mt-4 p-3 rounded text-sm bg-red-100 text-red-700';
        statusEl.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>${message}`;
    } else {
        statusEl.className = 'mt-4 p-3 rounded text-sm bg-slate-100 text-slate-600';
        statusEl.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-slate-400 mr-2"></span>${message}`;
    }
}

// Save to Cloud
function saveToCloud() {
    if (!isFirebaseConnected) {
        alert('Silakan hubungkan Firebase terlebih dahulu!');
        return;
    }

    const title = document.getElementById('cloud-save-title').value.trim();
    const notes = document.getElementById('cloud-save-notes').value.trim();
    
    if (!title) {
        alert('Masukkan nama/judul penilaian!');
        return;
    }

    const data = getAllCurrentData();
    const saveData = {
        title: title,
        notes: notes,
        data: data,
        createdBy: currentUser ? currentUser.username : 'unknown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const newKey = firebaseDB.ref('penilaian').push().key;
    
    firebaseDB.ref('penilaian/' + newKey).set(saveData)
        .then(() => {
            showToast('Data berhasil disimpan ke cloud!', 'success');
            document.getElementById('cloud-save-title').value = '';
            document.getElementById('cloud-save-notes').value = '';
            loadCloudData();
        })
        .catch((error) => {
            showToast('Gagal menyimpan: ' + error.message, 'error');
        });
}

// Save to Local Storage
function saveToLocal() {
    const title = document.getElementById('cloud-save-title').value.trim();
    const notes = document.getElementById('cloud-save-notes').value.trim();
    
    if (!title) {
        alert('Masukkan nama/judul penilaian!');
        return;
    }

    const data = getAllCurrentData();
    const saveData = {
        id: 'local_' + Date.now(),
        title: title,
        notes: notes,
        data: data,
        createdBy: currentUser ? currentUser.username : 'unknown',
        createdAt: new Date().toISOString()
    };

    let localData = JSON.parse(localStorage.getItem('penilaian_local') || '[]');
    localData.unshift(saveData);
    localStorage.setItem('penilaian_local', JSON.stringify(localData));
    
    showToast('Data berhasil disimpan secara lokal!', 'success');
    document.getElementById('cloud-save-title').value = '';
    document.getElementById('cloud-save-notes').value = '';
    loadLocalDataList();
}

// Load Cloud Data
function loadCloudData() {
    if (!isFirebaseConnected) {
        return;
    }

    const listEl = document.getElementById('cloud-data-list');
    if (!listEl) return;
    
    listEl.innerHTML = '<div class="text-center py-4 text-slate-400"><div class="spinner mx-auto mb-2"></div>Memuat data...</div>';

    firebaseDB.ref('penilaian').orderByChild('createdAt').once('value')
        .then((snapshot) => {
            const data = snapshot.val();
            if (!data) {
                listEl.innerHTML = '<div class="text-center py-8 text-slate-400">Belum ada data tersimpan di cloud</div>';
                return;
            }

            const items = Object.entries(data).map(([key, val]) => ({ key, ...val }));
            items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            listEl.innerHTML = '';
            items.forEach(item => {
                listEl.appendChild(createDataCard(item, 'cloud'));
            });
        })
        .catch((error) => {
            listEl.innerHTML = `<div class="text-center py-4 text-red-500">Error: ${error.message}</div>`;
        });
}

// Load Local Data List
function loadLocalDataList() {
    const listEl = document.getElementById('local-data-list');
    if (!listEl) return;
    
    const localData = JSON.parse(localStorage.getItem('penilaian_local') || '[]');

    if (localData.length === 0) {
        listEl.innerHTML = '<div class="text-center py-8 text-slate-400">Belum ada data tersimpan secara lokal</div>';
        return;
    }

    listEl.innerHTML = '';
    localData.forEach(item => {
        listEl.appendChild(createDataCard(item, 'local'));
    });
}

// Create Data Card Element
function createDataCard(item, type) {
    const card = document.createElement('div');
    card.className = 'bg-slate-50 border rounded-lg p-4 hover:shadow-md transition card-hover';
    
    const dateStr = formatDateTimeID(item.createdAt);
    const nilaiStr = item.data?.nilaiPasar ? formatRupiah(item.data.nilaiPasar) : '-';
    const nop = item.data?.objek?.nop || '-';
    const alamat = item.data?.objek?.alamat || '-';
    
    card.innerHTML = `
        <div class="flex justify-between items-start">
            <div class="flex-1">
                <h4 class="font-bold text-slate-800">${item.title}</h4>
                <p class="text-xs text-slate-500 mt-1">${dateStr} ${item.createdBy ? '• ' + item.createdBy : ''}</p>
                <div class="mt-2 text-sm space-y-1">
                    <p><span class="text-slate-500">NOP:</span> ${nop}</p>
                    <p><span class="text-slate-500">Alamat:</span> ${alamat}</p>
                    <p><span class="text-slate-500">Nilai Pasar:</span> <span class="font-bold text-lime-600">${nilaiStr}</span></p>
                    <p><span class="text-slate-500">Pembanding:</span> ${item.data?.jumlahPembanding || 0} data</p>
                </div>
                ${item.notes ? `<p class="text-xs text-slate-400 mt-2 italic">"${item.notes}"</p>` : ''}
            </div>
            <div class="flex flex-col gap-2 ml-4">
                <button onclick="loadDataToForm('${item.key || item.id}', '${type}')" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold transition">
                    Load
                </button>
                <button onclick="deleteData('${item.key || item.id}', '${type}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold transition">
                    Hapus
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Switch Storage Tab
function switchStorageTab(tab) {
    const cloudTab = document.getElementById('storage-tab-cloud');
    const localTab = document.getElementById('storage-tab-local');
    const cloudList = document.getElementById('cloud-data-list');
    const localList = document.getElementById('local-data-list');

    if (tab === 'cloud') {
        cloudTab.className = 'px-4 py-2 border-b-2 border-purple-500 text-purple-600 font-semibold text-sm';
        localTab.className = 'px-4 py-2 text-slate-500 hover:text-slate-700 text-sm';
        cloudList.classList.remove('hidden');
        localList.classList.add('hidden');
    } else {
        localTab.className = 'px-4 py-2 border-b-2 border-purple-500 text-purple-600 font-semibold text-sm';
        cloudTab.className = 'px-4 py-2 text-slate-500 hover:text-slate-700 text-sm';
        localList.classList.remove('hidden');
        cloudList.classList.add('hidden');
        loadLocalDataList();
    }
}

// Load Data to Form
function loadDataToForm(id, type) {
    if (type === 'cloud' && isFirebaseConnected) {
        firebaseDB.ref('penilaian/' + id).once('value')
            .then((snapshot) => {
                const itemData = snapshot.val();
                if (itemData) {
                    applyDataToForm(itemData.data);
                    showToast('Data berhasil dimuat ke form!', 'success');
                    switchView('calculator');
                }
            });
    } else if (type === 'local') {
        const localData = JSON.parse(localStorage.getItem('penilaian_local') || '[]');
        const item = localData.find(d => d.id === id);
        if (item) {
            applyDataToForm(item.data);
            showToast('Data berhasil dimuat ke form!', 'success');
            switchView('calculator');
        }
    }
}

// Apply Data to Form
function applyDataToForm(data) {
    if (!data) return;

    // Clear existing without confirmation
    document.getElementById('pembanding-container').innerHTML = '';
    pembandingCounter = 0;

    // Apply Objek
    if (data.objek) {
        document.getElementById('obj-nop').value = data.objek.nop || '';
        document.getElementById('obj-pemilik').value = data.objek.pemilik || '';
        document.getElementById('obj-alamat').value = data.objek.alamat || '';
        document.getElementById('obj-kecamatan').value = data.objek.kecamatan || '';
        updateKelurahan('obj-kecamatan', 'obj-kelurahan');
        setTimeout(() => {
            document.getElementById('obj-kelurahan').value = data.objek.kelurahan || '';
        }, 100);
        document.getElementById('obj-jenis').value = data.objek.jenis || '';
        document.getElementById('obj-luas-tanah').value = data.objek.luasTanah || '';
        document.getElementById('obj-luas-bangunan').value = data.objek.luasBangunan || '';
        document.getElementById('obj-tahun').value = data.objek.tahun || '';
        document.getElementById('obj-kondisi').value = data.objek.kondisi || '';
        document.getElementById('obj-tgl-nilai').value = data.objek.tglNilai || '';
        document.getElementById('obj-penilai').value = data.objek.penilai || '';
    }

    // Apply Pembanding
    if (data.pembanding && data.pembanding.length > 0) {
        data.pembanding.forEach((pb, index) => {
            addPembanding();
            const id = pembandingCounter;
            const prefix = `pb${id}-`;

            document.getElementById(prefix + 'nop').value = pb.nop || '';
            document.getElementById(prefix + 'pemilik').value = pb.pemilik || '';
            document.getElementById(prefix + 'alamat').value = pb.alamat || '';
            document.getElementById(prefix + 'kecamatan').value = pb.kecamatan || '';
            updateKelurahan(prefix + 'kecamatan', prefix + 'kelurahan');
            setTimeout(() => {
                document.getElementById(prefix + 'kelurahan').value = pb.kelurahan || '';
            }, 100 + (index * 50));
            document.getElementById(prefix + 'jenis').value = pb.jenis || '';
            document.getElementById(prefix + 'luas-tanah').value = pb.luasTanah || '';
            document.getElementById(prefix + 'luas-bangunan').value = pb.luasBangunan || '';
            document.getElementById(prefix + 'tahun').value = pb.tahun || '';
            document.getElementById(prefix + 'kondisi').value = pb.kondisi || '';
            document.getElementById(prefix + 'harga').value = pb.harga ? new Intl.NumberFormat('id-ID').format(pb.harga) : '';
            document.getElementById(prefix + 'tgl-transaksi').value = pb.tglTransaksi || '';
            document.getElementById(prefix + 'sumber').value = pb.sumber || '';
            document.getElementById(prefix + 'adj').value = pb.adj || '';
            document.getElementById(prefix + 'keterangan').value = pb.keterangan || '';
        });
    }
}

// Delete Data
function deleteData(id, type) {
    if (!confirm('Yakin ingin menghapus data ini?')) return;

    if (type === 'cloud' && isFirebaseConnected) {
        firebaseDB.ref('penilaian/' + id).remove()
            .then(() => {
                showToast('Data berhasil dihapus!', 'success');
                loadCloudData();
            })
            .catch((error) => {
                showToast('Gagal menghapus: ' + error.message, 'error');
            });
    } else if (type === 'local') {
        let localData = JSON.parse(localStorage.getItem('penilaian_local') || '[]');
        localData = localData.filter(d => d.id !== id);
        localStorage.setItem('penilaian_local', JSON.stringify(localData));
        showToast('Data berhasil dihapus!', 'success');
        loadLocalDataList();
    }
}
