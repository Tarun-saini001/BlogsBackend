// const admin = require('../../../config/firebase.');
const admin =  require("@app/cofig/firebase.")
console.log('admin: ', admin);
class PushService {

  static async sendPush(fcmToken, title, body) {
    if (!fcmToken) return;

    const message = {
      token: fcmToken,
      notification: {
        title,
        body,
      },
    };

    await admin.messaging().send(message);
  }
}

module.exports = PushService;
