// Mock Data Management
class DataManager {
    constructor() {
        this.users = [
            {
                id: 1,
                email: 'dev@example.com',
                password: 'password',
                name: 'Ahmet Yılmaz',
                role: 'developer'
            },
            {
                id: 2,
                email: 'manager@example.com',
                password: 'password',
                name: 'Ayşe Kaya',
                role: 'manager'
            },
            {
                id: 3,
                email: 'dev2@example.com',
                password: 'password',
                name: 'Developer',
                role: 'developer'
            }
        ];

        this.entries = [
            {
                id: 1,
                userId: 1,
                userName: 'Ahmet Yılmaz',
                date: '2025-08-10',
                description: 'API endpoint geliştirmesi ve test yazma',
                hours: 8,
                status: 'approved',
                managerNote: 'Güzel çalışma, API dokümantasyonu da eklenmiş.',
                createdAt: '2025-08-10T09:00:00Z',
                updatedAt: '2025-08-10T17:30:00Z'
            },
            {
                id: 2,
                userId: 1,
                userName: 'Ahmet Yılmaz',
                date: '2025-08-11',
                description: 'Frontend bileşen geliştirmesi',
                hours: 7.5,
                status: 'pending',
                managerNote: null,
                createdAt: '2025-08-11T09:00:00Z',
                updatedAt: '2025-08-11T16:30:00Z'
            },
            {
                id: 3,
                userId: 3,
                userName: 'Developer',
                date: '2025-08-09',
                description: 'Veritabanı optimizasyonu',
                hours: 6,
                status: 'rejected',
                managerNote: 'Daha detaylı açıklama gerekli. Hangi tablolar optimize edildi?',
                createdAt: '2025-08-09T09:00:00Z',
                updatedAt: '2025-08-09T15:00:00Z'
            },
            {
                id: 4,
                userId: 1,
                userName: 'Ahmet Yılmaz',
                date: '2025-08-12',
                description: 'Bug düzeltmeleri ve kod refactoring',
                hours: 9,
                status: 'approved',
                managerNote: 'Kod kalitesi artırıldı, test coverage yükseldi.',
                createdAt: '2025-08-12T09:00:00Z',
                updatedAt: '2025-08-12T18:00:00Z'
            },
            {
                id: 5,
                userId: 3,
                userName: 'Developer',
                date: '2025-08-12',
                description: 'Yeni özellik development',
                hours: 8.5,
                status: 'pending',
                managerNote: null,
                createdAt: '2025-08-12T09:00:00Z',
                updatedAt: '2025-08-12T17:30:00Z'
            }
        ];

        this.currentUser = null;
        this.nextId = Math.max(...this.entries.map(e => e.id)) + 1;
        
        // Load data from localStorage if available
        this.loadFromStorage();
    }

