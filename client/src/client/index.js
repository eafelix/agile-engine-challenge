import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
  headers: { "Access-Control-Allow-Origin": true }
});

/**
 * In-memory data base of user transactions
 *
 * @typedef Transaction
 * @type {object}
 * @property {string} userId - User id
 * @property {object} transaction - Transaction request object
 * @property {number} transaction.value - Amount to debit/credit
 * @property {string} transaction.action - String that represents debit/credit actions ['add','remove']
 * @property {number} transaction.balance - Last balance for the account, preserved in the last transaction row
 * @property {date} transaction.date - Date of the transaction
 */

/**
 * Extracts data from Axios response object
 * @param {object} response - Axios response object
 */
const getDataFromEnvelop = response => response.data;

/**
 * Extracts server error data from Axios error response object
 * @param {object} error - Axios error object
 */
const bubbleError = error => {
  throw error.response.data;
};

/**
 * Get transactions by user id
 * @param {string} userId - User Id
 * @returns {Array[Transaction]} - Array of transactions
 */
export const getTransactionsByUser = userId => {
  return client
    .get(`/account/${userId}`)
    .then(getDataFromEnvelop)
    .catch(bubbleError);
};

/**
 * Create transaction for the user id provided
 * @param {string} userId - User Id
 * @param {Transaction} transaction - Transaction object
 * @returns {Transaction} - Created Transaction
 */
export const createTransaction = (userId, transaction) => {
  return client
    .post(`/account/${userId}`, { transaction })
    .then(getDataFromEnvelop)
    .catch(bubbleError);
};

export default { getTransactionsByUser, createTransaction };
