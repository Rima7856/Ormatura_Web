const API_BASE_URL = 'http://ormatura_server:8000';

class ApiClient {
    constructor() {
        this.token = localStorage.getItem('access_token') || null;
        console.log('API Client initialized, token exists:', !!this.token);
    }

    getAuthHeaders() {
        const headers = this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
        console.log('Auth headers:', headers);
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log(`API Request: ${options.method || 'GET'} ${url}`);
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders(),
                ...options.headers,
            },
            ...options,
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            console.log(`API Response: ${response.status}`);
            
            if (response.status === 401) {
                console.error('Unauthorized - clearing token');
                this.handleUnauthorized();
                throw new Error('UNAUTHORIZED');
            }

            const data = await response.json().catch(() => null);
            console.log('Response data:', data);

            if (!response.ok) {
                const error = new Error(data?.detail || data?.message || `HTTP ${response.status}`);
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data;
        } catch (error) {
            console.error(`API Error: ${error.message}`, error);
            throw error;
        }
    }

    handleUnauthorized() {
        this.token = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.dispatchEvent(new CustomEvent('auth:logout'));
    }

    setToken(token) {
        console.log('Setting new token');
        this.token = token;
        localStorage.setItem('access_token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    }

    get isAuthenticated() {
        return !!this.token;
    }
}

const api = new ApiClient();