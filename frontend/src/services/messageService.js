import api from './api';

export const messageService = {
  async getConversations() {
    const response = await api.get('/conversations');
    return response.data;
  },

  async createConversation(data) {
    const response = await api.post('/conversations', data);
    return response.data;
  },

  async getMessages(conversationId, page = 0, size = 50) {
    const response = await api.get(`/conversations/${conversationId}/messages`, {
      params: { page, size }
    });
    return response.data;
  },

  async sendMessage(conversationId, content) {
    const response = await api.post(`/conversations/${conversationId}/messages`, { content });
    return response.data;
  }
};
