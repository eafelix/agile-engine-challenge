import React, { useState, useEffect } from "react";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import { createTransaction, getTransactionsByUser } from "./client";

import Layout from "./components/Layout";
import TransactionsList from "./components/TransactionsList";
import TransactionForm from "./components/TransactionForm";
import ErrorAlert from "./components/ErrorAlert";

import "typeface-roboto";

const USER = "12345";

const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

/**
 * Main App React component
 * Handles the request to the account server to provide the basic operations and data fetch
 */
const App = () => {
  const [error, setErrors] = useState(false);
  const [Transaction, setTransaction] = useState([]);

  const fetchData = () => {
    getTransactionsByUser(USER)
      .then(res => setTransaction(res.transactions.transactions))
      .catch(err => setErrors(err));
  };

  const handleCreateTransaction = data =>
    createTransaction(USER, data)
      .then(res => fetchData(USER))
      .catch(err => setErrors(err));

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <Layout>
        <TransactionsList rows={Transaction} />
        <TransactionForm handleCreateTransaction={handleCreateTransaction} />
        {error && <ErrorAlert error={error} />}
      </Layout>
    </MuiThemeProvider>
  );
};

export default App;
