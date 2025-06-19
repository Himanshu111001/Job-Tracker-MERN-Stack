/**
 * Utility for generating and validating admin invite codes
 */
const crypto = require('crypto');

/**
 * Validates if an invite code is valid for creating an admin account
 * @param {string} inviteCode - The invite code to validate
 * @returns {boolean} - True if the invite code is valid
 */
exports.validateAdminInviteCode = (inviteCode) => {
  const adminInviteSecret = process.env.ADMIN_INVITE_SECRET;
  
  // If no secret is configured, no invite codes are valid
  if (!adminInviteSecret) {
    console.error('ADMIN_INVITE_SECRET environment variable not set');
    return false;
  }
  
  // Create a hash of the current month + secret to generate a time-limited code
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const timeKey = `${currentMonth}-${currentYear}`;
  
  const validHash = crypto
    .createHmac('sha256', adminInviteSecret)
    .update(timeKey)
    .digest('hex')
    .substring(0, 12);
  
  // Also check previous month's code for validity (to avoid issues at month boundaries)
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  const prevTimeKey = `${prevMonth}-${prevYear}`;
  
  const prevValidHash = crypto
    .createHmac('sha256', adminInviteSecret)
    .update(prevTimeKey)
    .digest('hex')
    .substring(0, 12);
  
  return inviteCode === validHash || inviteCode === prevValidHash;
};

/**
 * Generates a new admin invite code
 * @returns {string} - The generated invite code
 */
exports.generateAdminInviteCode = () => {
  const adminInviteSecret = process.env.ADMIN_INVITE_SECRET;
  
  if (!adminInviteSecret) {
    console.error('ADMIN_INVITE_SECRET environment variable not set');
    return null;
  }
  
  // Create a hash of the current month + secret to generate a time-limited code
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const timeKey = `${currentMonth}-${currentYear}`;
  
  return crypto
    .createHmac('sha256', adminInviteSecret)
    .update(timeKey)
    .digest('hex')
    .substring(0, 12);
};
