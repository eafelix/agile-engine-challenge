/**
 * Account API router
 * @module routes/account
 */
const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const { format } = require("date-fns");
const log = require("../logger");

const Lock = require("../helpers/lock");
const lock = new Lock();

/**
 * @param {String} userId - User id
 */
const formatDate = date => format(date, "MM/dd/yyyy HH:mm:ss.SSS");

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
const USER_TRANSACTIONS = [
  {
    userId: "12345",
    transactions: [
      { value: 0, action: "Initial", balance: 0, date: formatDate(new Date()) }
    ]
  }
];

/**
 * Get user transactions by user id
 * @param {string} userId - User id
 */
router.get("/:userId", function(req, res, next) {
  const { userId } = req.params;
  const transactions = getUserTransactions(userId);
  res.json({ transactions });
});

/**
 * Creates transaction for the user id provided
 * @param {string} - User id
 * @param {Transaction} - Transaction request object
 */
router.post("/:userId", function(req, res, next) {
  const { userId } = req.params;
  const { transaction } = req.body;
  log.debug(
    `processing transaction: ${JSON.stringify(transaction)}`,
    `user ${userId}`
  );
  return lock
    .acquire()
    .then(() => validateParams(transaction))
    .then(() => executetransaction(userId, transaction))
    .then(newtransaction => res.json(newtransaction))
    .catch(err => {
      log.debug(err)
      next(err)
    })
    .then(() => lock.release());
});

/**
 * Validate request parameters
 * Check if the amount has a valid and supported value
 * @param {Transaction} - Transaction object
 */
const validateParams = transaction => {
  const amount = Number(transaction.value);
  if (amount < 0) throw createError(402, "Negative values are not allowed");
  if (!Number.isFinite(amount)) {
    throw createError(402, "The amount is not finite");
  }
  // TODO: use big integer library to handle big balance values and operations.
  return;
};

/**
 * Represents a book.
 * @param {string} - User id
 * @param {Transaction} - Transaction request object
 */
const executetransaction = (userId, transaction) =>
  new Promise((resolve, reject) => {
    const { action, value } = transaction;
    const { balance } = getLasttransaction(userId);

    let newBalance = balance;
    // use absolute numbers to avoid negative numbers
    const amount = Math.abs(Number(value));

    if (action === "add") {
      newBalance += amount;
    }

    if (action === "remove") {
      if (balance < amount)
        return reject(createError(402, "Insufficient funds"));
      newBalance -= amount;
    }

    const newtransaction = {
      ...transaction,
      balance: newBalance,
      date: formatDate(new Date())
    };

    addUsertransaction(userId, newtransaction);
    resolve(newtransaction);
  });

/**
 * Obtains user transactions by user id
 * @param {string} userId - User id
 */
const getUserTransactions = userId =>
  USER_TRANSACTIONS.find(x => x.userId === userId);

/**
 * Get last transaction by user id
 * @param {string} userId - User id
 */
const getLasttransaction = userId => {
  const transactions = getUserTransactions(userId).transactions;
  return transactions[transactions.length - 1];
};

/**
 * Creates user's transaction in the database
 * @param {string} userId - User id
 * @param {Transaction} transaction - New transaction to save
 */
const addUsertransaction = (userId, transaction) => {
  const userIndex = USER_TRANSACTIONS.findIndex(x => x.userId === userId);
  return USER_TRANSACTIONS[userIndex].transactions.push(transaction);
};

module.exports = router;
