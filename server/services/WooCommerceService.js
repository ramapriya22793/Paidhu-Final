const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

class WooCommerceService {
  constructor() {
    const url = process.env.WOOCOMMERCE_URL || "https://wp.paidhu.com";
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || "ck_dummy_key";
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || "cs_dummy_secret";

    this.api = new WooCommerceRestApi({
      url: url,
      consumerKey: consumerKey,
      consumerSecret: consumerSecret,
      version: "wc/v3",
      queryStringAuth: true // Useful for HTTPS
    });
  }

  async getProducts(params = { per_page: 100 }) {
    try {
      const response = await this.api.get("products", params);
      return response.data;
    } catch (error) {
      console.error("[WooCommerceService] Error fetching products:", error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async getOrders(params = { per_page: 100 }) {
    try {
      const response = await this.api.get("orders", params);
      return response.data;
    } catch (error) {
      console.error("[WooCommerceService] Error fetching orders:", error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async getCustomers(params = { per_page: 100 }) {
    try {
      const response = await this.api.get("customers", params);
      return response.data;
    } catch (error) {
      console.error("[WooCommerceService] Error fetching customers:", error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async getCategories(params = { per_page: 100 }) {
    try {
      const response = await this.api.get("products/categories", params);
      return response.data;
    } catch (error) {
      console.error("[WooCommerceService] Error fetching categories:", error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async getCoupons(params = { per_page: 100 }) {
    try {
      const response = await this.api.get("coupons", params);
      return response.data;
    } catch (error) {
      console.error("[WooCommerceService] Error fetching coupons:", error.response ? error.response.data : error.message);
      throw error;
    }
  }
}

module.exports = new WooCommerceService();
