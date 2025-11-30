const Otp = require("../models/Otp");

exports.sendOtp = async (phone) => {
	try {
		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		await Otp.create({
			phone,
			otp,
			expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
		});

		console.log("OTP (for testing):", otp); // SIMULATED OTP
		return otp;
	} catch (error) {
		console.error("Error sending OTP:", error);
		throw error;
	}
};

exports.verifyOtp = async (phone, otp) => {
	try {
		const data = await Otp.findOne({ phone, otp });

		if (!data) return false;
		if (data.expiresAt < new Date()) return false;

		return true;
	} catch (error) {
		console.error("Error verifying OTP:", error);
		return false;
	}
};
