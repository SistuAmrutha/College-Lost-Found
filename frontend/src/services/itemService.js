import api from './api';

export const itemService = {
  async searchItems(params = {}) {
    const response = await api.get('/items', { params });
    return response.data;
  },

  async getItem(id) {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  async getRelated(id, category) {
    const response = await api.get(`/items/${id}/related`, { params: { category } });
    return response.data;
  },

  async getStatistics() {
    const response = await api.get('/items/statistics');
    return response.data;
  },

  async getMyPosts(page = 0, size = 10) {
    const response = await api.get('/items/my-posts', { params: { page, size } });
    return response.data;
  },

  async createItem(itemData) {
    const response = await api.post('/items', itemData);
    return response.data;
  },

  async updateItem(id, itemData) {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  },

  async deleteItem(id) {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },

  async updateStatus(id, status) {
    const response = await api.patch(`/items/${id}/status`, { status });
    return response.data;
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/items/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.imageUrl;
  }
};
