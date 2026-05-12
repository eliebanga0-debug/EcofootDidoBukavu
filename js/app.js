// ==================== MAIN APP CONTROLLER ====================

const app = {
    currentUser: null,
    users: [],
    students: [],
    staff: [],
    parents: [],
    players: [],
    messages: [],
    payments: [],
    meetings: [],
    auditLogs: [],
    notifications: [],
    systemSettings: {
        siteName: 'Ecofoot Bukavu',
        maintenanceMode: false,
        allowRegistration: true,
        maxUploadSize: 5242880,
        sessionTimeout: 3600000
    },

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.checkAuth();
        this.checkSessionTimeout();
    },

    // ==================== SESSION MANAGEMENT ====================
    checkSessionTimeout() {
        const sessionStartTime = localStorage.getItem('sessionStartTime');
        if (this.currentUser && sessionStartTime) {
            const elapsed = Date.now() - parseInt(sessionStartTime);
            if (elapsed > this.systemSettings.sessionTimeout) {
                this.logout();
                this.showAlert('Votre session a expiré. Veuillez vous reconnecter.', 'warning');
                window.location.href = 'login.html';
            }
        }
    },

    // ==================== AUDIT LOGGING ====================
    addAuditLog(action, details = {}) {
        const log = {
            id: Date.now(),
            userId: this.currentUser?.id || 'anonymous',
            userName: this.currentUser?.fullName || 'Anonymous',
            userRole: this.currentUser?.role || 'none',
            action: action,
            details: details,
            timestamp: new Date().toISOString(),
            ipAddress: this.getClientIP(),
            userAgent: navigator.userAgent
        };
        this.auditLogs.push(log);
        this.saveToStorage();
        return log;
    },

    getClientIP() {
        // In a real application, this would come from the server
        return 'Client-Side'; // Placeholder
    },

    getAuditLogs(filters = {}) {
        let logs = [...this.auditLogs];
        
        if (filters.userId) {
            logs = logs.filter(l => l.userId === filters.userId);
        }
        if (filters.action) {
            logs = logs.filter(l => l.action === filters.action);
        }
        if (filters.startDate) {
            logs = logs.filter(l => new Date(l.timestamp) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            logs = logs.filter(l => new Date(l.timestamp) <= new Date(filters.endDate));
        }

        return logs.reverse();
    },

    // ==================== NOTIFICATIONS ====================
    addNotification(title, message, type = 'info') {
        const notification = {
            id: Date.now(),
            title: title,
            message: message,
            type: type,
            timestamp: new Date().toISOString(),
            read: false
        };
        this.notifications.push(notification);
        this.saveToStorage();
        return notification;
    },

    getNotifications(unreadOnly = false) {
        if (unreadOnly) {
            return this.notifications.filter(n => !n.read);
        }
        return this.notifications;
    },

    markNotificationAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveToStorage();
        }
    },

    // ==================== AUTHENTICATION ====================
    register(userData) {
        // Check if registration is disabled
        if (!this.systemSettings.allowRegistration && userData.role !== 'admin') {
            return { success: false, message: 'Les inscriptions sont actuellement désactivées' };
        }

        // Check if user exists
        if (this.users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Cet email est déjà enregistré' };
        }

        const newUser = {
            id: Date.now(),
            ...userData,
            registeredDate: new Date().toISOString(),
            active: true,
            loginAttempts: 0
        };

        this.users.push(newUser);
        this.saveToStorage();

        // Add to specific collection based on role
        if (userData.role === 'student') {
            this.students.push({ ...newUser, studentId: `STU-${newUser.id}` });
        } else if (userData.role === 'parent') {
            this.parents.push({ ...newUser, parentId: `PAR-${newUser.id}` });
        } else if (userData.role === 'staff') {
            this.staff.push({ ...newUser, staffId: `STF-${newUser.id}`, department: userData.department });
        }

        this.saveToStorage();
        this.addAuditLog('USER_REGISTRATION', { email: userData.email, role: userData.role });
        return { success: true, message: 'Inscription réussie' };
    },

    login(email, password) {
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            this.addAuditLog('LOGIN_FAILED', { email: email, reason: 'User not found' });
            return { success: false, message: 'Email ou mot de passe invalide' };
        }

        if (user.password !== password) {
            user.loginAttempts = (user.loginAttempts || 0) + 1;
            if (user.loginAttempts > 5) {
                user.active = false;
                this.saveToStorage();
                this.addAuditLog('LOGIN_FAILED', { email: email, reason: 'Too many failed attempts', userId: user.id });
                return { success: false, message: 'Compte verrouillé après trop de tentatives' };
            }
            this.saveToStorage();
            this.addAuditLog('LOGIN_FAILED', { email: email, reason: 'Invalid password' });
            return { success: false, message: 'Email ou mot de passe invalide' };
        }

        if (!user.active) {
            this.addAuditLog('LOGIN_FAILED', { email: email, reason: 'Account disabled', userId: user.id });
            return { success: false, message: 'Ce compte est désactivé' };
        }

        user.loginAttempts = 0;
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('sessionStartTime', Date.now().toString());
        this.saveToStorage();
        this.addAuditLog('LOGIN_SUCCESS', { email: email, userId: user.id });
        return { success: true, user };
    },

    logout() {
        if (this.currentUser) {
            this.addAuditLog('LOGOUT', { userId: this.currentUser.id });
        }
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionStartTime');
    },

    checkAuth() {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            this.currentUser = JSON.parse(stored);
        }
    },

    // ==================== SECURITY & ADMIN ONLY ====================
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    },

    isAdminOrStaff() {
        return this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'staff');
    },

    requireAdmin() {
        if (!this.isAdmin()) {
            this.addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', { attemptedRole: this.currentUser?.role });
            throw new Error('Accès refusé: privilèges administrateur requis');
        }
        return true;
    },

    // ==================== SYSTEM SETTINGS (ADMIN ONLY) ====================
    getSystemSettings() {
        this.requireAdmin();
        return this.systemSettings;
    },

    updateSystemSettings(updates) {
        this.requireAdmin();
        const oldSettings = { ...this.systemSettings };
        Object.assign(this.systemSettings, updates);
        this.saveToStorage();
        this.addAuditLog('SYSTEM_SETTINGS_UPDATED', { changes: updates });
        return { success: true, settings: this.systemSettings };
    },

    toggleMaintenanceMode(enabled) {
        this.requireAdmin();
        this.systemSettings.maintenanceMode = enabled;
        this.saveToStorage();
        this.addAuditLog('MAINTENANCE_MODE', { enabled: enabled });
        return { success: true };
    },

    // ==================== BACKUP & EXPORT (ADMIN ONLY) ====================
    exportSystemData() {
        this.requireAdmin();
        const data = {
            timestamp: new Date().toISOString(),
            users: this.users,
            students: this.students,
            staff: this.staff,
            parents: this.parents,
            players: this.players,
            messages: this.messages,
            payments: this.payments,
            meetings: this.meetings,
            auditLogs: this.auditLogs
        };
        this.addAuditLog('SYSTEM_DATA_EXPORTED', { dataSize: JSON.stringify(data).length });
        return data;
    },

    clearAllData() {
        this.requireAdmin();
        const confirmation = confirm('⚠️ ATTENTION: Cela supprimera TOUTES les données du système. Cette action est IRRÉVERSIBLE!');
        if (!confirmation) return { success: false, message: 'Opération annulée' };

        this.users = [];
        this.students = [];
        this.staff = [];
        this.parents = [];
        this.players = [];
        this.messages = [];
        this.payments = [];
        this.meetings = [];
        this.notifications = [];
        
        this.saveToStorage();
        this.addAuditLog('SYSTEM_DATA_CLEARED', {});
        return { success: true, message: 'Toutes les données ont été supprimées' };
    },

    // ==================== USER MANAGEMENT ====================
    getAllUsers() {
        if (!this.isAdminOrStaff()) {
            this.addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', { attemptedAction: 'Get all users' });
            throw new Error('Accès refusé');
        }
        return this.users;
    },

    getUserById(id) {
        const user = this.users.find(u => u.id === parseInt(id));
        if (!user && this.currentUser && this.currentUser.id !== parseInt(id)) {
            this.addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', { attemptedAction: 'Get user', userId: id });
        }
        return user;
    },

    updateUser(id, updates) {
        const user = this.getUserById(id);
        if (user) {
            // Non-admin users can only update their own profile
            if (!this.isAdmin() && this.currentUser.id !== parseInt(id)) {
                this.addAuditLog('UNAUTHORIZED_UPDATE_ATTEMPT', { targetUserId: id });
                throw new Error('Vous ne pouvez modifier que votre propre profil');
            }

            const oldData = { ...user };
            Object.assign(user, updates);
            this.saveToStorage();
            this.addAuditLog('USER_UPDATED', { targetUserId: id, changes: updates });
            return { success: true, user };
        }
        return { success: false, message: 'Utilisateur non trouvé' };
    },

    deleteUser(id) {
        this.requireAdmin();
        this.users = this.users.filter(u => u.id !== parseInt(id));
        this.students = this.students.filter(s => s.id !== parseInt(id));
        this.staff = this.staff.filter(s => s.id !== parseInt(id));
        this.parents = this.parents.filter(p => p.id !== parseInt(id));
        this.saveToStorage();
        this.addAuditLog('USER_DELETED', { deletedUserId: id });
        return { success: true };
    },

    disableUser(id) {
        this.requireAdmin();
        const user = this.getUserById(id);
        if (user && user.role !== 'admin') {
            user.active = false;
            this.saveToStorage();
            this.addAuditLog('USER_DISABLED', { userId: id });
            return { success: true };
        }
        return { success: false, message: 'Impossible de désactiver cet utilisateur' };
    },

    enableUser(id) {
        this.requireAdmin();
        const user = this.getUserById(id);
        if (user) {
            user.active = true;
            user.loginAttempts = 0;
            this.saveToStorage();
            this.addAuditLog('USER_ENABLED', { userId: id });
            return { success: true };
        }
        return { success: false };
    },

    resetPassword(userId, newPassword) {
        this.requireAdmin();
        const user = this.getUserById(userId);
        if (user) {
            user.password = newPassword;
            user.loginAttempts = 0;
            this.saveToStorage();
            this.addAuditLog('PASSWORD_RESET', { userId: userId });
            return { success: true };
        }
        return { success: false };
    },

    // ==================== STUDENT MANAGEMENT ====================
    getStudents() {
        return this.students;
    },

    addStudent(studentData) {
        const user = {
            id: Date.now(),
            ...studentData,
            role: 'student',
            registeredDate: new Date().toISOString()
        };
        this.users.push(user);
        this.students.push({ ...user, studentId: `STU-${user.id}` });
        this.saveToStorage();
        return { success: true, student: user };
    },

    updateStudent(id, updates) {
        const student = this.students.find(s => s.id === parseInt(id));
        if (student) {
            Object.assign(student, updates);
            const user = this.getUserById(id);
            if (user) Object.assign(user, updates);
            this.saveToStorage();
            return { success: true, student };
        }
        return { success: false };
    },

    // ==================== STAFF MANAGEMENT ====================
    getStaff() {
        return this.staff;
    },

    addStaff(staffData) {
        const user = {
            id: Date.now(),
            ...staffData,
            role: 'staff',
            registeredDate: new Date().toISOString()
        };
        this.users.push(user);
        this.staff.push({ ...user, staffId: `STF-${user.id}` });
        this.saveToStorage();
        return { success: true, staff: user };
    },

    updateStaff(id, updates) {
        const staff = this.staff.find(s => s.id === parseInt(id));
        if (staff) {
            Object.assign(staff, updates);
            const user = this.getUserById(id);
            if (user) Object.assign(user, updates);
            this.saveToStorage();
            return { success: true, staff };
        }
        return { success: false };
    },

    // ==================== PLAYER DIRECTORY ====================
    getPlayers() {
        return this.players;
    },

    addPlayer(playerData) {
        const player = {
            id: Date.now(),
            ...playerData,
            joinDate: new Date().toISOString(),
            status: 'active'
        };
        this.players.push(player);
        this.saveToStorage();
        return { success: true, player };
    },

    updatePlayer(id, updates) {
        const player = this.players.find(p => p.id === parseInt(id));
        if (player) {
            Object.assign(player, updates);
            this.saveToStorage();
            return { success: true, player };
        }
        return { success: false };
    },

    deletePlayer(id) {
        this.players = this.players.filter(p => p.id !== parseInt(id));
        this.saveToStorage();
        return { success: true };
    },

    // ==================== MESSAGING / CHAT ====================
    sendMessage(from, to, content, meetingId = null) {
        const message = {
            id: Date.now(),
            from,
            to,
            content,
            timestamp: new Date().toISOString(),
            read: false,
            meetingId
        };
        this.messages.push(message);
        this.saveToStorage();
        return { success: true, message };
    },

    getMessages(userId1, userId2) {
        return this.messages.filter(m =>
            (m.from === userId1 && m.to === userId2) ||
            (m.from === userId2 && m.to === userId1)
        );
    },

    getMeetingMessages(meetingId) {
        return this.messages.filter(m => m.meetingId === meetingId);
    },

    getConversations(userId) {
        const conversations = new Map();
        this.messages.forEach(m => {
            const otherId = m.from === userId ? m.to : m.from;
            if (!conversations.has(otherId)) {
                const otherUser = this.getUserById(otherId);
                conversations.set(otherId, {
                    userId: otherId,
                    userName: otherUser?.fullName || 'Unknown',
                    lastMessage: m.content,
                    timestamp: m.timestamp,
                    unread: m.to === userId && !m.read ? 1 : 0
                });
            }
        });
        return Array.from(conversations.values());
    },

    // ==================== MEETINGS ====================
    createMeeting(meetingData) {
        const meeting = {
            id: Date.now(),
            ...meetingData,
            createdDate: new Date().toISOString(),
            status: 'scheduled',
            participants: []
        };
        this.meetings.push(meeting);
        this.saveToStorage();
        return { success: true, meeting };
    },

    getMeetings() {
        return this.meetings;
    },

    getMeetingById(id) {
        return this.meetings.find(m => m.id === parseInt(id));
    },

    updateMeeting(id, updates) {
        const meeting = this.getMeetingById(id);
        if (meeting) {
            Object.assign(meeting, updates);
            this.saveToStorage();
            return { success: true, meeting };
        }
        return { success: false };
    },

    addMeetingParticipant(meetingId, userId) {
        const meeting = this.getMeetingById(meetingId);
        if (meeting && !meeting.participants.includes(userId)) {
            meeting.participants.push(userId);
            this.saveToStorage();
            return { success: true };
        }
        return { success: false };
    },

    // ==================== PAYMENTS ====================
    addPayment(paymentData) {
        const payment = {
            id: Date.now(),
            ...paymentData,
            date: new Date().toISOString(),
            status: 'pending',
            transactionId: `TXN-${Date.now()}`
        };
        this.payments.push(payment);
        this.saveToStorage();
        this.addAuditLog('PAYMENT_CREATED', { paymentId: payment.id, amount: paymentData.amount });
        this.addNotification('Nouveau Paiement', `Paiement de ${paymentData.amount} FC créé`, 'info');
        return { success: true, payment };
    },

    getPayments(userId = null) {
        if (userId) {
            if (!this.isAdmin() && this.currentUser.id !== userId) {
                throw new Error('Vous ne pouvez voir que vos propres paiements');
            }
            return this.payments.filter(p => p.userId === userId);
        }
        this.requireAdmin();
        return this.payments;
    },

    updatePaymentStatus(id, status) {
        this.requireAdmin();
        const payment = this.payments.find(p => p.id === parseInt(id));
        if (payment) {
            payment.status = status;
            this.saveToStorage();
            this.addAuditLog('PAYMENT_STATUS_UPDATED', { paymentId: id, newStatus: status });
            
            if (status === 'completed') {
                this.addNotification('Paiement Approuvé', `Paiement #${id} approuvé`, 'success');
            } else if (status === 'rejected') {
                this.addNotification('Paiement Rejeté', `Paiement #${id} rejeté`, 'danger');
            }
            return { success: true, payment };
        }
        return { success: false };
    },

    getFinancialReport() {
        this.requireAdmin();
        const report = {
            totalRevenue: 0,
            totalPending: 0,
            totalCompleted: 0,
            totalRejected: 0,
            paymentsByStatus: {},
            reportDate: new Date().toISOString()
        };

        this.payments.forEach(p => {
            if (p.status === 'completed') {
                report.totalRevenue += p.amount || 0;
                report.totalCompleted += 1;
            } else if (p.status === 'pending') {
                report.totalPending += p.amount || 0;
            } else if (p.status === 'rejected') {
                report.totalRejected += 1;
            }
        });

        this.addAuditLog('FINANCIAL_REPORT_GENERATED', {});
        return report;
    },

    // ==================== STORAGE ====================
    saveToStorage() {
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('students', JSON.stringify(this.students));
        localStorage.setItem('staff', JSON.stringify(this.staff));
        localStorage.setItem('parents', JSON.stringify(this.parents));
        localStorage.setItem('players', JSON.stringify(this.players));
        localStorage.setItem('messages', JSON.stringify(this.messages));
        localStorage.setItem('payments', JSON.stringify(this.payments));
        localStorage.setItem('meetings', JSON.stringify(this.meetings));
        localStorage.setItem('auditLogs', JSON.stringify(this.auditLogs));
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
        localStorage.setItem('systemSettings', JSON.stringify(this.systemSettings));
    },

    loadFromStorage() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.students = JSON.parse(localStorage.getItem('students')) || [];
        this.staff = JSON.parse(localStorage.getItem('staff')) || [];
        this.parents = JSON.parse(localStorage.getItem('parents')) || [];
        this.players = JSON.parse(localStorage.getItem('players')) || [];
        this.messages = JSON.parse(localStorage.getItem('messages')) || [];
        this.payments = JSON.parse(localStorage.getItem('payments')) || [];
        this.meetings = JSON.parse(localStorage.getItem('meetings')) || [];
        this.auditLogs = JSON.parse(localStorage.getItem('auditLogs')) || [];
        this.notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        const settingsData = localStorage.getItem('systemSettings');
        if (settingsData) {
            this.systemSettings = JSON.parse(settingsData);
        }
        this.checkAuth();
    },

    // ==================== UTILITIES ====================
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                const result = this.login(email, password);
                if (result.success) {
                    this.showAlert('Login successful!', 'success');
                    setTimeout(() => window.location.href = `${result.user.role}-dashboard.html`, 1000);
                } else {
                    this.showAlert(result.message, 'danger');
                }
            });
        }

        // Registration form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(registerForm);
                const userData = Object.fromEntries(formData);
                const result = this.register(userData);
                if (result.success) {
                    this.showAlert(result.message, 'success');
                    setTimeout(() => window.location.href = 'login.html', 1500);
                } else {
                    this.showAlert(result.message, 'danger');
                }
            });
        }

        // Logout button
        document.querySelectorAll('.logout-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.logout();
                window.location.href = 'index.html';
            });
        });
    },

    showAlert(message, type = 'info') {
        const alertsContainer = document.getElementById('alerts');
        if (alertsContainer) {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.textContent = message;
            alertsContainer.appendChild(alert);
            setTimeout(() => alert.remove(), 5000);
        }
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },

    formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// ==================== TAB MANAGEMENT ====================
