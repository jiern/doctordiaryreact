import React from "react";
import TextField from "@material-ui/core/TextField/TextField";

const Input = props => {
  return (
    <div className="textfield">
      <TextField
        className="input"
        variant="outlined"
        name={props.name}
        disabled={props.disabled}
        label={props.label}
        type={props.inputType}
        value={props.value}
        onChange={props.handleChange}
        placeholder={props.placeholder}
        {...props}
      />
    </div>
  );
};

export default Input;










/*import purple from "@material-ui/core/colors/purple";
import TextField from "@material-ui/core/TextField/TextField";
import React from "react";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";

function InputFields(props) {
  const { classes } = props;
  return (
    <div className='form'>
      <TextField
        InputLabelProps={{
          classes: {
            root: classes.cssLabel,
            focused: classes.cssFocused,
          },
        }}
        InputProps={{
          classes: {
            root: classes.cssOutlinedInput,
            focused: classes.cssFocused,
            notchedOutline: classes.notchedOutline,
          },
        }}
        name={props.name}
        label={props.label}
        variant="outlined"
        value= {props.value}
        id="custom-css-outlined-input"
        type='number'
        className='numberInput'
        onChange = {props.onChange}
      />
    </div>
  );
}

InputFields.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  cssLabel: {
    '&$cssFocused': {
      color: purple[500],
    },
  },
  cssFocused: {},
  cssUnderline: {
    '&:after': {
      borderBottomColor: purple[500],
    },
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: 'blue',
    },
  },
  notchedOutline: {},
});

export default withStyles(styles)(InputFields);
*/
