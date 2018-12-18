import React from "react";
import TextField from '@material-ui/core/TextField';

const TextArea = props => (
  <div className="form-group">
    <TextField
      className={"input"}
      label={props.label}
      name={props.name}
      value={props.value}
      onChange={props.handleChange}
      placeholder="Placeholder"
      multiline
      margin="normal"
      variant="outlined"
      disabled={props.disabled}
    />
  </div>
);

export default TextArea;
