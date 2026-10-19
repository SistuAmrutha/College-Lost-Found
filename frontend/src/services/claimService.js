import api from './api';

export const claimService = {
  async createClaim(claimData) {
    const response = await api.post('/claims', claimData);
    return response.data;
  },

  async getMyClaims(page = 0, size = 10) {
    const response = await api.get('/claims/my-claims', { params: { page, size } });
    return response.data;
  },

  async getItemClaims(itemId) {
    const response = await api.get(`/items/${itemId}/claims`);
    return response.data;
  },

  async updateClaimStatus(id, status) {
    const response = await api.patch(`/claims/${id}/status`, { status });
    return response.data;
  }
};
