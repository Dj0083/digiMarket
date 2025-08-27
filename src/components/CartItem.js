import { productsAPI } from "../services/api";

async function handleAddProduct(productId) {
  try {
    await productsAPI.getProductById(productId);
    console.log("Product fetched successfully!");
  } catch (error) {
    if (error.code === "TOKEN_EXPIRED") {
      // Handle expired session
      console.log("Redirecting to login...");
      navigation.replace("Login"); // or however you navigate
    } else {
      console.error("API call failed:", error.message);
    }
  }
}
