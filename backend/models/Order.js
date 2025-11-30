const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	userPhone: String,
	productName: String,
	status: String,
	expectedDelivery: String,
	trackingId: String,
});

module.exports = mongoose.model("Order", orderSchema);
