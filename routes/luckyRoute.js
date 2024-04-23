// generateRoutes.js
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const { generateAndBroadcastNumber, sendLuckyMoney ,receiveMoney,getLuckyTransactions, sendWinningColor} = require('../controllers/luckyWheelController');

module.exports = (io) => {
  // Route to trigger number generation and broadcast
  router.get('/currentLucky', (req, res) => {
    generateAndBroadcastNumber(io);
    res.send('Generate Lucky route');
  });
  router.get('/getLuckyTrans',getLuckyTransactions)
  // Route to handle sending money
  const { verifyDeviceId } = require('../middlewares/verifyDeviceId');

  // Apply middleware and set up POST routes
  router.post('/sendLuckyMoney', verifyDeviceId, async (req, res) => {
      const { phone, color, amount, avatar } = req.body;
  
      try {
          const response = await sendLuckyMoney(io, phone, color, amount);
          console.log(response);
          res.status(200).json({ response });
      } catch (error) {
          console.error('Error sending money:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  });
  
  router.post('/receiveMoney', verifyDeviceId, async (req, res) => {
      const { phone, color, amount } = req.body;
  
      try {
          const response = await receiveMoney(io, phone, color, amount);
          res.status(200).json({ response });
      } catch (error) {
          console.error('Error receiving money:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  });
  router.post('/winner', async (req, res) => {
    const { color } = req.body;

    try {
        const response = await sendWinningColor(io, color);
        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
return router;
}  