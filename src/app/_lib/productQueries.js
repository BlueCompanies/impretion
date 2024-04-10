//import Product from "../_models/Product";

// Get all products in pryntart (database) > products (collection).

/*
export async function getProducts() {
  try {
    const result = await Product.find({}).sort({ _id: -1 }); // Sorting by _id in descending order

    return result;
  } catch (error) {
    return { error: "Failed to fetch products." };
  }
}


export async function queryProducts(searchParam) {
  try {
    // Check if searchParam is empty (no filters provided)
    if (Object.keys(searchParam).length === 0) {
      // Return all products
      const result = await Product.find({});
      return result;
    }

    // Convert the search keyword to lowercase
    const keyword = searchParam.name.toLowerCase();

    // Use $regex to perform a case-insensitive search
    const findParams = { name: { $regex: keyword, $options: "i" } };

    const result = await Product.find(findParams);
    return result;
  } catch (error) {
    return { error: "Failed to fetch products." };
  }
}

// Get all products with selected fields
export async function getProductsByField(fields) {
  try {
    const result = await Product.find({}, fields);
    console.log("resultado: ", result);
    return result;
  } catch (error) {
    return { error: "Failed to fetch products." };
  }
}

// Get product by its id.
export async function getProductById(id) {
  try {
    console.log(id);
    const result = await Product.findById(id);
    return result;
  } catch (error) {
    return { error: `Failed to fetch product with id ${id}` };
  }
}

*/
