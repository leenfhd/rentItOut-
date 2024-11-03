// controllers/zegoController.js
const ZegoExpressEngine = require('zego-express-engine-webrtc'); // Import the Zego SDK

 //Initialize Zego SDK
const appID = 283378710; // Replace with your Zego app ID
const serverSecret = '401adb641511e816f9a02768022d321135d6c9b1659b403703a16881dffdc8ba'; // Replace with your Zego server secret

const zego = new ZegoExpressEngine(appID, serverSecret);

class ZegoController {
  // Method to start a call

  async startCalll(userID, channelID) {
    try {
      // Generate a token for the user

      const token = "zego.getToken(userID, channelID);"

      // Configure user settings
      const user = {
        userID,
        userName: userID, // You can customize this
      };

      // Connect the user to the Zego room
      await zego.loginRoom(channelID, user, token);

      // You can add more logic here, such as starting media streaming

      return { message: 'Call started successfully', token }; // Return success message and token
    } catch (error) {
      throw new Error(`Failed to start call: ${error.message}`);
    }
  }
  async endcall(token) {
    try {
      

      await zego.logoutRoom(token);

      

      return { message: 'Call ended successfully'}; // Return success message and token
    } catch (error) {
      throw new Error(`Failed to end call: ${error.message}`);
    }
  }

  // Additional methods for managing calls can be added here
}

module.exports = new ZegoController();
