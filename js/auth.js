// ==================== AUTHENTICATION & USER MANAGEMENT ====================

let users = [];
let currentUser = null;

// Initialize Users
function initUsers() {
    const storedUsers = localStorage.getItem('app_users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    } else {
        users = [{ username: 'admin', password: 'admin', role: 'admin' }];
        localStorage.setItem('app_users', JSON.stringify(users));
    }
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    const userIn = document.getElementById('username').value.trim();
    const passIn = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    // Refresh users from storage
    initUsers();

    const foundUser = users.find(u => u.username === userIn && u.password === passIn);

    if (foundUser) {
        currentUser = foundUser;
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-content').classList.remove('hidden');
        errorMsg.classList.add('hidden');
        
        // Update welcome message
        updateWelcomeMessage(foundUser.username);
        
        // Set default view to dashboard
        switchView('dashboard');
    } else {
        errorMsg.classList.remove('hidden');
        // Shake animation
        const loginBox = document.querySelector('#login-screen > div:last-child');
        loginBox.classList.add('animate-shake');
        setTimeout(() => loginBox.classList.remove('animate-shake'), 500);
    }
}

// Logout
function logout() {
    currentUser = null;
    document.getElementById('app-content').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('password').value = '';
    document.getElementById('username').value = '';
}

// Update Welcome Message
function updateWelcomeMessage(username) {
    const welcomeEl = document.getElementById('welcome-username');
    if (welcomeEl) {
        welcomeEl.textContent = username;
    }
}

// Handle Add User
function handleAddUser(e) {
    e.preventDefault();
    const newU = document.getElementById('new-username').value.trim();
    const newP = document.getElementById('new-password').value.trim();
    
    if (!newU || !newP) {
        alert('Username dan password harus diisi!');
        return;
    }
    
    // Check if exists
    if (users.some(u => u.username.toLowerCase() === newU.toLowerCase())) {
        alert('Username sudah ada!');
        return;
    }
    
    users.push({ username: newU, password: newP, role: 'user' });
    localStorage.setItem('app_users', JSON.stringify(users));
    
    document.getElementById('new-username').value = '';
    document.getElementById('new-password').value = '';
    
    renderUserList();
    showToast('User berhasil ditambahkan!', 'success');
}

// Delete User
function deleteUser(username) {
    if (username === 'admin') {
        alert('Admin utama tidak bisa dihapus.');
        return;
    }
    
    if (confirm('Hapus user ' + username + '?')) {
        users = users.filter(u => u.username !== username);
        localStorage.setItem('app_users', JSON.stringify(users));
        renderUserList();
        showToast('User berhasil dihapus!', 'success');
    }
}

// Render User List
function renderUserList() {
    const tbody = document.getElementById('user-list-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    users.forEach(u => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50';
        tr.innerHTML = `
            <td class="px-4 py-3 font-medium text-slate-700">
                <div class="flex items-center gap-2">
                    <span class="w-8 h-8 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center font-bold text-sm">
                        ${u.username.charAt(0).toUpperCase()}
                    </span>
                    ${u.username}
                    ${u.role === 'admin' ? '<span class="text-xs bg-lime-200 text-lime-800 px-2 py-0.5 rounded">Admin</span>' : ''}
                </div>
            </td>
            <td class="px-4 py-3 text-right">
                ${u.username !== 'admin' ? 
                  `<button onclick="deleteUser('${u.username}')" class="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 px-3 py-1 rounded hover:bg-red-100 transition">Hapus</button>` : 
                  `<span class="text-slate-400 text-xs italic">Tidak dapat dihapus</span>`}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Check if user is admin
function isAdmin() {
    return currentUser && currentUser.role === 'admin';
}

// Initialize on load
initUsers();
