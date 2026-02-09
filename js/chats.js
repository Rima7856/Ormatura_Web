const chatsAPI = {
    // Получить список чатов через /chats/ (возвращает { data: [{id, username}] })
    async getChats() {
        const response = await api.request('/chats/');
        console.log('Raw chats response:', response);
        // API возвращает { data: [...] }
        const chats = response?.data || [];
        return chats;
    },

    // Получить детальную информацию о пользователе по ID
    async getUserInfo(userId) {
        try {
            const response = await api.request(`/users/info/id?user_id=${userId}`);
            return response?.user || null;
        } catch (error) {
            console.error(`Failed to get user info for ${userId}:`, error);
            return null;
        }
    },

    // Получить чаты с полной информацией о пользователях
    async getChatsWithDetails() {
        const basicChats = await this.getChats();
        console.log('Basic chats:', basicChats);
        
        if (!basicChats.length) return [];
        
        // Загружаем детальную информацию о каждом пользователе
        const chatsWithDetails = await Promise.all(
            basicChats.map(async (chat) => {
                const userInfo = await this.getUserInfo(chat.id);
                return {
                    user_id: chat.id,           // UUID строка
                    username: chat.username,     // имя из /chats/
                    ...userInfo,                 // детали из /users/info/id
                    messages: [],
                    last_message: null,
                    unread_count: 0
                };
            })
        );
        
        console.log('Chats with details:', chatsWithDetails);
        return chatsWithDetails;
    },

    async getAllMessages() {
        const response = await api.request('/messages/my');
        return response?.data || response || [];
    },

    groupMessagesByUser(messages, currentUserId) {
        const grouped = new Map();
        
        messages.forEach(msg => {
            const otherUserId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
            
            if (!grouped.has(otherUserId)) {
                grouped.set(otherUserId, {
                    user_id: otherUserId,
                    username: msg.sender_id === currentUserId ? msg.receiver_username : msg.sender_username || 'Пользователь',
                    messages: [],
                    last_message: null,
                    unread_count: 0
                });
            }
            
            const chat = grouped.get(otherUserId);
            chat.messages.push(msg);
            
            if (!chat.last_message || new Date(msg.timestamp) > new Date(chat.last_message.timestamp)) {
                chat.last_message = msg;
            }
        });

        return Array.from(grouped.values()).sort((a, b) => {
            const timeA = new Date(a.last_message?.timestamp || 0);
            const timeB = new Date(b.last_message?.timestamp || 0);
            return timeB - timeA;
        });
    }
};