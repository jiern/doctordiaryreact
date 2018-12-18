import React from "react";
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  }
});


const FormButtons = props => {
  const { classes } = props;
  return (
      <Button
        disabled={props.disabled}
        style={props.style}
        variant="contained"
        color={props.type}
        className={classes.button}
        onClick={props.action}
      >
        {props.title}
      </Button>
  );
};

FormButtons.propTypes = {
  type: PropTypes.string,
  style: PropTypes.string,
  action: PropTypes.func,
  title: PropTypes.string
};

export default withStyles(styles)(FormButtons);
