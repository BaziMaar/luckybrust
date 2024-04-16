const LuckyTransaction = require("../models/LuckyTransictionsModel.js");
const User = require("../models/userModel.js");  // Import the User model

let firstBet = 0;
let secondBet = 0;
let thirdBet = 0;
let winner = null;
let count =0;
let am1=0
let am2=0 
let am3=0
const generateAndBroadcastNumber = (io) => {
  let lastNumbers=[0,0,0,0,0,0,0,0,0,0,0,0]
  let targetNumber = 0;
  let currentNumber = 0;
  let timeRemaining = 15; // Initial countdown time in seconds
  let intervalId = null;
  const generateAndBroadcast = () => {
    targetNumber = 10;
    currentNumber = 0;
    timeRemaining = 15; // Use the generated number for countdown time
    let a=0,b=0,c=0;
    let arr1=[0,0,0],arr2=[0,0,0],arr3=[0,0,0]
    winner = '';
    let spin=false
    const numbers = [50, 100, 200, 500, 1000, 5000];

// Define probabilities for each number
    const probabilities = [0.3, 0.25, 0.25, 0.1, 0.7, 0.3];

    // Function to generate random number with adjusted probabilities
    function generateRandomNumber() {
        let rand = Math.random();
        let cumulativeProbability = 0;

        for (let i = 0; i < numbers.length; i++) {
            cumulativeProbability += probabilities[i];
            if (rand <= cumulativeProbability) {
                return numbers[i];
            }
        }
    }
    
    clearInterval(intervalId);

    intervalId = setInterval(() => {
      

      if (timeRemaining > 0) {
        timeRemaining--;
        let a1=0,a2=0,a3=0
        for(let i=0;i<Math.floor(Math.random())+1;i++){
          let x=generateRandomNumber()
          arr1[i]=x;
          a1+=x
          
        }
        for(let i=0;i<Math.floor(Math.random()*4)+1;i++){
          let x=generateRandomNumber()
          arr2[i]=x
          a2+=x
        }
        for(let i=0;i<Math.floor(Math.random()*4)+1;i++){
          let x=generateRandomNumber()
          arr3[i]=x
          a3+=x
        }
        a+=a1;
        if(am1!=0){
          a+=am1
          am1=0
        }
        if(am2!==0){
          b+=am2
          am2=0
        }
        if(am3!==0){
          c+=am3
          am3=0
        }
        b+=a2;
        c+=a3;
        io.emit('spinPlaced',{red:firstBet,yellow:secondBet,blue:thirdBet})
        io.emit('luckyBet', { number: currentNumber, time: timeRemaining,spin:spin, result: winner,firstBet:a,secondBet:b,thirdBet:c,a:lastNumbers[0],b:lastNumbers[1],c:lastNumbers[2],d:lastNumbers[3],e:lastNumbers[4],f:lastNumbers[5],g:lastNumbers[6],h:lastNumbers[7],i:lastNumbers[8],j:lastNumbers[9],k:lastNumbers[10],l:lastNumbers[11],arr1:arr1,arr2:arr2,arr3:arr3});
        arr1=[0,0,0]
        arr2=[0,0,0]
        arr3=[0,0,0]    
      }else if (currentNumber < targetNumber&&currentNumber!==0) {
        currentNumber += 1;
        io.emit('spinPlaced',{red:firstBet,yellow:secondBet,blue:thirdBet})
        io.emit('luckyBet', { number: currentNumber, time: timeRemaining, spin:spin,result: winner,firstBet:a,secondBet:b,thirdBet:c,a:lastNumbers[0],b:lastNumbers[1],c:lastNumbers[2],d:lastNumbers[3],e:lastNumbers[4],f:lastNumbers[5],f:lastNumbers[5],g:lastNumbers[6],h:lastNumbers[7],i:lastNumbers[8],j:lastNumbers[9],k:lastNumbers[10],l:lastNumbers[11],arr1:arr1,arr2:arr2,arr3:arr3 });
      }
      else if(currentNumber===0&&timeRemaining===0){
        currentNumber++;
        io.emit('spinPlaced',{red:firstBet,yellow:secondBet,blue:thirdBet})
        io.emit('luckyBet', { number: currentNumber, time: timeRemaining,spin:spin, result: winner,firstBet:a,secondBet:b,thirdBet:c,a:lastNumbers[0],b:lastNumbers[1],c:lastNumbers[2],d:lastNumbers[3],e:lastNumbers[4],f:lastNumbers[5],f:lastNumbers[5],g:lastNumbers[6],h:lastNumbers[7],i:lastNumbers[8],j:lastNumbers[9],k:lastNumbers[10],l:lastNumbers[11] ,arr1:arr1,arr2:arr2,arr3:arr3 });

        spin=true
        if((firstBet===0&&secondBet===0&&thirdBet===0)||count===1){
          winner=Math.floor(Math.random() * 2)+1;
          count=0
        }
        else if (secondBet <= firstBet && secondBet <= thirdBet) {
          winner = 1; // First bet is the highest
          count=0
      } else if (thirdBet <= firstBet && thirdBet <= secondBet) {
        winner = 2; // Second bet is the highest
        count=0
      } else {       
          winner = 0; // Third bet is the highest
          count=0
      }
        lastNumbers.push(winner)
        if(lastNumbers.length>12){
          lastNumbers.shift();
        }
      }  
      else {
        a=Math.floor(Math.random() * (191)) + 10;
        b=Math.floor(Math.random() * (191)) + 10;
        c=Math.floor(Math.random() * (191)) + 10;
        firstBet = 0;
        secondBet = 0;
        thirdBet = 0;

        clearInterval(intervalId);
        generateAndBroadcast();
        
       
      }
    }, 1000); // Reduced the interval to 1000ms (1 second)
  };

  // Call generateAndBroadcast to start the initial round
  generateAndBroadcast();
};

