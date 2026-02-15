const chatsAPI = {
    // Получить список чатов
    getChats: async function () {
        const response = await api.request('/chats/');
        return response?.data || [];
    },

    // Получить сообщения конкретного чата
    async getConversation(userId) {
        try {
            const response = await api.request(
                `/messages/conversation/${userId}`
            );

            // backend возвращает { data: [...] }
            return response?.data || [];
        } catch (error) {
            console.error(`Failed to get conversation with ${userId}:`, error);
            return [];
        }
    },

    // Получить чаты с сообщениями
    async getChatsWithDetails(currentUserId) {
        const basicChats = await this.getChats();
        if (!basicChats.length) return [];

        const chatsWithMessages = await Promise.all(
            basicChats.map(async (chat) => {
                const messages = await this.getConversation(chat.id);

                return {
                    user_id: chat.id,
                    username: chat.username,
                    messages,
                    last_message: messages.at(-1) || null,
                    unread_count: 0
                };
            })
        );

        return chatsWithMessages.sort((a, b) =>
            new Date(b.last_message?.timestamp || 0) -
            new Date(a.last_message?.timestamp || 0)
        );
    }

};
