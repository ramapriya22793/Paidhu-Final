const wooCommerceSyncService = require('../services/WooCommerceSyncService');

const syncProducts = async (req, res) => {
  try {
    const result = await wooCommerceSyncService.syncProducts();
    res.json({ message: "Products synchronized successfully", result });
  } catch (error) {
    console.error("[syncProducts Controller] Error:", error);
    res.status(500).json({ error: "Failed to sync products from WooCommerce", details: error.message });
  }
};

const syncOrders = async (req, res) => {
  try {
    const result = await wooCommerceSyncService.syncOrders();
    res.json({ message: "Orders synchronized successfully", result });
  } catch (error) {
    console.error("[syncOrders Controller] Error:", error);
    res.status(500).json({ error: "Failed to sync orders from WooCommerce", details: error.message });
  }
};

const syncCustomers = async (req, res) => {
  try {
    const result = await wooCommerceSyncService.syncCustomers();
    res.json({ message: "Customers synchronized successfully", result });
  } catch (error) {
    console.error("[syncCustomers Controller] Error:", error);
    res.status(500).json({ error: "Failed to sync customers from WooCommerce", details: error.message });
  }
};

const syncAll = async (req, res) => {
  try {
    const result = await wooCommerceSyncService.syncAll();
    res.json({ message: "Full WooCommerce synchronization completed", result });
  } catch (error) {
    console.error("[syncAll Controller] Error:", error);
    res.status(500).json({ error: "Failed to run full WooCommerce sync", details: error.message });
  }
};

const getSyncStatus = async (req, res) => {
  res.json({
    status: "HEALTHY",
    target: "https://wp.paidhu.com",
    lastSyncTime: new Date().toISOString()
  });
};

module.exports = {
  syncProducts,
  syncOrders,
  syncCustomers,
  syncAll,
  getSyncStatus
};
