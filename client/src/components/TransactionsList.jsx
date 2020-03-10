import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";

const useStyles = makeStyles(theme => ({
  section: {
    marginTop: theme.spacing(3)
  }
}));

/**
 * Transaction List component to show a list of transactions with general data
 * @param {Array} rows - Array of Transactions objects
 */
const TransaccionsList = ({ rows = [] }) => {
  const classes = useStyles()
  return (
  <div className={classes.section}>
    <Title>Transaccions</Title>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Action</TableCell>
          <TableCell>Value</TableCell>
          <TableCell>Balance</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row.id} selected={row.action === 'remove' ? 'hover' : ''}>
            <TableCell>{row.date}</TableCell>
            <TableCell>{row.action}</TableCell>
            <TableCell>{row.value}</TableCell>
            <TableCell>{row.balance}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)};

export default TransaccionsList