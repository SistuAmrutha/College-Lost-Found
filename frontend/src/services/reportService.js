import api from './api';

export const reportService = {
  async createReport(reportData) {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  async getReports(status, page = 0, size = 20) {
    const params = { page, size };
    if (status) params.status = status;
    const response = await api.get('/admin/reports', { params });
    return response.data;
  },

  async updateReportStatus(id, status, adminNotes) {
    const response = await api.patch(`/admin/reports/${id}/status`, { status, adminNotes });
    return response.data;
  }
};
