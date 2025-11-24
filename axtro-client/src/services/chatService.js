import axiosClient from '../interceptors/axiosClient.js';

export const chatService = {
  async getChats() {
    const response = await axiosClient.get('/chat/get');
    return response.data;
  },

  async createChat() {
    const response = await axiosClient.post('/chat/create');
    return response.data;
  },

  async deleteChat(chatId) {
    const response = await axiosClient.post('/chat/delete', { chatId });
    return response.data;
  },
};

