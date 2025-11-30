const Order = require("../models/Order");
const { v4: uuidv4 } = require("uuid");

// Normalize phone number
const normalizePhoneNumber = (phone) => {
	return phone.replace(/\D/g, "");
};

/**
 * Get latest order for a phone number
 */
exports.getLatestOrder = async (phoneNumber) => {
	const normalizedPhone = normalizePhoneNumber(phoneNumber);
	const order = await Order.findOne({ phoneNumber: normalizedPhone }).sort({
		createdAt: -1,
	});

	if (!order) {
		return { success: false, message: "No orders found for this number." };
	}

	return {
		success: true,
		order: {
			orderId: order.orderId,
			status: order.status,
			items: order.items,
			totalAmount: order.totalAmount,
			expectedDelivery: order.expectedDelivery,
			courier: order.courier,
			trackingId: order.trackingId,
			deliveryAddress: order.deliveryAddress,
			createdAt: order.createdAt,
		},
	};
};

/**
 * Get all orders for a phone number
 */
exports.getAllOrders = async (phoneNumber) => {
	const normalizedPhone = normalizePhoneNumber(phoneNumber);
	const orders = await Order.find({ phoneNumber: normalizedPhone })
		.sort({ createdAt: -1 })
		.limit(10);

	return {
		success: true,
		orders: orders.map((order) => ({
			orderId: order.orderId,
			status: order.status,
			items: order.items,
			totalAmount: order.totalAmount,
			expectedDelivery: order.expectedDelivery,
			createdAt: order.createdAt,
		})),
	};
};

/**
 * Get order by order ID
 */
exports.getOrderById = async (orderId) => {
	const order = await Order.findOne({ orderId });

	if (!order) {
		return { success: false, message: "Order not found." };
	}

	return {
		success: true,
		order: {
			orderId: order.orderId,
			phoneNumber: order.phoneNumber,
			status: order.status,
			items: order.items,
			totalAmount: order.totalAmount,
			expectedDelivery: order.expectedDelivery,
			courier: order.courier,
			trackingId: order.trackingId,
			deliveryAddress: order.deliveryAddress,
			createdAt: order.createdAt,
			updatedAt: order.updatedAt,
		},
	};
};

/**
 * Create a new order
 */
exports.createOrder = async (orderData) => {
	const normalizedPhone = normalizePhoneNumber(orderData.phoneNumber);

	const orderId = `ORD-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;

	const order = await Order.create({
		phoneNumber: normalizedPhone,
		orderId,
		items: orderData.items || [],
		totalAmount: orderData.totalAmount || 0,
		status: "PENDING",
		expectedDelivery: orderData.expectedDelivery,
		deliveryAddress: orderData.deliveryAddress,
		notes: orderData.notes,
	});

	return {
		success: true,
		order: {
			orderId: order.orderId,
			status: order.status,
			items: order.items,
			totalAmount: order.totalAmount,
			createdAt: order.createdAt,
		},
	};
};

/**
 * Update order status
 */
exports.updateOrderStatus = async (orderId, status) => {
	const validStatuses = [
		"PENDING",
		"CONFIRMED",
		"PROCESSING",
		"DISPATCHED",
		"OUT_FOR_DELIVERY",
		"DELIVERED",
		"CANCELLED",
	];

	if (!validStatuses.includes(status)) {
		return { success: false, message: "Invalid status" };
	}

	const order = await Order.findOneAndUpdate(
		{ orderId },
		{ status, updatedAt: new Date() },
		{ new: true }
	);

	if (!order) {
		return { success: false, message: "Order not found" };
	}

	return {
		success: true,
		order: {
			orderId: order.orderId,
			status: order.status,
		},
	};
};

/**
 * Update tracking information
 */
exports.updateTracking = async (orderId, trackingData) => {
	const order = await Order.findOneAndUpdate(
		{ orderId },
		{
			courier: trackingData.courier,
			trackingId: trackingData.trackingId,
			expectedDelivery: trackingData.expectedDelivery,
			updatedAt: new Date(),
		},
		{ new: true }
	);

	if (!order) {
		return { success: false, message: "Order not found" };
	}

	return {
		success: true,
		order: {
			orderId: order.orderId,
			courier: order.courier,
			trackingId: order.trackingId,
			expectedDelivery: order.expectedDelivery,
		},
	};
};

