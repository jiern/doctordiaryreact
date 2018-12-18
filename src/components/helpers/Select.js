import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const Select = props => {
  const { classes } = props;

  return (
    <div className="form-group">
      <form className={classes.container, 'dropdown'} noValidate autoComplete="off">
        <TextField
          id={props.name}
          name={props.name}
          select
          label="Challenges faced"
          value={props.value}
          onChange={props.handleChange}
          SelectProps={{ MenuProps: { className: classes.menu } }}
          variant="outlined"
          className='dropdownText'
          disabled={props.disabled}
        >
          {props.options.map((option) => (
            <MenuItem key={option} value={option} label={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </form>
    </div>
  );
};

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: { marginTop: 16 },
  menu: { width: 200 },
});

export default withStyles(styles)(Select);

Select.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array
};