import React from "react";
import Alert from "@material-ui/lab/Alert";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  section: {
    marginTop: theme.spacing(3)
  }
}));

/**
 * Copyright component with reference to the company and UI framework
 * @param {object} - Error object from server or UI
 * @param error.message {string} - Error message
 */
const ErrorAlert = ({ error }) => {
  const classes = useStyles()
  return <Alert severity="error" className={classes.section}>{error.message}</Alert>;
};

export default ErrorAlert;
