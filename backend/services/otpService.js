const Otp = require("../models/Otp");
const User = require("../models/User");

// Generate 6-digit OTP
const generateOtp = () =>
	Math.floor(100000 + Math.random() * 900000).toString();

// Normalize phone number (remove spaces, dashes, etc.)
const normalizePhoneNumber = (phone) => {
	return phone.replace(/\D/g, ""); // Remove all non-digits
};

// Validate phone number format
const isValidPhoneNumber = (phone) => {
	const normalized = normalizePhoneNumber(phone);
	return normalized.length >= 10 && normalized.length <= 15;
};

/**
 * Send OTP to phone number
 * For production, integrate with SMS service like Twilio, AWS SNS, etc.
 * For development, OTP will be logged to console
 */
exports.sendOtpToPhone = async (phoneNumber) => {
	const normalizedPhone = normalizePhoneNumber(phoneNumber);

	if (!isValidPhoneNumber(normalizedPhone)) {
		throw new Error("Invalid phone number format");
	}

	const code = generateOtp();
	const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

	// Delete old OTPs for this phone number
	await Otp.deleteMany({ phoneNumber: normalizedPhone });

	// Create new OTP
	await Otp.create({
		phoneNumber: normalizedPhone,
		code,
		expiresAt,
	});

	// TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
	// For now, log to console for development
	console.log(`\n📱 OTP for ${normalizedPhone}: ${code}\n`);
	console.log("⚠️  In production, integrate with SMS service\n");

	// Example Twilio integration (uncomment and configure):
	/*
	const twilio = require('twilio');
	const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
	await client.messages.create({
		body: `Your OTP is ${code}. It expires in 5 minutes.`,
		to: normalizedPhone,
		from: process.env.TWILIO_PHONE_NUMBER
	});
	*/

	// Create or update user
	await User.updateOne(
		{ phoneNumber: normalizedPhone },
		{ phoneNumber: normalizedPhone },
		{ upsert: true }
	);

	return { success: true, message: "OTP sent successfully" };
};

/**
 * Verify OTP for phone number
 */
exports.verifyOtp = async (phoneNumber, code) => {
	const normalizedPhone = normalizePhoneNumber(phoneNumber);

	const record = await Otp.findOne({
		phoneNumber: normalizedPhone,
		code: code.trim(),
	});

	if (!record) {
		return { success: false, message: "Invalid OTP" };
	}

	// Check if OTP expired
	if (record.expiresAt < new Date()) {
		await Otp.deleteOne({ _id: record._id });
		return { success: false, message: "OTP has expired" };
	}

	// Delete OTP after successful verification
	await Otp.deleteMany({ phoneNumber: normalizedPhone });

	return { success: true, message: "OTP verified successfully" };
};

/**
 * Check if phone number is verified (has valid session)
 */
exports.isPhoneVerified = async (phoneNumber) => {
	const normalizedPhone = normalizePhoneNumber(phoneNumber);
	const user = await User.findOne({ phoneNumber: normalizedPhone });
	return !!user;
};
