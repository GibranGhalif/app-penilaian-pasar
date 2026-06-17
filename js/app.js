// ==================== MAIN APP LOGIC ====================

// View Navigation Logic
function switchView(viewName) {
    // Hide all views
    const views = ['dashboard', 'calculator', 'users', 'rekap', 'cloud'];
    views.forEach(v => {
        const el = document.getElementById('view-' + v);
        if (el) el.classList.add('hidden');
    });
    
    // Show selected view
    const viewEl = document.getElementById('view-' + viewName);
    if (viewEl) viewEl.classList.remove('hidden');
    
    // Update Navigation Styles
    const navButtons = ['nav-dashboard', 'nav-calculator', 'nav-users', 'nav-rekap', 'nav-cloud'];
    navButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.classList.remove('bg-lime-800', 'text-white');
            btn.classList.add('bg-transparent', 'text-lime-100');
        }
    });

    // Activate current nav button
    const activeBtn = document.getElementById('nav-' + viewName);
    if (activeBtn) {
        activeBtn.classList.remove('bg-transparent', 'text-lime-100');
        activeBtn.classList.add('bg-lime-800', 'text-white');
    }
    
    // View-specific actions
    switch(viewName) {
        case 'users':
            renderUserList();
            break;
        case 'rekap':
            generateRekap();
            break;
        case 'cloud':
            loadFirebaseConfig();
            loadLocalDataList();
            break;
    }
}

// Tab Switching Logic (for Calculator)
function switchTab(tabName) {
    // Hide all sections
    const sections = ['market', 'cost', 'income'];
    sections.forEach(s => {
        const el = document.getElementById('section-' + s);
        if (el) el.classList.add('hidden');
    });

    // Reset tab styles
    sections.forEach(t => {
        const el = document.getElementById('tab-' + t);
        if (el) {
            el.classList.remove('active-tab');
            el.classList.add('inactive-tab');
        }
    });

    // Show selected section
    const sectionEl = document.getElementById('section-' + tabName);
    if (sectionEl) sectionEl.classList.remove('hidden');
    
    // Highlight selected tab
    const activeEl = document.getElementById('tab-' + tabName);
    if (activeEl) {
        activeEl.classList.remove('inactive-tab');
        activeEl.classList.add('active-tab');
    }
}

// Initialize App
function initApp() {
    // Initialize users
    initUsers();
    
    // Set current date to date inputs if empty
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = ['obj-tgl-nilai'];
    dateInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.value) el.value = today;
    });
    
    console.log(`${APP_CONFIG.appName} v${APP_CONFIG.version} initialized`);
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', initApp);
