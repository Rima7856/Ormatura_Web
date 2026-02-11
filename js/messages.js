const messagesAPI = {
    async getConversation(otherUserId) {
        try {
            console.log('Запрашиваю диалог с:', otherUserId);
            const response = await api.request(`/messages/conversation/${otherUserId}`);

            // Проверяем, что пришло с сервера
            const messages = response?.data || [];
            console.log('Получено сообщений:', messages.length);

            return messages.map(msg => {
            // 1. Создаем объект даты. JS понимает, что строка с 'Z' или '+00:00' — это UTC.
            const dateObj = new Date(msg.timestamp);

            return {
                ...msg,
                // 2. Превращаем UTC в Московское время (UTC+3)
                displayTime: dateObj.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Europe/Moscow' // <--- ЭТОТ ПАРАМЕТР ВСЁ РЕШАЕТ
                }),
                fullDate: dateObj.toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Europe/Moscow'
                }),
                sender_username: msg.sender_id === otherUserId ? 'Собеседник' : 'Вы',
                receiver_username: msg.receiver_id === otherUserId ? 'Собеседник' : 'Вы'
            };
        });
        } catch (error) {
            console.error('Ошибка в getConversation:', error);
            return [];
        }
    },

    async sendMessage(content, receiverId) {
        return await api.request('/messages/', {
            method: 'POST',
            body: { content, receiver_id: receiverId },
        });
    }
};