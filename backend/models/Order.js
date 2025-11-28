const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		userEmail: { type: String, required: true },
		items: [
			{
				name: String,
				quantity: Number,
			},
		],
		status: {
			type: String,
			enum: ["PENDING", "CONFIRMED", "DISPATCHED", "DELIVERED", "CANCELLED"],
			default: "PENDING",
		},
		expectedDelivery: { type: Date },
		courier: { type: String },
		trackingId: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
