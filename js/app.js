class OrmaturaApp {
    constructor() {
        this.container = document.getElementById('app');
        this.currentUser = null;
        this.chats = [];
        this.activeChat = null;
        this.messages = [];
        this.pollInterval = null;
        
        this.init();
    }

    init() {
        this.currentUser = authAPI.getCurrentUser();
        
        if (authAPI.isAuthenticated() && this.currentUser) {
            this.showMessenger();
        } else {
            this.showAuth();
        }

        window.addEventListener('auth:logout', () => {
            this.stopPolling();
            this.showAuth();
        });
    }

    // ==================== AUTH VIEWS ====================

    showAuth() {
        this.container.innerHTML = `
            <div class="min-h-screen flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                    <div class="bg-primary p-6 text-center">
                        <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i data-lucide="message-circle" class="w-8 h-8 text-white"></i>
                        </div>
                        <h1 class="text-2xl font-bold text-white">Ormatura</h1>
                        <p class="text-white/80 text-sm mt-1">Безопасный мессенджер</p>
                    </div>
                    
                    <div class="p-6">
                        <div class="flex gap-2 mb-6 bg-secondary rounded-lg p-1">
                            <button onclick="app.switchAuthTab('login')" id="tab-login" 
                                class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all bg-white text-primary shadow-sm">
                                Вход
                            </button>
                            <button onclick="app.switchAuthTab('register')" id="tab-register"
                                class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all text-primary/70 hover:text-primary">
                                Регистрация
                            </button>
                        </div>

                        <form id="auth-form" onsubmit="app.handleAuthSubmit(event)">
                            <!-- Login Form -->
                            <div id="login-fields">
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Имя пользователя</label>
                                    <input type="text" name="username" required
                                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="Введите имя пользователя">
                                </div>
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                                    <input type="password" name="password" required
                                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="Введите пароль">
                                </div>
                            </div>

                            <!-- Register Fields (hidden by default) -->
                            <div id="register-fields" class="hidden">
<!--                                <div class="mb-4">-->
<!--                                    <label class="block text-sm font-medium text-gray-700 mb-1">Имя пользователя</label>-->
<!--                                    <input type="text" name="reg_username"-->
<!--                                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"-->
<!--                                        placeholder="Придумайте имя пользователя">-->
<!--                                </div>-->
<!--                                <div class="mb-4">-->
<!--                                    <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>-->
<!--                                    <input type="password" name="reg_password"-->
<!--                                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"-->
<!--                                        placeholder="Придумайте пароль">-->
<!--                                </div>-->
<!--                                <div class="mb-4">-->
<!--                                    <label class="block text-sm font-medium text-gray-700 mb-1">Номер телефона</label>-->
<!--                                    <input type="tel" name="phone_number"-->
<!--                                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"-->
<!--                                        placeholder="+7 (900) 000-00-00">-->
                                 <div class="mb-4">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Через TG-бота https://t.me/OrmaturaBot</label>
                                 </div>
                                    
                                    
                                    
                                    
                            </div>

                            <button type="submit" id="auth-submit-btn"
                                class="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2">
                                <span>Войти</span>
                                <i data-lucide="arrow-right" class="w-4 h-4"></i>
                            </button>
                        </form>

                        <div id="auth-error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm hidden"></div>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons();
    }

    switchAuthTab(tab) {
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');
    const loginFields = document.getElementById('login-fields');
    const registerFields = document.getElementById('register-fields');
    const submitBtn = document.getElementById('auth-submit-btn');
    const form = document.getElementById('auth-form');
    const errorEl = document.getElementById('auth-error');

    if (tab === 'login') {
        loginTab.className =
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all bg-white text-primary shadow-sm';
        registerTab.className =
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all text-primary/70 hover:text-primary';

        loginFields.classList.remove('hidden');
        registerFields.classList.add('hidden');

        submitBtn.type = 'submit';
        submitBtn.onclick = null;
        submitBtn.innerHTML = `
            <span>Войти</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
        `;
    } else {
        registerTab.className =
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all bg-white text-primary shadow-sm';
        loginTab.className =
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all text-primary/70 hover:text-primary';

        registerFields.classList.remove('hidden');
        loginFields.classList.add('hidden');

        submitBtn.type = 'button';
        submitBtn.innerHTML = `
            <span>Перейти в Telegram</span>
            <i data-lucide="send" class="w-4 h-4"></i>
        `;
        submitBtn.onclick = () => {
            window.open('https://t.me/OrmaturaBot', '_blank', 'noopener,noreferrer');
        };
    }

    form.dataset.mode = tab;
    errorEl.classList.add('hidden');
    lucide.createIcons();
    }


    async handleAuthSubmit(e) {
        e.preventDefault();

        const mode = e.target.dataset.mode || 'login';
        if (mode !== 'login') return; // ⛔ защита

        const errorEl = document.getElementById('auth-error');
        const submitBtn = document.getElementById('auth-submit-btn');

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="animate-spin">
                <i data-lucide="loader-2" class="w-5 h-5"></i>
            </span>
        `;
        lucide.createIcons();

        try {
            const username = e.target.username.value;
            const password = e.target.password.value;

            await authAPI.login(username, password);

            this.currentUser = authAPI.getCurrentUser();
            this.showMessenger();
        } catch (error) {
            errorEl.textContent =
                error.data?.detail || error.message || 'Ошибка авторизации';
            errorEl.classList.remove('hidden');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <span>Войти</span>
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
            `;
            lucide.createIcons();
        }
    }


    // ==================== MESSENGER VIEWS ====================

    showMessenger() {
        this.container.innerHTML = `
            <div class="h-screen flex bg-white">
                <!-- Sidebar -->
                <aside class="w-full md:w-80 bg-secondary border-r border-secondary-dark flex flex-col">
                    <!-- User Header -->
                    <div class="p-4 bg-primary text-white">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <i data-lucide="user" class="w-5 h-5"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="font-medium truncate">${this.currentUser?.username || 'Пользователь'}</p>
                                <p class="text-xs text-white/70 flex items-center gap-1">
                                    <span class="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                    онлайн
                                </p>
                            </div>
                            <button onclick="app.showSettings()" class="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <i data-lucide="settings" class="w-5 h-5"></i>
                            </button>
                        </div>
                        <div class="relative">
                            <i data-lucide="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/60"></i>
                            <input type="text" id="search-chats" placeholder="Поиск чатов..."
                                class="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/30 outline-none"
                                oninput="app.filterChats(this.value)">
                        </div>
                    </div>

                    <!-- Chats List -->
                    <div id="chats-list" class="flex-1 overflow-y-auto">
                        <div class="p-8 text-center text-gray-500">
                            <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                            <p class="text-sm">Загрузка чатов...</p>
                        </div>
                    </div>

                    <!-- New Chat Button -->
                    <div class="p-3 border-t border-secondary-dark">
                        <button onclick="app.showNewChatModal()" 
                            class="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                            <i data-lucide="message-square-plus" class="w-4 h-4"></i>
                            <span>Новый чат</span>
                        </button>
                    </div>
                </aside>

                <!-- Main Chat Area -->
                <main id="chat-area" class="hidden md:flex flex-1 flex-col bg-secondary-light">
                    ${this.renderEmptyState()}
                </main>
            </div>
        `;
        lucide.createIcons();
        this.loadChats();
        this.startPolling();
    }

    renderEmptyState() {
        return `
            <div class="flex-1 flex items-center justify-center p-8">
                <div class="text-center">
                    <div class="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                        <i data-lucide="message-circle" class="w-12 h-12 text-primary"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Добро пожаловать!</h2>
                    <p class="text-gray-600 max-w-md mx-auto">Выберите чат слева или начните новый разговор, чтобы начать общение.</p>
                </div>
            </div>
        `;
    }

    renderChatArea() {
        if (!this.activeChat) {
            document.getElementById('chat-area').innerHTML = this.renderEmptyState();
            lucide.createIcons();
            return;
        }

        const chatArea = document.getElementById('chat-area');
        chatArea.innerHTML = `
            <!-- Chat Header -->
            <div class="px-6 py-4 bg-white border-b border-gray-200 flex items-center gap-4">
                <button onclick="app.closeChat()" class="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg">
                    <i data-lucide="arrow-left" class="w-5 h-5"></i>
                </button>
                <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <i data-lucide="user" class="w-5 h-5 text-primary"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 truncate">${this.activeChat.username}</h3>
                    ${this.renderOnlineStatusHtml(this.activeChat.last_seen)}
                </div>
                <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <i data-lucide="more-vertical" class="w-5 h-5 text-gray-600"></i>
                </button>
            </div>

            <!-- Messages -->
            <div id="messages-container" class="flex-1 overflow-y-auto p-4 space-y-3">
                ${this.renderMessages()}
            </div>

            <!-- Input Area -->
            <div class="p-4 bg-white border-t border-gray-200">
                <form onsubmit="app.sendMessage(event)" class="flex gap-3">
                    <button type="button" class="p-3 hover:bg-gray-100 rounded-xl transition-colors text-gray-500">
                        <i data-lucide="paperclip" class="w-5 h-5"></i>
                    </button>
                    <div class="flex-1 relative">
                        <input type="text" id="message-input" placeholder="Введите сообщение..."
                            class="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all"
                            autocomplete="off">
                    </div>
                    <button type="submit" class="p-3 bg-primary hover:bg-primary-dark rounded-xl transition-colors text-white">
                        <i data-lucide="send" class="w-5 h-5"></i>
                    </button>
                </form>
            </div>
        `;
        lucide.createIcons();
        this.scrollToBottom();
        document.getElementById('message-input')?.focus();
    }

    renderMessages() {
        if (this.messages.length === 0) {
            return `
                <div class="h-full flex items-center justify-center">
                    <p class="text-gray-400 text-sm">Нет сообщений. Напишите первое!</p>
                </div>
            `;
        }

        return this.messages.map(msg => {
            const isMe = msg.sender_id === this.currentUser?.id;
            // Определяем имя отправителя
            let senderName = msg.sender_username;
            if (!senderName || senderName === 'Вы') {
                senderName = isMe ? 'Вы' : (this.activeChat?.username || 'Собеседник');
            }
            
            return `
                <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
                    <div class="message-bubble max-w-[70%] ${isMe 
                        ? 'bg-primary text-white rounded-2xl rounded-tr-md' 
                        : 'bg-white text-gray-900 rounded-2xl rounded-tl-md border border-gray-100'} px-4 py-2.5 shadow-sm">
                        ${!isMe ? `<p class="text-xs font-medium text-primary mb-1">${senderName}</p>` : ''}
                        <p class="text-sm leading-relaxed">${this.escapeHtml(msg.content)}</p>
                        <p class="text-xs ${isMe ? 'text-white/70' : 'text-gray-400'} mt-1 text-right">
                            ${this.formatTime(msg.timestamp)}
                        </p>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderChatsList() {
        const container = document.getElementById('chats-list');
        const searchTerm = document.getElementById('search-chats')?.value.toLowerCase() || '';

        const filtered = this.chats.filter(chat => 
            chat.username?.toLowerCase().includes(searchTerm)
        );

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="p-8 text-center">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i data-lucide="search-x" class="w-8 h-8 text-gray-400"></i>
                    </div>
                    <p class="text-gray-500 text-sm">Чаты не найдены</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        container.innerHTML = filtered.map(chat => `
            <div onclick="app.openChat('${chat.user_id}', '${chat.username || 'Пользователь'}')" 
                class="chat-item p-4 flex items-center gap-3 cursor-pointer border-b border-secondary-dark/50 ${this.activeChat?.user_id === chat.user_id ? 'active' : ''}">
                <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <i data-lucide="user" class="w-6 h-6 text-primary"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                        <h4 class="font-medium text-gray-900 truncate">${chat.username || 'Пользователь'}</h4>
                        ${chat.unread_count > 0 ? `
                            <span class="flex-shrink-0 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                                ${chat.unread_count}
                            </span>
                        ` : ''}
                    </div>
                    ${chat.last_message ? `
                        <p class="text-sm text-gray-500 truncate">
                            ${chat.last_message.sender_id === this.currentUser?.id ? 'Вы: ' : ''}
                            ${chat.last_message.content}
                        </p>
                    ` : '<p class="text-sm text-gray-400">Нет сообщений</p>'}
                </div>
                ${chat.last_message ? `
                    <span class="text-xs text-gray-400 flex-shrink-0">
                        ${this.formatTime(chat.last_message.timestamp)}
                    </span>
                ` : ''}
            </div>
        `).join('');
        lucide.createIcons();
    }

    // ==================== ACTIONS ====================

    async loadChats() {
        try {
            console.log('Loading chats...');
            // Сначала пробуем получить чаты через /chats/
            const chatsFromApi = await chatsAPI.getChatsWithDetails();
            console.log('Chats loaded:', chatsFromApi);
            
            // Также получаем сообщения для дополнительной информации
            let messages = [];
            try {
                const allMessages = await chatsAPI.getAllMessages();
                messages = allMessages || [];
                console.log('Messages loaded:', messages.length);
            } catch (msgError) {
                console.log('No messages or error loading messages:', msgError);
            }
            
            // Если есть сообщения, обогащаем чаты ими
            if (messages.length > 0) {
                const messageGroups = chatsAPI.groupMessagesByUser(messages, this.currentUser?.id);
                console.log('Message groups:', messageGroups);
                
                // Объединяем данные из /chats/ с данными из сообщений
                const enrichedChats = chatsFromApi.map(chat => {
                    const msgGroup = messageGroups.find(g => g.user_id === chat.user_id);
                    if (msgGroup) {
                        return {
                            ...chat,
                            last_message: msgGroup.last_message,
                            unread_count: msgGroup.unread_count,
                            messages: msgGroup.messages
                        };
                    }
                    return chat;
                });
                
                // Добавляем чаты, которые есть только в сообщениях
                const apiChatIds = new Set(chatsFromApi.map(c => c.user_id));
                const extraChats = messageGroups.filter(g => !apiChatIds.has(g.user_id));
                
                this.chats = [...enrichedChats, ...extraChats].sort((a, b) => {
                    const timeA = new Date(a.last_message?.timestamp || a.last_seen || 0);
                    const timeB = new Date(b.last_message?.timestamp || b.last_seen || 0);
                    return timeB - timeA;
                });
            } else {
                this.chats = chatsFromApi.sort((a, b) => {
                    const timeA = new Date(a.last_seen || 0);
                    const timeB = new Date(b.last_seen || 0);
                    return timeB - timeA;
                });
            }
            
            console.log('Final chats list:', this.chats);
            this.renderChatsList();
        } catch (error) {
            console.error('Failed to load chats:', error);
            document.getElementById('chats-list').innerHTML = `
                <div class="p-8 text-center text-red-500">
                    <i data-lucide="alert-circle" class="w-8 h-8 mx-auto mb-2"></i>
                    <p class="text-sm">Ошибка загрузки чатов</p>
                    <p class="text-xs text-gray-400 mt-1">${error.message}</p>
                    <button onclick="app.loadChats()" class="mt-3 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark">
                        Повторить
                    </button>
                </div>
            `;
            lucide.createIcons();
        }
    }

    async openChat(userId, username) {
        const chat = this.chats.find(c => c.user_id === userId);

        this.activeChat = {
            user_id: userId,
            username: username,
            last_seen: chat?.last_seen || null
        };

        this.renderChatsList();

        document.getElementById('chat-area').classList.remove('hidden');
        document.getElementById('chat-area').classList.add('flex');

        this.messages = await messagesAPI.getConversation(userId);
        this.renderChatArea();
    }


    closeChat() {
        this.activeChat = null;
        document.getElementById('chat-area').classList.add('hidden');
        document.getElementById('chat-area').classList.remove('flex');
        this.renderChatsList();
    }

    async sendMessage(e) {
        e.preventDefault();
        const input = document.getElementById('message-input');
        const content = input.value.trim();
        
        if (!content || !this.activeChat) return;

        try {
            const message = await messagesAPI.sendMessage(content, this.activeChat.user_id);
            this.messages.push(message);
            this.renderChatArea();
            
            // Update chat list with new message
            this.loadChats();
        } catch (error) {
            this.showToast('Ошибка отправки сообщения', 'error');
        }
    }

    filterChats(query) {
        this.renderChatsList();
    }

    scrollToBottom() {
        const container = document.getElementById('messages-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    // ==================== SETTINGS ====================

    showSettings() {
        const modal = document.createElement('div');
        modal.id = 'settings-modal';
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div class="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 class="text-xl font-bold text-gray-900">Настройки</h2>
                    <button onclick="document.getElementById('settings-modal').remove()" class="p-2 hover:bg-gray-100 rounded-lg">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                
                <div class="overflow-y-auto max-h-[60vh]">
                    <!-- Profile Section -->
                    <div class="p-6 border-b border-gray-100">
                        <div class="flex items-center gap-4 mb-4">
                            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <i data-lucide="user" class="w-8 h-8 text-primary"></i>
                            </div>
                            <div>
                                <h3 class="font-bold text-gray-900">${this.currentUser?.username}</h3>
                                <p class="text-sm text-gray-500">ID: ${this.currentUser?.id}</p>
                            </div>
                        </div>
                        
                        <form onsubmit="app.updateUsername(event)" class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Изменить имя</label>
                                <div class="flex gap-2">
                                    <input type="text" name="new_username" value="${this.currentUser?.username}" required
                                        class="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                                    <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                                        Сохранить
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <!-- Password Section -->
                    <div class="p-6 border-b border-gray-100">
                        <h4 class="font-medium text-gray-900 mb-3">Сменить пароль</h4>
                        <form onsubmit="app.updatePassword(event)" class="space-y-3">
                            <input type="password" name="current_password" required placeholder="Текущий пароль"
                                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                            <input type="password" name="new_password" required placeholder="Новый пароль"
                                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                            <button type="submit" class="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark">
                                Обновить пароль
                            </button>
                        </form>
                    </div>

                    <!-- Other Actions -->
                    <div class="p-6">
                        <button onclick="app.logout()" 
                            class="w-full py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2">
                            <i data-lucide="log-out" class="w-5 h-5"></i>
                            Выйти из аккаунта
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        lucide.createIcons();
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    async updateUsername(e) {
        e.preventDefault();
        try {
            await settingsAPI.updateUsername(e.target.new_username.value);
            this.currentUser = await settingsAPI.getMe();
            localStorage.setItem('user', JSON.stringify(this.currentUser));
            document.getElementById('settings-modal').remove();
            this.showMessenger();
            this.showToast('Имя пользователя обновлено', 'success');
        } catch (error) {
            this.showToast(error.data?.detail || 'Ошибка обновления', 'error');
        }
    }

    async updatePassword(e) {
        e.preventDefault();
        try {
            await settingsAPI.updatePassword(
                e.target.current_password.value,
                e.target.new_password.value
            );
            document.getElementById('settings-modal').remove();
            this.showToast('Пароль обновлён', 'success');
        } catch (error) {
            this.showToast(error.data?.detail || 'Ошибка смены пароля', 'error');
        }
    }

    showNewChatModal() {
        const modal = document.createElement('div');
        modal.id = 'new-chat-modal';
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                <div class="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 class="text-xl font-bold text-gray-900">Новый чат</h2>
                    <button onclick="document.getElementById('new-chat-modal').remove()" class="p-2 hover:bg-gray-100 rounded-lg">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                <div class="p-6">
                    <form onsubmit="app.startNewChat(event)" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Username пользователя</label>
                            <div class="relative">
                                <i data-lucide="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input type="text" name="username" required placeholder="Введите username"
                                    class="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    oninput="app.searchUsers(this.value)">
                            </div>
                            <div id="user-search-results" class="mt-2 space-y-1 max-h-40 overflow-y-auto"></div>
                        </div>
                        <div id="selected-user-info" class="hidden p-3 bg-secondary rounded-lg">
                            <p class="text-xs text-gray-500">Выбранный пользователь:</p>
                            <p class="font-medium text-primary" id="selected-username"></p>
                            <input type="hidden" name="user_id" id="selected-user-id">
                        </div>
                        <button type="submit" id="start-chat-btn" class="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            Начать чат
                        </button>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        lucide.createIcons();
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    async searchUsers(query) {
        if (!query || query.length < 2) {
            document.getElementById('user-search-results').innerHTML = '';
            return;
        }
        
        // Ищем в уже загруженных чатах и добавляем кастомный поиск
        try {
            // Пока используем простой поиск — можно расширить API
            const results = this.chats.filter(c => 
                c.username?.toLowerCase().includes(query.toLowerCase())
            );
            
            const container = document.getElementById('user-search-results');
            
            // Если ничего не найдено locally, показываем возможность начать чат с username напрямую
            if (results.length === 0 && query.length >= 3) {
                container.innerHTML = `
                    <div onclick="app.selectUser('${query}', '${query}')" 
                        class="p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-200">
                        <p class="text-sm font-medium text-primary">Начать чат с "${query}"</p>
                        <p class="text-xs text-gray-500">Username будет использован напрямую</p>
                    </div>
                `;
            } else {
                container.innerHTML = results.map(u => `
                    <div onclick="app.selectUser('${u.user_id}', '${u.username}')" 
                        class="p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-200">
                        <p class="font-medium text-gray-900">${u.username}</p>
                        <p class="text-xs text-gray-500">ID: ${u.user_id.slice(0, 8)}...</p>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    selectUser(userId, username) {
        document.getElementById('selected-user-id').value = userId;
        document.getElementById('selected-username').textContent = username;
        document.getElementById('selected-user-info').classList.remove('hidden');
        document.getElementById('start-chat-btn').disabled = false;
        document.getElementById('user-search-results').innerHTML = '';
        document.querySelector('input[name="username"]').value = username;
    }

    async startNewChat(e) {
        e.preventDefault();
        const userId = document.getElementById('selected-user-id').value;
        const username = document.getElementById('selected-username').textContent;
        
        if (!userId) {
            this.showToast('Выберите пользователя', 'error');
            return;
        }
        
        document.getElementById('new-chat-modal').remove();
        
        try {
            // Пытаемся загрузить сообщения — это проверит существование пользователя
            const messages = await messagesAPI.getConversation(userId);
            this.activeChat = { user_id: userId, username: username };
            this.messages = messages;
            this.renderChatArea();
            this.loadChats(); // refresh sidebar
        } catch (error) {
            // Если пользователь не найден, создаём чат без сообщений
            if (error.status === 404 || error.message.includes('404')) {
                this.activeChat = { user_id: userId, username: username };
                this.messages = [];
                this.renderChatArea();
                this.showToast('Чат создан. Отправьте первое сообщение!', 'success');
            } else {
                this.showToast('Ошибка: ' + (error.message || 'Не удалось создать чат'), 'error');
            }
        }
    }

    // ==================== UTILS ====================

    startPolling() {
        this.pollInterval = setInterval(() => {
            if (this.activeChat) {
                this.refreshMessages();
            }
            this.loadChats();
        }, 5000);
    }

    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }

    async refreshMessages() {
        if (!this.activeChat) return;
        try {
            const newMessages = await messagesAPI.getConversation(this.activeChat.user_id);
            if (newMessages.length !== this.messages.length) {
                this.messages = newMessages;
                this.renderChatArea();
            }
        } catch (error) {
            console.error('Failed to refresh messages:', error);
        }
    }

    formatTime(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
            return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        }

        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return 'Вчера';
        }

        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    }

    // Проверяет, онлайн ли пользователь (был активен в последние 5 минут)
    isOnline(lastSeen, timeoutSeconds = 120) {
        if (!lastSeen) return false;

        const last = Date.parse(lastSeen);
        if (Number.isNaN(last)) return false;

        return (Date.now() - last) < timeoutSeconds * 1000;
    }

    // Рендерит статус для sidebar (текущий пользователь)
    renderOnlineStatus(lastSeen, isDark = false) {
        const online = this.isOnline(lastSeen);
        const textColor = isDark ? 'text-white/70' : 'text-gray-500';
        const dotColor = online ? 'bg-green-400' : 'bg-gray-400';
        const statusText = online ? 'в сети' : 'не в сети';
        
        return `
            <p class="text-xs ${textColor} flex items-center gap-1">
                <span class="w-1.5 h-1.5 ${dotColor} rounded-full"></span>
                ${statusText}
            </p>
        `;
    }

    // Рендерит статус для шапки чата
    renderOnlineStatusHtml(lastSeen) {
        const online = this.isOnline(lastSeen);
        
        if (online) {
            return `<p class="text-xs text-green-600 flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                в сети
            </p>`;
        }
        
        if (lastSeen) {
            return `<p class="text-xs text-gray-500">был(а) ${this.formatTime(lastSeen)}</p>`;
        }
        
        return `<p class="text-xs text-gray-500">не в сети</p>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-in slide-in-from-bottom-2 duration-200 z-50 ${
            type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-primary'
        }`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('animate-out', 'slide-out-to-bottom-2');
            setTimeout(() => toast.remove(), 200);
        }, 3000);
    }

    logout() {
        this.stopPolling();
        authAPI.logout();
    }
}

// Инициализация приложения
const app = new OrmaturaApp();