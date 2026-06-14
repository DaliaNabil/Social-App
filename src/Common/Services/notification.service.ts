
import { getMessaging } from 'firebase-admin/messaging';

class NotificationService {
  

  async sendToDevice(token: string, data: { title: string; body: string }) {
    const message = {
      token: token,
      notification: { title: data.title, body: data.body }
    };
    return getMessaging().send(message);
  }

  async sendToMultiDevices(tokens: string[], data: { title: string; body: string }) {
    // send individually if sendAll/sendMulticast is not available
    const messages = tokens.map((token) => ({
      token,
      notification: { title: data.title, body: data.body }
    }));
    return Promise.all(messages.map((message) => getMessaging().send(message)));
  }


  async sendMultiMessages(token: string, dataList: { title: string; body: string }[]) {
    const messages = dataList.map((d) => ({
      token,
      notification: { title: d.title, body: d.body }
    }));
    return Promise.all(messages.map((message) => getMessaging().send(message)));
  }
}

export default new NotificationService();