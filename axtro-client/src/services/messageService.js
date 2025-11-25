import axiosClient from '../interceptors/axiosClient.js';

export const messageService = {
  async sendTextMessage(chatId, prompt, assistantSettings, signal) {
    const response = await axiosClient.post(
      '/message/text',
      { chatId, prompt, assistantSettings },
      { signal }
    );
    return response.data;
  },

  async sendImageMessage(chatId, prompt, isPublished, assistantSettings, signal) {
    const response = await axiosClient.post(
      '/message/image',
      { chatId, prompt, isPublished, assistantSettings },
      { signal }
    );
    return response.data;
  },
};

