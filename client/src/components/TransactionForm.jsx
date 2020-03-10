import React, { useRef, useCallback, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import { makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(3)
  },
  section: {
    marginTop: theme.spacing(3)
  }
}));

/**
 * Title common component to create titles
 * @param {function} handleCreateTransaction - Handles and recieves the data from the form to create a transaction
 */
const TransactionForm = ({ handleCreateTransaction }) => {
  const classes = useStyles();
  const { register, handleSubmit, errors, control } = useForm();

  const [isSending, setIsSending] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const sendTransaction = useCallback(
    data => {
      if (isSending) return;
      setIsSending(true);

      handleCreateTransaction(data).then(x => {
        if (isMounted.current) setIsSending(false);
      });
    },
    [isSending, handleCreateTransaction]
  );

  const onSubmit = (data, e) => {
    e.preventDefault();
    sendTransaction(data);
  };

  return (
    <div className={classes.section}>
      <Typography variant="h6" gutterBottom>
        Create Transaction
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          as={
            <Select fullWidth>
              <MenuItem value={"add"}>Add</MenuItem>
              <MenuItem value={"remove"}>Remove</MenuItem>
            </Select>
          }
          id="action"
          label="Action"
          name="action"
          control={control}
          defaultValue="add"
        />

        <TextField
          id="value"
          label="Value"
          name="value"
          type="number"
          InputProps={{
            inputProps: {
              min: 0
            }
          }}
          defaultValue={0}
          inputRef={register({ required: true })}
          fullWidth
        />
        <p>{errors.value && "Missing Value"}</p>
        <p>{errors.action && "Missing Action"}</p>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={classes.button}
          disabled={isSending}
        >
          Create Transaccion
        </Button>
      </form>
    </div>
  );
};

export default TransactionForm;
