const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		phoneNumber: { type: String, required: true },
		orderId: { type: String, unique: true, required: true },
		items: [
			{
				name: String,
				quantity: Number,
				price: Number,
			},
		],
		totalAmount: { type: Number, required: true },
		status: {
			type: String,
			enum: ["PENDING", "CONFIRMED", "PROCESSING", "DISPATCHED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
			default: "PENDING",
		},
		expectedDelivery: { type: Date },
		deliveryAddress: {
			street: String,
			city: String,
			state: String,
			pincode: String,
		},
		courier: { type: String },
		trackingId: { type: String },
		notes: { type: String },
	},
	{ timestamps: true }
);

// Index for faster queries
orderSchema.index({ phoneNumber: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 });

module.exports = mongoose.model("Order", orderSchema);