    // Authentication methods
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            this.saveToStorage();
            return user;
        }
        return null;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    // Update user profile
    updateUserProfile(profileData) {
        if (!this.currentUser) return null;
        
        // Check if current password is correct
        if (this.currentUser.password !== profileData.currentPassword) {
            return { error: 'Mevcut şifre yanlış!' };
        }
        
        // Check if email is already taken by another user
        const existingUser = this.users.find(u => 
            u.email === profileData.email && u.id !== this.currentUser.id
        );
        if (existingUser) {
            return { error: 'Bu e-posta adresi zaten kullanılıyor!' };
        }
        
        // Update user data
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = {
                ...this.users[userIndex],
                name: profileData.name,
                email: profileData.email,
                password: profileData.newPassword || this.currentUser.password
            };
            
            // Update current user reference
            this.currentUser = this.users[userIndex];
            
            // Update all entries with the new user name
            this.entries.forEach(entry => {
                if (entry.userId === this.currentUser.id) {
                    entry.userName = this.currentUser.name;
                }
            });
            
            this.saveToStorage();
            return { success: true, user: this.currentUser };
        }
        
        return { error: 'Kullanıcı bulunamadı!' };
    }

    getCurrentUser() {
        return this.currentUser;
    }

    // Entry management methods
    getEntries(userId = null, status = null) {
        let filteredEntries = [...this.entries];
        
        if (userId) {
            filteredEntries = filteredEntries.filter(entry => entry.userId === userId);
        }
        
        if (status && status !== 'all') {
            filteredEntries = filteredEntries.filter(entry => entry.status === status);
        }
        
        return filteredEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    addEntry(entryData) {
        const entry = {
            id: this.nextId++,
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            date: entryData.date,
            description: entryData.description,
            hours: parseFloat(entryData.hours),
            status: 'pending',
            managerNote: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.entries.push(entry);
        this.saveToStorage();
        return entry;
    }

    updateEntry(id, entryData) {
        const index = this.entries.findIndex(entry => entry.id === id);
        if (index !== -1) {
            this.entries[index] = {
                ...this.entries[index],
                date: entryData.date,
                description: entryData.description,
                hours: parseFloat(entryData.hours),
                updatedAt: new Date().toISOString()
            };
            this.saveToStorage();
            return this.entries[index];
        }
        return null;
    }

    deleteEntry(id) {
        const index = this.entries.findIndex(entry => entry.id === id);
        if (index !== -1) {
            this.entries.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    approveEntry(id, managerNote = '') {
        const entry = this.entries.find(entry => entry.id === id);
        if (entry) {
            entry.status = 'approved';
            entry.managerNote = managerNote;
            entry.updatedAt = new Date().toISOString();
            this.saveToStorage();
            return entry;
        }
        return null;
    }

    rejectEntry(id, managerNote = '') {
        const entry = this.entries.find(entry => entry.id === id);
        if (entry) {
            entry.status = 'rejected';
            entry.managerNote = managerNote;
            entry.updatedAt = new Date().toISOString();
            this.saveToStorage();
            return entry;
        }
        return null;
    }

    getEntry(id) {
        return this.entries.find(entry => entry.id === id);
    }

    // Statistics methods
    getStats(userId = null, startDate = null, endDate = null) {
        let entries = this.getEntries(userId);
        
        if (startDate && endDate) {
            entries = entries.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
            });
        }
        
        const totalHours = entries.reduce((sum, entry) => {
            return entry.status === 'approved' ? sum + entry.hours : sum;
        }, 0);
        
        const statusCounts = entries.reduce((counts, entry) => {
            counts[entry.status] = (counts[entry.status] || 0) + 1;
            return counts;
        }, {});
        
        return {
            totalHours,
            totalEntries: entries.length,
            statusCounts,
            entries
        };
    }

    getDailyStats(userId = null) {
        const today = new Date().toISOString().split('T')[0];
        return this.getStats(userId, today, today);
    }

    getWeeklyStats(userId = null) {
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        
        return this.getStats(
            userId,
            firstDayOfWeek.toISOString().split('T')[0],
            lastDayOfWeek.toISOString().split('T')[0]
        );
    }

    getMonthlyStats(userId = null) {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        return this.getStats(
            userId,
            firstDayOfMonth.toISOString().split('T')[0],
            lastDayOfMonth.toISOString().split('T')[0]
        );
    }

    // Chart data methods
    getWeeklyChartData(userId = null) {
        const today = new Date();
        const weekData = [];
        const labels = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            labels.push(date.toLocaleDateString('tr-TR', { weekday: 'short' }));
            
            const dayEntries = this.getEntries(userId).filter(entry => 
                entry.date === dateStr && entry.status === 'approved'
            );
            
            const dayHours = dayEntries.reduce((sum, entry) => sum + entry.hours, 0);
            weekData.push(dayHours);
        }
        
        return { labels, data: weekData };
    }

    getStatusChartData(userId = null) {
        const entries = this.getEntries(userId);
        const statusCounts = entries.reduce((counts, entry) => {
            counts[entry.status] = (counts[entry.status] || 0) + 1;
            return counts;
        }, {});
        
        return {
            labels: ['Bekleyen', 'Onaylanan', 'Reddedilen'],
            data: [
                statusCounts.pending || 0,
                statusCounts.approved || 0,
                statusCounts.rejected || 0
            ]
        };
    }

    // Get all developers (for manager view)
    getDevelopers() {
        return this.users.filter(user => user.role === 'developer');
    }

    // Storage methods
    saveToStorage() {
        localStorage.setItem('timeTrackingData', JSON.stringify({
            users: this.users,
            entries: this.entries,
            currentUser: this.currentUser,
            nextId: this.nextId
        }));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('timeTrackingData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.users) this.users = data.users;
                if (data.entries) this.entries = data.entries;
                if (data.currentUser) this.currentUser = data.currentUser;
                if (data.nextId) this.nextId = data.nextId;
            } catch (error) {
                console.error('Error loading data from storage:', error);
            }
        }
    }

    // Reset to default data
    resetData() {
        localStorage.removeItem('timeTrackingData');
        this.currentUser = null;
        this.nextId = 6;
        // Reset to original data
        this.users = [
            {
                id: 1,
                email: 'dev@example.com',
                password: 'password',
                name: 'Ahmet Yılmaz',
                role: 'developer'
            },
            {
                id: 2,
                email: 'manager@example.com',
                password: 'password',
                name: 'Ayşe Kaya',
                role: 'manager'
            },
            {
                id: 3,
                email: 'dev2@example.com',
                password: 'password',
                name: 'Developer',
                role: 'developer'
            }
        ];
        
        this.entries = [
            {
                id: 1,
                userId: 1,
                userName: 'Ahmet Yılmaz',
                date: '2025-08-10',
                description: 'API endpoint geliştirmesi ve test yazma',
                hours: 8,
                status: 'approved',
                managerNote: 'Güzel çalışma, API dokümantasyonu da eklenmiş.',
                createdAt: '2025-08-10T09:00:00Z',
                updatedAt: '2025-08-10T17:30:00Z'
            },
            {
                id: 2,
                userId: 1,
                userName: 'Ahmet Yılmaz',
                date: '2025-08-11',
                description: 'Frontend bileşen geliştirmesi',
                hours: 7.5,
                status: 'pending',
                managerNote: null,
                createdAt: '2025-08-11T09:00:00Z',
                updatedAt: '2025-08-11T16:30:00Z'
            },
            {
                id: 3,
                userId: 3,
                userName: 'Developer',
                date: '2025-08-09',
                description: 'Veritabanı optimizasyonu',
                hours: 6,
                status: 'rejected',
                managerNote: 'Daha detaylı açıklama gerekli. Hangi tablolar optimize edildi?',
                createdAt: '2025-08-09T09:00:00Z',
                updatedAt: '2025-08-09T15:00:00Z'
            },
            {
                id: 4,
                userId: 1,
                userName: 'Ahmet Yılmaz',
                date: '2025-08-12',
                description: 'Bug düzeltmeleri ve kod refactoring',
                hours: 9,
                status: 'approved',
                managerNote: 'Kod kalitesi artırıldı, test coverage yükseldi.',
                createdAt: '2025-08-12T09:00:00Z',
                updatedAt: '2025-08-12T18:00:00Z'
            },
            {
                id: 5,
                userId: 3,
                userName: 'Developer',
                date: '2025-08-12',
                description: 'Yeni özellik development',
                hours: 8.5,
                status: 'pending',
                managerNote: null,
                createdAt: '2025-08-12T09:00:00Z',
                updatedAt: '2025-08-12T17:30:00Z'
            }
        ];
    }
}

// Create global instance
window.dataManager = new DataManager();