// routes/zegoRouter.js
const express = require('express');
const router = express.Router();
const zegoController = require('../controllers/zegoController');


router.post('/start-call', async (req, res) => {
  const { userID, channelID } = req.body;

  try {
    const callDetails = await zegoController.startCalll(userID, channelID);
    res.json(callDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/end-call', async (req, res) => {
  const { token } = req.body;
  try {
    const callDetails = await zegoController.endCall(token);
    res.json(callDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
