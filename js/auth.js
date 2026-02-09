const authAPI = {
    async register(username, password, phoneNumber) {
        const data = await api.request('/auth/register', {
            method: 'POST',
            body: { username, password, phone_number: phoneNumber },
        });
        if (data.access_token) {
            api.setToken(data.access_token);
            const user = await settingsAPI.getMe();
            localStorage.setItem('user', JSON.stringify(user));
        }
        return data;
    },

    async login(username, password) {
        const data = await api.request('/auth/login', {
            method: 'POST',
            body: { username, password },
        });
        if (data.access_token) {
            api.setToken(data.access_token);
            const user = await settingsAPI.getMe();
            localStorage.setItem('user', JSON.stringify(user));
        }
        return data;
    },

    logout() {
        api.clearToken();
        window.dispatchEvent(new CustomEvent('auth:logout'));
    },

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch {
            return null;
        }
    },

    isAuthenticated() {
        return api.isAuthenticated;
    }
};