import Order from "../_models/Order";

// Get all products in pryntart (database) > products (collection).
export async function getAllOrders() {
  try {
    const result = await Order.find({});

    return result;
  } catch (error) {
    return { error: "Failed to fetch products." };
  }
}
