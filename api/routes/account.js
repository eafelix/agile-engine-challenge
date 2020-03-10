const express = require("express");
const router = express.Router();
const { format } = require("date-fns");
const log = require('../logger')

const Lock = require("../helpers/lock");
const lock = new Lock();

const formatDate = date => format(date, "MM/dd/yyyy");

const USER_TRANSACTIONS = [
  {
    userId: "12345",
    transactions: [
      { value: 0, action: "add", balance: 0, date: formatDate(new Date()) }
    ]
  }
];

router.get("/:userId", function(req, res, next) {
  const { userId } = req.params;
  const transactions = getUserTransactions(userId);
  res.json({ transactions });
});

router.post("/:userId", function(req, res, next) {
  const { userId } = req.params;
  // transaction shape: { value: Number, accion: [add, remove]}
  const { transaction } = req.body;
  log.debug(
    `processing transaction: ${JSON.stringify(transaction)}`,
    `user ${userId}`
  );
  lock
    .acquire()
    .then(() => {
      return executetransaction(userId, transaction);
    })
    .then(newtransaction => {
      return res.json(newtransaction);
    })
    .catch(err => res.send(err))
    .then(() => lock.release());
});

const executetransaction = (userId, transaction) =>
  new Promise((resolve, reject) => {
    const { action, value } = transaction;
    const { balance } = getLasttransaction(userId);

    let newBalance = balance;

    if (action === "add") {
      newBalance += Number(value);
    }

    if (action === "remove") {
      newBalance -= Number(value);
    }

    const newtransaction = {
      ...transaction,
      balance: newBalance,
      date: formatDate(new Date())
    };

    addUsertransaction(userId, newtransaction);
    resolve(newtransaction);
  });

const getUserTransactions = userId =>
  USER_TRANSACTIONS.find(x => x.userId === userId);

const getLasttransaction = userId => {
  const transactions = getUserTransactions(userId).transactions;
  return transactions[transactions.length - 1];
};

const addUsertransaction = (userId, transaction) => {
  const userIndex = USER_TRANSACTIONS.findIndex(x => x.userId === userId);
  return USER_TRANSACTIONS[userIndex].transactions.push(transaction);
};

module.exports = router;
