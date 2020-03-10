import React, { Component } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

/**
 * Title common component to create titles
 * @param {Component} props.children - Children array to apply the title style
 */
const Title = props => (
  <Typography component="h2" variant="h6" color="primary" gutterBottom>
    {props.children}
  </Typography>
);

Title.propTypes = {
  children: PropTypes.node
};

export default Title;
