class IrenoAdvisor {
    constructor() {
        this.currentSection = 'dashboard';
        this.chatMessages = [];
        this.settings = {
            theme: 'auto',
            alertNotifications: true,
            systemNotifications: true,
            refreshInterval: 60
        };
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.setupTheme();
        this.initializeChat();
        this.startDataRefresh();
        this.updateMetrics();
        
        // Ensure dashboard is shown initially
        this.showSection('dashboard');
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('ireno-settings');
        if (savedSettings) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            } catch (e) {
                console.warn('Failed to load settings from localStorage');
            }
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('ireno-settings', JSON.stringify(this.settings));
        } catch (e) {
            console.warn('Failed to save settings to localStorage');
        }
    }

    setupEventListeners() {
        // Navigation - use event delegation for better reliability
        document.addEventListener('click', (e) => {
            // Handle navigation links
            if (e.target.matches('.nav-link') || e.target.closest('.nav-link')) {
                e.preventDefault();
                const link = e.target.matches('.nav-link') ? e.target : e.target.closest('.nav-link');
                const section = link.dataset.section;
                if (section) {
                    this.showSection(section);
                }
                return;
            }

            // Handle card action links
            if (e.target.matches('.card-action-link') || e.target.closest('.card-action-link')) {
                e.preventDefault();
                const link = e.target.matches('.card-action-link') ? e.target : e.target.closest('.card-action-link');
                const section = link.dataset.section;
                if (section) {
                    this.showSection(section);
                }
                return;
            }

            // Handle sidebar toggles
            if (e.target.matches('#sidebarToggleDesktop') || e.target.closest('#sidebarToggleDesktop')) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar) {
                    sidebar.classList.toggle('active');
                }
                return;
            }

            if (e.target.matches('#sidebarToggle') || e.target.closest('#sidebarToggle')) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar) {
                    sidebar.classList.remove('active');
                }
                return;
            }

            // Theme toggle in header
            if (e.target.matches('#themeToggle') || e.target.closest('#themeToggle')) {
                this.cycleTheme();
                return;
            }

            // Chat send button
            if (e.target.matches('#sendBtn') || e.target.closest('#sendBtn')) {
                this.sendMessage();
                return;
            }

            // Chat export
            if (e.target.matches('#exportChat') || e.target.closest('#exportChat')) {
                this.exportChat();
                return;
            }

            // Chat clear
            if (e.target.matches('#clearChat') || e.target.closest('#clearChat')) {
                this.clearChat();
                return;
            }

            // Chat settings
            if (e.target.matches('#chatSettings') || e.target.closest('#chatSettings')) {
                this.openSettingsModal();
                return;
            }

            // Quick actions toggle
            if (e.target.matches('#quickActionsToggle') || e.target.closest('#quickActionsToggle')) {
                const quickActions = document.getElementById('quickActions');
                if (quickActions) {
                    quickActions.classList.toggle('active');
                }
                return;
            }

            // Quick action buttons
            if (e.target.matches('.quick-action-btn') || e.target.closest('.quick-action-btn')) {
                const btn = e.target.matches('.quick-action-btn') ? e.target : e.target.closest('.quick-action-btn');
                const action = btn.dataset.action;
                if (action) {
                    this.handleQuickAction(action);
                }
                return;
            }

            // Alert refresh
            if (e.target.matches('#refreshAlerts') || e.target.closest('#refreshAlerts')) {
                this.refreshAlerts();
                return;
            }

            // Report generation
            if ((e.target.matches('.report-card .btn') || e.target.closest('.report-card .btn')) && 
                e.target.textContent.includes('Generate')) {
                const reportCard = e.target.closest('.report-card');
                if (reportCard) {
                    this.generateReport(reportCard);
                }
                return;
            }

            // Modal backdrop
            if (e.target.matches('#modalBackdrop')) {
                this.closeSettingsModal();
                return;
            }

            // Modal close
            if (e.target.matches('#modalClose') || e.target.closest('#modalClose')) {
                this.closeSettingsModal();
                return;
            }

            // Save settings
            if (e.target.matches('#saveSettings') || e.target.closest('#saveSettings')) {
                this.saveSettingsFromModal();
                return;
            }

            // Reset settings
            if (e.target.matches('#resetSettings') || e.target.closest('#resetSettings')) {
                this.resetSettings();
                return;
            }

            // Close sidebar when clicking outside on mobile
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                const sidebarToggle = document.getElementById('sidebarToggleDesktop');
                
                if (sidebar && !sidebar.contains(e.target) && 
                    sidebarToggle && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });

        // Chat input enter key
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Alert filter
        const alertFilter = document.getElementById('alertFilter');
        if (alertFilter) {
            alertFilter.addEventListener('change', (e) => {
                this.filterAlerts(e.target.value);
            });
        }

        // Theme radio buttons
        document.addEventListener('change', (e) => {
            if (e.target.matches('input[name="theme"]')) {
                if (e.target.checked) {
                    this.settings.theme = e.target.value;
                    this.applyTheme(e.target.value);
                }
                return;
            }

            // Settings checkboxes
            if (e.target.matches('#alertNotifications')) {
                this.settings.alertNotifications = e.target.checked;
                return;
            }

            if (e.target.matches('#systemNotifications')) {
                this.settings.systemNotifications = e.target.checked;
                return;
            }

            if (e.target.matches('#refreshInterval')) {
                this.settings.refreshInterval = parseInt(e.target.value);
                return;
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const settingsModal = document.getElementById('settingsModal');
                if (settingsModal && !settingsModal.classList.contains('hidden')) {
                    this.closeSettingsModal();
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupTheme() {
        this.applyTheme(this.settings.theme);
        this.updateSettingsModal();
    }

    applyTheme(theme) {
        const html = document.documentElement;
        
        if (theme === 'dark') {
            html.setAttribute('data-color-scheme', 'dark');
        } else if (theme === 'light') {
            html.setAttribute('data-color-scheme', 'light');
        } else {
            html.removeAttribute('data-color-scheme');
        }

        this.updateThemeIcon(theme);
    }

    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const icon = themeToggle.querySelector('.theme-icon');
        if (!icon) return;

        let iconPath = '';
        
        if (theme === 'dark') {
            iconPath = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
        } else if (theme === 'light') {
            iconPath = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
        } else {
            iconPath = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
        }
        
        icon.innerHTML = iconPath;
    }

    cycleTheme() {
        const themes = ['auto', 'light', 'dark'];
        const currentIndex = themes.indexOf(this.settings.theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        
        this.settings.theme = themes[nextIndex];
        this.applyTheme(this.settings.theme);
        this.updateSettingsModal();
        this.saveSettings();
        
        this.showNotification(`Theme switched to ${this.settings.theme}`, 'info');
    }

    updateSettingsModal() {
        // Update theme radio buttons
        const themeRadio = document.querySelector(`input[name="theme"][value="${this.settings.theme}"]`);
        if (themeRadio) {
            themeRadio.checked = true;
        }

        // Update checkboxes
        const alertNotifications = document.getElementById('alertNotifications');
        const systemNotifications = document.getElementById('systemNotifications');
        const refreshInterval = document.getElementById('refreshInterval');

        if (alertNotifications) {
            alertNotifications.checked = this.settings.alertNotifications;
        }

        if (systemNotifications) {
            systemNotifications.checked = this.settings.systemNotifications;
        }

        if (refreshInterval) {
            refreshInterval.value = this.settings.refreshInterval;
        }
    }

    openSettingsModal() {
        const settingsModal = document.getElementById('settingsModal');
        if (settingsModal) {
            settingsModal.classList.remove('hidden');
            this.updateSettingsModal();
            
            // Focus management
            const firstFocusable = settingsModal.querySelector('input, button, select');
            if (firstFocusable) {
                setTimeout(() => firstFocusable.focus(), 100);
            }
        }
    }

    closeSettingsModal() {
        const settingsModal = document.getElementById('settingsModal');
        if (settingsModal) {
            settingsModal.classList.add('hidden');
        }
    }

    saveSettingsFromModal() {
        this.saveSettings();
        this.closeSettingsModal();
        this.showNotification('Settings saved successfully', 'success');
    }

    resetSettings() {
        this.settings = {
            theme: 'auto',
            alertNotifications: true,
            systemNotifications: true,
            refreshInterval: 60
        };
        
        this.applyTheme(this.settings.theme);
        this.updateSettingsModal();
        this.saveSettings();
        this.showNotification('Settings reset to default', 'info');
    }

    showSection(sectionId) {
        console.log(`Switching to section: ${sectionId}`);
        
        // Validate section exists
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) {
            console.error(`Section ${sectionId} not found`);
            return;
        }

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Update breadcrumb
        const breadcrumbText = document.getElementById('breadcrumbText');
        if (breadcrumbText) {
            const sectionNames = {
                dashboard: 'Dashboard',
                chat: 'AI Assistant',
                alerts: 'Alerts',
                reports: 'Reports'
            };
            breadcrumbText.textContent = sectionNames[sectionId] || sectionId;
        }

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        targetSection.classList.add('active');
        this.currentSection = sectionId;

        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('active');
            }
        }

        // Section-specific initialization
        if (sectionId === 'chat') {
            this.initializeChatSection();
        }

        console.log(`Successfully switched to section: ${sectionId}`);
    }

    initializeChatSection() {
        console.log('Initializing chat section...');
        // Ensure chat messages are displayed
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) {
            console.error('Chat messages container not found');
            return;
        }
        
        // Check if we need to sync the DOM with our message array
        const currentDOMMessages = chatMessages.children.length;
        const arrayMessages = this.chatMessages.length;
        
        console.log(`DOM messages: ${currentDOMMessages}, Array messages: ${arrayMessages}`);
        
        // If DOM has static content but our array is empty, clear DOM and initialize properly
        if (currentDOMMessages > 0 && arrayMessages === 0) {
            console.log('Clearing static content and initializing...');
            chatMessages.innerHTML = '';
            this.initializeChat();
            const welcomeMessage = this.chatMessages[0];
            this.renderMessage(welcomeMessage.type, welcomeMessage.text, welcomeMessage.timestamp);
        }
        // If we have messages in memory but the DOM is empty, re-render them
        else if (arrayMessages > 0 && currentDOMMessages === 0) {
            console.log('Re-rendering messages from memory...');
            this.chatMessages.forEach(message => {
                this.renderMessage(message.type, message.text, message.timestamp);
            });
        }
        // If both are empty, initialize with welcome message
        else if (arrayMessages === 0 && currentDOMMessages === 0) {
            console.log('Initializing with welcome message...');
            this.initializeChat();
            const welcomeMessage = this.chatMessages[0];
            this.renderMessage(welcomeMessage.type, welcomeMessage.text, welcomeMessage.timestamp);
        }
        
        // Ensure the chat messages container is visible and scrolled to bottom
        this.scrollChatToBottom(chatMessages);
        console.log('Chat section initialized successfully');
    }

    renderMessage(type, text, timestamp = null) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageTime = timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        
        const avatarClass = type === 'bot' ? 'avatar-bot' : 'avatar-user';
        const avatarIcon = type === 'bot' ? '🤖' : '👤';
        
        messageElement.innerHTML = `
            <div class="message-avatar">
                <div class="${avatarClass}">${avatarIcon}</div>
            </div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${messageTime}</div>
            </div>
        `;

        chatMessages.appendChild(messageElement);
        
        // Ensure proper scrolling to bottom
        this.scrollChatToBottom(chatMessages);
        
        console.log(`Message rendered (${type}):`, text.substring(0, 50) + '...');
        
        // Check if chat input is still accessible after rendering
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            console.log('Chat input status after rendering:', {
                exists: true,
                disabled: chatInput.disabled,
                display: window.getComputedStyle(chatInput).display,
                visibility: window.getComputedStyle(chatInput).visibility
            });
        } else {
            console.error('Chat input not found after rendering message!');
        }
    }

    scrollChatToBottom(chatMessagesElement = null) {
        const chatMessages = chatMessagesElement || document.getElementById('chatMessages');
        if (chatMessages) {
            // Use both scrollTop and scrollIntoView for better compatibility
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Also scroll the last message into view
            const lastMessage = chatMessages.lastElementChild;
            if (lastMessage) {
                lastMessage.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'end' 
                });
            }
            
            console.log('Scrolled chat to bottom');
        }
    }

    addMessage(type, text, timestamp = null) {
        // Render the message in the DOM
        this.renderMessage(type, text, timestamp);

        // Store message in array
        const messageTime = timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.chatMessages.push({
            type,
            text,
            timestamp: messageTime
        });
    }

    initializeChat() {
        if (this.chatMessages.length === 0) {
            const welcomeMessage = {
                type: 'bot',
                text: "Hello! I'm IRENO AI Assistant. I can help you with grid operations, meter readings, alerts, and system monitoring. How can I assist you today?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            this.chatMessages.push(welcomeMessage);
        }
    }

    sendMessage() {
        console.log('Send message called');
        const chatInput = document.getElementById('chatInput');
        if (!chatInput || !chatInput.value.trim()) {
            console.log('No input or empty message');
            return;
        }

        const message = chatInput.value.trim();
        console.log('Sending message:', message);
        chatInput.value = '';

        // Add user message
        this.addMessage('user', message);
        console.log('User message added');

        // Show typing indicator
        this.showTypingIndicator();
        console.log('Typing indicator shown');

        // Simulate AI response
        setTimeout(() => {
            this.hideTypingIndicator();
            this.handleAIResponse(message);
            console.log('AI response completed');
        }, 1500 + Math.random() * 1000);
    }

    showTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.classList.remove('hidden');
            
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
    }

    hideTypingIndicator() {
        console.log('Hiding typing indicator');
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.classList.add('hidden');
        }
        
        // Ensure chat input remains functional after hiding typing
        this.ensureChatInputFunctional();
    }

    handleAIResponse(userMessage) {
        console.log('Handling AI response for:', userMessage);
        let response = '';
        
        const message = userMessage.toLowerCase();
        
        if (message.includes('critical') || message.includes('alert')) {
            response = "I found 3 critical alerts currently active:\n\n• Transformer T-4 Overload at Brooklyn Substation (08:45 AM)\n• High voltage detected at Zone 12 Manhattan (08:32 AM)\n• Communication failure with Queens Distribution Center (08:28 AM)\n\nWould you like me to provide more details on any specific alert?";
        } else if (message.includes('brooklyn')) {
            response = "Brooklyn grid status:\n\n✅ Overall Status: Operational with warnings\n⚡ Current Load: 892 MW / 1,200 MW capacity\n📊 Efficiency: 87%\n⚠️ Active Issues: 1 critical (Transformer T-4 overload)\n🔧 Maintenance: 2 scheduled for next week\n\nThe transformer overload requires immediate attention. Should I escalate this to the maintenance team?";
        } else if (message.includes('report') || message.includes('ami')) {
            response = "AMI System Report generated:\n\n📈 Meter Performance:\n• Total meters: 125,430\n• Online: 123,891 (98.8%)\n• Offline: 1,539 (1.2%)\n• Read success rate: 98.8%\n\n📊 Data Quality:\n• Valid readings: 99.2%\n• Communication health: 97.8%\n• Peak performance time: 02:00-06:00 AM\n\nWould you like me to export this report or drill down into specific zones?";
        } else if (message.includes('meter') || message.includes('success')) {
            response = "Current meter read success rate: 98.8%\n\n🎯 Performance by zone:\n• Manhattan: 99.1% (excellent)\n• Brooklyn: 98.5% (good)\n• Queens: 98.7% (good)\n• Bronx: 97.9% (needs attention)\n\nThe Bronx zone is slightly below target. Common causes include communication interference and scheduled maintenance. Should I schedule a diagnostic check?";
        } else if (message.includes('outage') || message.includes('manhattan')) {
            response = "Manhattan outage status:\n\n✅ No major outages currently reported\n🔄 Planned maintenance: 3 locations tonight (11 PM - 5 AM)\n⚠️ Minor issues: 2 isolated incidents affecting <50 customers each\n\n📍 Affected areas:\n• East Village: 23 customers (restored ETA: 30 minutes)\n• Upper West Side: 41 customers (crew dispatched)\n\nAll critical infrastructure remains fully operational.";
        } else if (message.includes('energy') || message.includes('trend') || message.includes('consumption')) {
            response = "Energy consumption trends for today:\n\n📊 Current consumption: 67,234 MWh\n📈 Peak demand: 2,847 MW (achieved at 2 PM)\n🌱 Renewable contribution: 34% (24,340 MWh)\n\n📉 Trends vs. yesterday:\n• Total consumption: +2.3%\n• Peak demand: +1.8%\n• Renewable share: +5.2%\n\n🎯 Forecast for evening peak (6 PM): 2,920 MW\nSystem capacity is adequate. No load shedding expected.";
        } else if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
            response = "Hello! I can help you with:\n\n🔍 System monitoring and alerts\n📊 Grid performance metrics\n⚡ Outage information and status\n📈 AMI system reports\n🌍 Energy consumption analysis\n🔧 Maintenance scheduling\n\nJust ask me about any grid operations topic, or use the quick actions on the right for common requests. What would you like to know?";
        } else {
            response = "I understand you're asking about grid operations. Let me search our systems for relevant information...\n\n🔍 Based on current data:\n• Grid status: Operational\n• Active alerts: 43 total (3 critical)\n• System performance: 89% efficiency\n• All major components: Online\n\nCould you be more specific about what you'd like to know? I can help with alerts, outages, meter readings, energy consumption, or system reports.";
        }
        
        this.addMessage('bot', response);
        console.log('Bot response added');
        
        // Ensure chat input is still functional
        this.ensureChatInputFunctional();
    }

    ensureChatInputFunctional() {
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        const chatInputContainer = document.querySelector('.chat-input-container');
        
        console.log('Checking chat input functionality...');
        
        if (!chatInput) {
            console.error('Chat input not found!');
            return;
        }
        
        if (!sendBtn) {
            console.error('Send button not found!');
            return;
        }
        
        if (!chatInputContainer) {
            console.error('Chat input container not found!');
            return;
        }
        
        // Ensure elements are visible and functional
        chatInput.disabled = false;
        sendBtn.disabled = false;
        chatInputContainer.style.display = '';
        
        // Make sure the input is visible and can receive focus
        if (chatInput.style.display === 'none' || chatInput.style.visibility === 'hidden') {
            chatInput.style.display = '';
            chatInput.style.visibility = 'visible';
        }
        
        console.log('Chat input should be functional now');
        
        // Optional: Focus the input for better UX
        setTimeout(() => {
            chatInput.focus();
        }, 100);
    }

    handleQuickAction(action) {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.value = action;
            this.sendMessage();
        }

        // Close quick actions on mobile
        if (window.innerWidth <= 1024) {
            const quickActions = document.getElementById('quickActions');
            if (quickActions) {
                quickActions.classList.remove('active');
            }
        }
    }

    exportChat() {
        if (this.chatMessages.length === 0) {
            this.showNotification('No chat messages to export', 'warning');
            return;
        }

        const chatData = {
            exportDate: new Date().toISOString(),
            messages: this.chatMessages
        };

        const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `ireno-chat-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Chat exported successfully', 'success');
    }

    clearChat() {
        if (confirm('Are you sure you want to clear all chat messages?')) {
            this.chatMessages = [];
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.innerHTML = '';
            }
            
            // Re-add welcome message
            this.initializeChat();
            const welcomeMessage = this.chatMessages[0];
            this.renderMessage(welcomeMessage.type, welcomeMessage.text, welcomeMessage.timestamp);
            
            this.showNotification('Chat cleared', 'info');
        }
    }

    filterAlerts(filter) {
        const alertCards = document.querySelectorAll('.alert-card');
        
        alertCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = '';
            } else {
                const isMatch = card.classList.contains(filter);
                card.style.display = isMatch ? '' : 'none';
            }
        });

        this.showNotification(`Showing ${filter === 'all' ? 'all' : filter} alerts`, 'info');
    }

    refreshAlerts() {
        const refreshBtn = document.getElementById('refreshAlerts');
        if (refreshBtn) {
            const originalText = refreshBtn.innerHTML;
            refreshBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg> Refreshing...';
            refreshBtn.disabled = true;
            
            setTimeout(() => {
                refreshBtn.innerHTML = originalText;
                refreshBtn.disabled = false;
                this.showNotification('Alerts refreshed', 'success');
                this.updateMetrics();
            }, 1000);
        }
    }

    generateReport(reportCard) {
        const reportTitle = reportCard.querySelector('h3').textContent;
        const btn = reportCard.querySelector('.btn');
        
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'Generating...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                this.showNotification(`${reportTitle} generated successfully`, 'success');
            }, 2000);
        }
    }

    updateMetrics() {
        // Simulate real-time data updates
        const metrics = {
            loadMW: Math.floor(2800 + Math.random() * 100),
            efficiency: Math.floor(85 + Math.random() * 10),
            onlineMeters: Math.floor(123800 + Math.random() * 200),
            offlineMeters: Math.floor(1500 + Math.random() * 100)
        };

        // Update load display
        const loadElements = document.querySelectorAll('.metric-value');
        loadElements.forEach(element => {
            if (element.textContent.includes('2,847')) {
                element.textContent = metrics.loadMW.toLocaleString();
            }
        });

        // Update progress bars
        const progressFills = document.querySelectorAll('.progress-fill');
        progressFills.forEach(fill => {
            const width = fill.style.width;
            if (width === '89%') {
                fill.style.width = `${metrics.efficiency}%`;
                const progressText = fill.parentNode.nextElementSibling;
                if (progressText) {
                    progressText.textContent = `${metrics.efficiency}% Efficiency`;
                }
            }
        });
    }

    startDataRefresh() {
        setInterval(() => {
            if (this.settings.refreshInterval > 0) {
                this.updateMetrics();
            }
        }, this.settings.refreshInterval * 1000);
    }

    handleResize() {
        const sidebar = document.getElementById('sidebar');
        const quickActions = document.getElementById('quickActions');
        
        if (window.innerWidth > 768) {
            if (sidebar) sidebar.classList.remove('active');
        }
        
        if (window.innerWidth > 1024) {
            if (quickActions) quickActions.classList.remove('active');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentNode.parentNode.remove()">×</button>
            </div>
        `;

        // Add notification styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--color-surface);
                    border: 1px solid var(--color-card-border);
                    border-radius: var(--radius-base);
                    padding: var(--space-12) var(--space-16);
                    box-shadow: var(--shadow-lg);
                    z-index: 1100;
                    max-width: 300px;
                    animation: slideIn 0.3s ease-out;
                }
                
                .notification--success {
                    border-left: 4px solid var(--color-success);
                }
                
                .notification--error {
                    border-left: 4px solid var(--color-error);
                }
                
                .notification--warning {
                    border-left: 4px solid var(--color-warning);
                }
                
                .notification--info {
                    border-left: 4px solid var(--color-info);
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--space-12);
                }
                
                .notification-message {
                    color: var(--color-text);
                    font-size: var(--font-size-sm);
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--color-text-secondary);
                    cursor: pointer;
                    font-size: 18px;
                    line-height: 1;
                    padding: 0;
                }
                
                .notification-close:hover {
                    color: var(--color-text);
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Debug method to test chat functionality
    debugChatStatus() {
        console.log('=== CHAT DEBUG STATUS ===');
        
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        const chatMessages = document.getElementById('chatMessages');
        const chatInputContainer = document.querySelector('.chat-input-container');
        const chatSection = document.getElementById('chat');
        
        console.log('Chat Input:', chatInput ? 'Found' : 'NOT FOUND');
        console.log('Send Button:', sendBtn ? 'Found' : 'NOT FOUND');
        console.log('Chat Messages:', chatMessages ? 'Found' : 'NOT FOUND');
        console.log('Input Container:', chatInputContainer ? 'Found' : 'NOT FOUND');
        console.log('Chat Section:', chatSection ? 'Found' : 'NOT FOUND');
        
        if (chatInput) {
            const computedStyle = window.getComputedStyle(chatInput);
            console.log('Chat Input Details:', {
                disabled: chatInput.disabled,
                display: computedStyle.display,
                visibility: computedStyle.visibility,
                opacity: computedStyle.opacity,
                pointerEvents: computedStyle.pointerEvents,
                zIndex: computedStyle.zIndex
            });
        }
        
        if (chatInputContainer) {
            const computedStyle = window.getComputedStyle(chatInputContainer);
            console.log('Input Container Details:', {
                display: computedStyle.display,
                visibility: computedStyle.visibility,
                opacity: computedStyle.opacity,
                height: computedStyle.height
            });
        }
        
        if (chatMessages) {
            const computedStyle = window.getComputedStyle(chatMessages);
            console.log('Chat Messages Container:', {
                height: computedStyle.height,
                maxHeight: computedStyle.maxHeight,
                overflowY: computedStyle.overflowY,
                scrollHeight: chatMessages.scrollHeight,
                clientHeight: chatMessages.clientHeight,
                scrollTop: chatMessages.scrollTop,
                isScrollable: chatMessages.scrollHeight > chatMessages.clientHeight
            });
        }
        
        if (chatSection) {
            console.log('Chat Section Active:', chatSection.classList.contains('active'));
        }
        
        console.log('Current Section:', this.currentSection);
        console.log('Messages Count:', this.chatMessages.length);
        console.log('=========================');
        
        // Try to force fix any issues
        if (chatInput && chatInputContainer) {
            chatInput.disabled = false;
            chatInput.style.display = '';
            chatInput.style.visibility = 'visible';
            chatInput.style.opacity = '1';
            chatInputContainer.style.display = '';
            chatInputContainer.style.visibility = 'visible';
            console.log('Applied fixes to chat input');
        }
        
        // Test scrolling
        if (chatMessages) {
            console.log('Testing scroll to bottom...');
            this.scrollChatToBottom(chatMessages);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.irenoAdvisor = new IrenoAdvisor();
    
    // Expose debug function globally for testing
    window.debugChat = () => {
        if (window.irenoAdvisor) {
            window.irenoAdvisor.debugChatStatus();
        } else {
            console.error('IRENO Advisor not initialized');
        }
    };
    
    // Expose fix function globally
    window.fixChat = () => {
        if (window.irenoAdvisor) {
            window.irenoAdvisor.ensureChatInputFunctional();
        } else {
            console.error('IRENO Advisor not initialized');
        }
    };
    
    // Expose scroll function globally
    window.scrollChat = () => {
        if (window.irenoAdvisor) {
            window.irenoAdvisor.scrollChatToBottom();
            console.log('Manual scroll to bottom executed');
        } else {
            console.error('IRENO Advisor not initialized');
        }
    };
    
    console.log('IRENO Advisor initialized. Available functions:');
    console.log('- debugChat() - Debug chat status');
    console.log('- fixChat() - Fix chat input issues');
    console.log('- scrollChat() - Scroll chat to bottom');
});

// Handle page visibility changes for data refresh
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.irenoAdvisor) {
        window.irenoAdvisor.updateMetrics();
    }
});
