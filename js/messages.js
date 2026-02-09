const messagesAPI = {
    async getConversation(otherUserId) {
        const response = await api.request(`/messages/conversation/${otherUserId}`);
        console.log('Conversation response:', response);
        
        // API возвращает { data: [...] }
        const messages = response?.data || [];
        
        // Добавляем sender_username и receiver_username для совместимости с UI
        // Используем ID, так как username в ответе не приходит
        return messages.map(msg => ({
            ...msg,
            sender_username: msg.sender_id === otherUserId ? 'Собеседник' : 'Вы',
            receiver_username: msg.receiver_id === otherUserId ? 'Собеседник' : 'Вы'
        }));
    },

    async sendMessage(content, receiverId) {
        return await api.request('/messages/', {
            method: 'POST',
            body: { content, receiver_id: receiverId },
        });
    }
};