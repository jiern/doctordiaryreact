import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

function LinkTab(props) {
    return <Tab component="a" onClick={event => event.preventDefault()} {...props} />;
}

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.blue,
    },
});

class NavTabs extends React.Component {
    handleChange = (value) => {
        this.setStatusValue(value);
    };

    render() {
        const { classes, value } = this.props;

        return (
            <NoSsr>
                <div className={classes.root}>
                    <AppBar position="static">
                        <Tabs fullWidth value={value} onChange={this.handleChange}>
                            <LinkTab label="Pending" />
                            <LinkTab label="Declined"  />
                            <LinkTab label="Approved" />
                        </Tabs>
                    </AppBar>
                    {value === 0}
                    {value === 1}
                    {value === 2}
                </div>
            </NoSsr>
        );
    }
}

NavTabs.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavTabs);
