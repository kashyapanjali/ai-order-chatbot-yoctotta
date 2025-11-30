const Order = require("../models/Order");

const tools = {
  get_latest_order: {
    description: "Get latest order using user email",
    params: ["email"],
    handler: async ({ email }) => {
      const order = await Order.findOne({ userEmail: email }).sort({
        createdAt: -1
      });

      if (!order) {
        return { success: false, message: "No orders found." };
      }

      return {
        success: true,
        status: order.status,
        items: order.items,
        expectedDelivery: order.expectedDelivery,
        courier: order.courier,
        trackingId: order.trackingId,
        createdAt: order.createdAt
      };
    }
  }
};

const runTool = async (name, args) => {
  const tool = tools[name];
  if (!tool) {
    throw new Error(`Unknown tool: ${name}`);
  }
  return tool.handler(args);
};

module.exports = { tools, runTool };
