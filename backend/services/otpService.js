const Otp = require("../models/Otp");

exports.sendOtp = async (phone) => {
	const otp = Math.floor(100000 + Math.random() * 900000).toString();

	await Otp.create({
		phone,
		otp,
		expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
	});

	console.log("OTP (for testing):", otp); // SIMULATED OTP
	return otp;
};

exports.verifyOtp = async (phone, otp) => {
	const data = await Otp.findOne({ phone, otp });

	if (!data) return false;
	if (data.expiresAt < new Date()) return false;

	return true;
};
