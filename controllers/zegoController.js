
const ZegoExpressEngine = require('zego-express-engine-webrtc'); // Import the Zego SDK


const appID = 283378710; 
const serverSecret = '401adb641511e816f9a02768022d321135d6c9b1659b403703a16881dffdc8ba'; 

const zego = new ZegoExpressEngine(appID, serverSecret);

class ZegoController {


  async startCalll(userID, channelID) {
    try {
      

      const token = "zego.getToken(userID, channelID);"

      // Configure user settings
      const user = {
        userID,
        userName: userID, 
      };

   
      await zego.loginRoom(channelID, user, token);

   

      return { message: 'Call started successfully', token }; 
    } catch (error) {
      throw new Error(`Failed to start call: ${error.message}`);
    }
  }
  async endcall(token) {
    try {
      

      await zego.logoutRoom(token);

      

      return { message: 'Call ended successfully'}; 
    } catch (error) {
      throw new Error(`Failed to end call: ${error.message}`);
    }
  }


}

module.exports = new ZegoController();
