const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  phone: {
    type: String,
    required:true
  },
  email: {
    type: String,
    required:true
  },
  wallet:{
    type:Number,
    default:0
  },
  avatar:{
    type:Number
  },
  userId:{
    type:String,
    required:true
  },
  // withdrwarl_amount:{
  //   type:Number,
  //   default:0
  // },
  deviceId:{
    type:String,
    required:true
  }

},
{
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
