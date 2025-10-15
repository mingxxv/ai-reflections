/**
 * Get today's date in Asia/Singapore timezone as yyyy-mm-dd string
 */
export function getTodayString(): string {
  const now = new Date();
  const singaporeTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Singapore"}));
  
  const year = singaporeTime.getFullYear();
  const month = String(singaporeTime.getMonth() + 1).padStart(2, '0');
  const day = String(singaporeTime.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Generate a unique ID for journal entries
 */
export function generateEntryId(): string {
  return `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
