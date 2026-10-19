import api from './api';

export const adminService = {
  async getDashboard() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  async updateUserStatus(id, status) {
    const response = await api.patch(`/admin/users/${id}/status`, { status });
    return response.data;
  },

  async deleteItem(id) {
    const response = await api.delete(`/admin/items/${id}`);
    return response.data;
  },

  async getAuditLogs(page = 0, size = 30) {
    const response = await api.get('/admin/audit-logs', { params: { page, size } });
    return response.data;
  }
};
