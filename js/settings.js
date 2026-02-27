const settingsAPI = {
    async getMe() {
        const response = await api.request('/settings/me/');
        // Сохраняем ответ для отладки
        console.log('getMe response:', response);
        return response?.user || response;
    },

    async updateUsername(newUsername) {
        return await api.request('/settings/me/username', {
            method: 'PATCH',
            body: { username: newUsername },
        });
    },

    async updatePassword(currentPassword, newPassword) {
        return await api.request('/settings/me/password', {
            method: 'PATCH',
            body: { 
                old_password: currentPassword,
                new_password: newPassword 
            },
        });
    }
};