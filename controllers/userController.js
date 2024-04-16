const User = require("../models/userModel");
const userLogin = async (req, res) => {
  try {
    const { phone, email, name, avatar, deviceId } = req.body;

    // Find user by phone number
    let userData = await User.findOne({ phone });

    if (userData) {
      // User exists, check the device ID
      if (deviceId) {
        // Remove previous device ID if exists and add the new one
        userData.deviceId = deviceId;
        await userData.save();
      }

      // Prepare user details for response
      const userResult = {
        _id: userData._id,
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        wallet: userData.wallet,
        avatar: userData.avatar,
        deviceIds: userData.deviceId, // Include device IDs in response
        userId: userData.userId
      };

      const response = {
        success: true,
        msg: "UserDetail",
        data: userResult,
      };
      res.status(200).send(response);
    } else {
      // User does not exist, create a new user
      if (!email || !name) {
        return res.status(400).send({ success: false, msg: "User not found" });
      }

      // Generate a unique user ID (assuming `generateUniqueUserID` is a function you have)
      const userID = await generateUniqueUserID();

      // Create a new user
      const newUser = new User({
        phone,
        email,
        name,
        avatar,
        userId: userID,
        wallet:0,
        deviceId: deviceId // Initialize device IDs array with provided device ID
      });

      // Save the new user
      const savedUser = await newUser.save();

      // Prepare user details for response
      const userResult = {
        _id: savedUser._id,
        name: savedUser.name,
        phone: savedUser.phone,
        email: savedUser.email,
        avatar: savedUser.avatar,
        userId: savedUser.userId,
        wallet: savedUser.wallet,
        deviceIds: savedUser.deviceId,
      };

      const response = {
        success: true,
        msg: "User created successfully",
        data: userResult,
      };
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await User.find();

    // If no wallets found, return a 404 response
    if (!users || users.length === 0) {
      return res.status(404).send({ error: "user not found" });
    }
    const response = {
      success: true,
      data: users,
    };

    // Send wallet data as a response
    res.status(200).send(response);
  } catch (error) {
    console.error("Error getting user :", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
async function generateUniqueUserID() {
  while (true) {
    var userID = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    // Check if the generated user ID already exists
    const existingUser = await User.findOne({ userId: userID });

    if (!existingUser) {
      // If the user ID is unique, return it
      return userID;
    }
  }
}

const updateProfile = async (req, res) => {
  const phone = req.body.phone;
  const existingUser = await User.findOne({ phone: phone });

  if (existingUser) {
    // User exists, update user details
    existingUser.name = req.body.name || existingUser.name;
    existingUser.email = req.body.email || existingUser.email;
    existingUser.avatar = req.body.avatar || existingUser.avatar;

    const updatedUser = await existingUser.save();

    const userResult = {
      _id: updatedUser._id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      email: updatedUser.email,
      wallet: updatedUser.wallet,
      avatar: updatedUser.avatar,
    };

    const response = {
      success: true,
      msg: "User details updated successfully",
      data: userResult,
    };

    res.status(200).send(response);
  }
};

module.exports = {
  userLogin,
  updateProfile,
  getUser
};
