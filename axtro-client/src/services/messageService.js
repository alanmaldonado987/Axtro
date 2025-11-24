import axiosClient from '../interceptors/axiosClient.js';

export const messageService = {
  async sendTextMessage(chatId, prompt) {
    const response = await axiosClient.post('/message/text', { chatId, prompt });
    return response.data;
  },

  async sendImageMessage(chatId, prompt, isPublished) {
    const response = await axiosClient.post('/message/image', { chatId, prompt, isPublished });
    return response.data;
  },
};