function switchTab(tabName) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });

    // Deactivate all tab buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected content
    const selectedContent = document.getElementById(`${tabName}-content`);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }

    // Activate selected button - find by data-tab attribute
    const selectedButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    } else {
        // Fallback: find by onclick attribute
        const buttons = document.querySelectorAll('.tab-button');
        for (let btn of buttons) {
            if (btn.getAttribute('onclick') === `switchTab('${tabName}')`) {
                btn.classList.add('active');
                break;
            }
        }
    }
}

// ==================== MODAL MANAGEMENT ====================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ==================== PAYMENT PROCESSING ====================
function processPayment(paymentData) {
    // Simulate payment processing
    const result = app.addPayment(paymentData);
    if (result.success) {
        // Simulate successful payment after 2 seconds
        setTimeout(() => {
            app.updatePaymentStatus(result.payment.id, 'completed');
            app.showAlert('Payment processed successfully!', 'success');
        }, 2000);
    }
    return result;
}

// ==================== DASHBOARD STATS ====================
function getStats() {
    return {
        totalUsers: app.users.length,
        totalStudents: app.students.length,
        totalStaff: app.staff.length,
        totalParents: app.parents.length,
        totalPlayers: app.players.length,
        totalPayments: app.payments.length,
        pendingPayments: app.payments.filter(p => p.status === 'pending').length,
        completedPayments: app.payments.filter(p => p.status === 'completed').length
    };
}