const sendLuckyMoney = async (io, phone, color, amount) => {
  try {
    count++;
    let userTransaction = await LuckyTransaction.findOne({ phone });
    const sender = await User.findOne({ phone });
    if (!sender) {
      throw new Error('Sender not found');
    }

    if (!userTransaction) {
      userTransaction = new LuckyTransaction({
        phone,
        transactions: [],
      });
    }

  

    if (color === 0) {
      am1+=amount
      firstBet += 9 * amount; // Adjusted the multiplier
    } else if (color === 1) {
      am2+=amount
      secondBet += 2 * amount; // Adjusted the multiplier
    } else {
      am3+=amount
      thirdBet += 2 * amount; // Adjusted the multiplier
    }

    userTransaction.transactions.push({ color, amount: -amount });
    await userTransaction.save(); // Removed unnecessary array wrapping
    
    if (sender.wallet < amount) {
      io.emit('walletLuckyUpdated', {phone:phone, error: 'Insufficient Funds' });
      return { success: false, message: 'InSufficient FUnds' };
    } else {
      sender.wallet -= amount;
      await sender.save();

      io.emit('walletLuckyUpdated', { phone, newBalance: sender.wallet, color });
    
      return { success: true, message: 'Money sent successfully',newBalance:sender.wallet,color };
    }
  } catch (error) {
    io.emit('walletLuckyUpdated', { error: 'Failed to send money. Please try again.' });
    throw new Error('Failed to send money. Please try again.');
  }
};
  
  const receiveMoney = async (io, phone, color, amount) => {
    let winning=0;
    try {
      const [sender, userTransaction] = await Promise.all([
        User.findOne({ phone }),
        LuckyTransaction.findOne({ phone })
      ]);
      if (!sender) {
        throw new Error('Sender not found');
      }
      // Initialize userTransaction if not found
      let newUserTransaction = userTransaction;
      if (!newUserTransaction) {
        newUserTransaction = new LuckyTransaction({
          phone,
          transactions: []
        });
      }
      if(color===winner){
        if(color===0){
          winning=amount*9;
        }
        else{
          winning=amount*2;
        }

      }
  
      sender.wallet +=winning;
      sender.withdrwarl_amount += winning;
      await sender.save();
      newUserTransaction.transactions.push({color: color, amount:winning});
      await Promise.all([newUserTransaction.save(), sender.save()]);
  
      io.emit('walletLuckyUpdated', { phone, newBalance: sender.wallet });
  
      return { success: true, message: 'Money received successfully',newBalance:sender.wallet };
    } catch (error) {
      throw new Error('Server responded falsely');
    }
  };
  
  const getLuckyTransactions = async (req, res) => {
    const { phone } = req.query;
  
    
    try {
      const userTransactions = await LuckyTransaction.findOne({ phone });
  
      if (!userTransactions) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ transactions: userTransactions.transactions });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = {
    generateAndBroadcastNumber,
    sendLuckyMoney,
    receiveMoney,
    getLuckyTransactions
  };
  