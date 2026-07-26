const { importWordPressBlogs } = require('../scripts/importBlogs');

let syncInterval = null;
let lastSyncStatus = {
  lastSyncTime: null,
  status: 'Idle',
  results: null,
  error: null
};

/**
 * Run synchronization task
 */
async function runSync() {
  console.log(`\n[CRON/SYNC] Starting scheduled WordPress blog synchronization at ${new Date().toISOString()}...`);
  lastSyncStatus.status = 'In Progress';

  try {
    const results = await importWordPressBlogs();
    lastSyncStatus.lastSyncTime = new Date().toISOString();
    lastSyncStatus.status = 'Success';
    lastSyncStatus.results = results;
    lastSyncStatus.error = null;
    console.log(`[CRON/SYNC] WordPress blog sync completed successfully.`);
    return results;
  } catch (error) {
    lastSyncStatus.lastSyncTime = new Date().toISOString();
    lastSyncStatus.status = 'Failed';
    lastSyncStatus.error = error.message;
    console.error(`[CRON/SYNC] WordPress blog sync failed:`, error.message);
    throw error;
  }
}

/**
 * Start background hourly cron sync
 */
function initBlogCron() {
  // Run once on backend startup after 10 seconds delay
  setTimeout(() => {
    runSync().catch(err => console.error('Initial cron sync error:', err.message));
  }, 10000);

  // Run every 1 hour (3600000 ms)
  syncInterval = setInterval(() => {
    runSync().catch(err => console.error('Hourly cron sync error:', err.message));
  }, 60 * 60 * 1000);

  console.log('⏰ WordPress Blog Auto-Sync Cron initialized (Runs every 1 hour).');
}

/**
 * Get current sync status
 */
function getSyncStatus() {
  return lastSyncStatus;
}

module.exports = {
  initBlogCron,
  runSync,
  getSyncStatus
};
