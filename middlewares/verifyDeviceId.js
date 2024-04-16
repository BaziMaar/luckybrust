// Importing necessary modules
const User = require('../models/userModel'); // Import your User model

// Middleware function to verify device ID
const verifyDeviceId = async (req, res, next) => {
    try {
        // Get the phone number and device ID from the request body
        const { phone, deviceId } = req.body;

        // Find the user by phone number
        const existingUser = await User.findOne({ phone });

        if (!existingUser) {
            // User not found
            return res.status(404).send({
                success: false,
                msg: "User not found",
            });
        }

        // Check if the provided device ID matches the one stored in the user record
        if (existingUser.deviceId !== deviceId) {
            // Device ID does not match
            return res.status(403).send({
                success: false,
                msg: "Device ID does not match",
            });
        }

        // Device ID matches, allow the request to proceed
        next();
    } catch (error) {
        // Handle any errors that may occur
        res.status(500).send({
            success: false,
            msg: error.message,
        });
    }
};

const getVerifyDeviceId = async (req, res, next) => {
    try {
        // Get the phone number and device ID from the request body
        const { phone, deviceId } = req.query;

        // Find the user by phone number
        const existingUser = await User.findOne({ phone });

        if (!existingUser) {
            // User not found
            return res.status(404).send({
                success: false,
                msg: "User not found",
            });
        }

        // Check if the provided device ID matches the one stored in the user record
        if (existingUser.deviceId !== deviceId) {
            // Device ID does not match
            return res.status(403).send({
                success: false,
                msg: "Device ID does not match",
            });
        }

        // Device ID matches, allow the request to proceed
        next();
    } catch (error) {
        // Handle any errors that may occur
        res.status(500).send({
            success: false,
            msg: error.message,
        });
    }
};

// Export the middleware
module.exports = {verifyDeviceId,getVerifyDeviceId};