// Initialize demo data if needed
function initializeDemoData() {
    if (app.users.length === 0) {
        // Demo users
        const demoUsers = [
            {
                id: 1,
                fullName: 'Admin User',
                email: 'admin@ecofoot.com',
                password: 'admin123',
                role: 'admin',
                phone: '+243999999999',
                registeredDate: new Date().toISOString(),
                active: true
            },
            {
                id: 2,
                fullName: 'John Doe',
                email: 'john@ecofoot.com',
                password: 'student123',
                role: 'student',
                phone: '+243991234567',
                registeredDate: new Date().toISOString(),
                active: true
            },
            {
                id: 3,
                fullName: 'Jane Smith',
                email: 'jane@ecofoot.com',
                password: 'parent123',
                role: 'parent',
                phone: '+243992234567',
                registeredDate: new Date().toISOString(),
                active: true
            },
            {
                id: 4,
                fullName: 'Bob Manager',
                email: 'bob@ecofoot.com',
                password: 'staff123',
                role: 'staff',
                phone: '+243993234567',
                department: 'Administration',
                registeredDate: new Date().toISOString(),
                active: true
            }
        ];

        app.users = demoUsers;
        app.students = [{ ...demoUsers[1], studentId: 'STU-2' }];
        app.parents = [{ ...demoUsers[2], parentId: 'PAR-3' }];
        app.staff = [{ ...demoUsers[3], staffId: 'STF-4' }];

        // Demo players
        app.players = [
            {
                id: 101,
                firstName: 'Kaka',
                lastName: 'Mukanda',
                position: 'Forward',
                number: 10,
                team: 'Ecofoot A',
                joinDate: new Date().toISOString(),
                status: 'active'
            },
            {
                id: 102,
                firstName: 'Tata',
                lastName: 'Mwanda',
                position: 'Goalkeeper',
                number: 1,
                team: 'Ecofoot B',
                joinDate: new Date().toISOString(),
                status: 'active'
            }
        ];

        app.saveToStorage();
    }
}

// Initialize demo data on first load
if (localStorage.getItem('appInitialized') !== 'true') {
    initializeDemoData();
    localStorage.setItem('appInitialized', 'true');
}
