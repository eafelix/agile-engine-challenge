import React from "react";

import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

/**
 * Copyright component with reference to the company and UI framework
 */
const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Agile Engine
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default Copyright;
