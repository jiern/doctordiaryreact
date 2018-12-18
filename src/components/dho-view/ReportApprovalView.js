import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';


const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        flexGrow: 1
    },
    container: {
        display: "flex",
        flexWrap: "wrap"
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        minWidth: 200
    },
    paper: {
        padding: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        textAlign: "center",
        color: theme.palette.text.primary,
    },
    button: {
        margin: theme.spacing.unit * 1,

        marginLeft: theme.spacing.unit * 5,
        marginRight: theme.spacing.unit * 5,
        backgroundColor: theme.palette.primary,

    },
});

function PaperSheet(props) {
    const { classes } = props;

    return (
        <div>
            <Grid
                container spacing={24}
                className={classes.root}>
                <Grid item xs>
                    <Paper className={classes.root} elevation={1}>
                        <Typography variant="h5" component="h3" square="true">
                            Report info:
                        </Typography>
                        <div className={classes.container}>
                            <TextField
                                label=""
                                disabled={true}
                                id=""
                                margin="dense"
                                value="3"
                                className={classes.textField}
                                helperText="No of Emergency Cesearean Cases provided anaesthesia during night time (5PM - Morning)"
                            />
                        </div>
                        <div className={classes.container}>
                            <TextField
                                label=""
                                disabled={true}
                                id=""
                                margin="normal"
                                value="1"
                                className={classes.textField}
                                helperText="No of Emergency Cesearean Cases provided anaesthesia during day till 5PM "
                            />
                        </div>
                        <div className={classes.container}>
                            <TextField
                                label=""
                                disabled={true}
                                id=""
                                margin="normal"
                                value="1"
                                className={classes.textField}
                                helperText="Anaesthesia provided to other cases"
                            />
                        </div>

                        <div className={classes.container}>
                            <TextField
                                label=""
                                disabled={true}
                                id=""
                                margin="normal"
                                value="Equipment / Drug issues"
                                className={classes.textField}
                                helperText="Challenges faced"
                            />
                        </div>

                        <div className={classes.container}>
                            <TextField
                                className={"input"}
                                label="Challenges faced other"
                                disabled={true}
                                name={props.name}
                                value=""
                                onChange={props.handleChange}
                                placeholder="No other challenges faced"
                                multiline
                                margin="normal"
                                variant="outlined"
                            />
                        </div>
                        <div className={classes.container}>
                            <TextField
                                className={"input"}
                                label="Remarks"
                                disabled={true}
                                name={props.name}
                                value=""
                                onChange={props.handleChange}
                                placeholder="No remarks"
                                multiline
                                margin="normal"
                                variant="outlined"
                            />
                        </div>

                    </Paper>
                </Grid>

                <Grid item xs>
                    <Paper className={classes.root} elevation={1} height="2000" margin="normal">
                        <Typography variant="h5" component="h3">
                            Doctor info:
                        </Typography>
                        <div className={classes.container}>
                            <TextField
                                label="Name"
                                disabled={true}
                                id="margin-none"
                                margin="dense"
                                value="Aksel J"
                                className={classes.textField}
                            />
                        </div>
                        <div className={classes.container}>
                            <TextField
                                label="Facility"
                                disabled={true}
                                id="margin-none"
                                margin="normal"
                                value="Barakuya MCHP"
                                className={classes.textField}
                            />
                        </div>
                        <div className={classes.container}>
                            <TextField
                                label="Report date"
                                disabled={true}
                                id="margin-none"
                                margin="normal"
                                value="19.10.2018"
                                className={classes.textField}
                            />
                        </div>

                        <div className={classes.container}>
                            <TextField
                                label="Due date"
                                disabled={true}
                                id="margin-none"
                                margin="normal"
                                value="20.12.2018"
                                className={classes.textField}
                            />
                        </div>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={24} />

            <Grid container spacing={24} className={classes.root}>
                <Grid item xs>
                    <Typography className={classes.paper} variant="h5" component="h3">
                        Comment
                    </Typography>
                    <Paper className={classes.root} elevation={1} height="2000" margin="normal">

                        <div className={classes.container}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Write a comment.."
                                multiline
                                rows="4"
                                defaultValue=""
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                name="props.name}"
                                onChange={props.handleChange}
                                placeholder="Write a comment here"
                                fullWidth
                            />
                        </div>
                    </Paper>
                </Grid >
            </Grid >
            <Grid container spacing={24} />

            <Grid container spacing={24} className={classes.paper}>
                <Grid item xs>
                    <Button className={classes.button} onClick={props.action} variant="contained" color="secondary">
                        Decline
                    </Button>
                    <Button className={classes.button} onClick={props.action} margin="normal" variant="contained" color="primary">
                        Approve
                    </Button>
                </Grid>
            </Grid>

        </div>
    );
}

PaperSheet.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PaperSheet);
