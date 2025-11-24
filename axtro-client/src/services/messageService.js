import axiosClient from '../interceptors/axiosClient.js';

export const messageService = {
  async sendTextMessage(chatId, prompt, signal) {
    const response = await axiosClient.post('/message/text', { chatId, prompt }, { signal });
    return response.data;
  },

  async sendImageMessage(chatId, prompt, isPublished, signal) {
    const response = await axiosClient.post('/message/image', { chatId, prompt, isPublished }, { signal });
    return response.data;
  },
};

