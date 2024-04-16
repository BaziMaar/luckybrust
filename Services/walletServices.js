// walletService.js
const User = require('../models/userModel');
const Wallet=require('../models/walletModel');
const addFunds = async (phone, amount) => {
  try {
    let user = await User.findOne({ phone: phone });
    if (!user) {
      throw new Error('User not found');
    }
    user.wallet += amount;
    await user.save();
    let wallet = await Wallet.findOne({ phone: phone });
    if (!wallet) {
      wallet = new Wallet({
        phone,
        walletTrans: []
      });
    }
    wallet.walletTrans.push({ time: new Date(), amount: amount, status: 0 });
    await wallet.save();
    return user.wallet;
  } catch (error) {
    console.error('Error adding funds:', error);
    throw error;
  }
};

  

const deductFunds = async (phone, amount,paymentId,bankId=0,ifscCode=0) => {
  try {
    const user = await User.findOne({ phone: phone });
    let wallet = await Wallet.findOne({ phone: phone });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.wallet <= amount) {
      throw new Error('Insufficient funds');
    }
    user.wallet -= amount;
    await user.save();
    if (!wallet) {
      wallet = new Wallet({
        phone,
        amount: 0,
        walletTrans: [{
          status:0,
        }
        ],
      });
    }
    wallet.walletTrans.push({ time: new Date(), amount: -amount, status: 0,paymentId,bankId,ifscCode });
    await wallet.save();
    return user.wallet;
  } catch (error) {
    console.error('Error deducting funds:', error);
    throw error;
  }
};



module.exports = {
  addFunds,
  deductFunds,
};
