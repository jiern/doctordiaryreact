import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Badge from '@material-ui/core/Badge';

class StatusButtons extends Component {
    state = {
        status: 3 //No option selected
    };

    handleChange = (event, status) => {
        event.preventDefault();
        this.setState({status});
        switch(status) {
            case 0:
                this.props.handleClick('Uncompleted', 'blue', event);
                break;
            case 1:
                this.props.handleClick('Pending', 'yellow', event);
                break;
            case 2:
                this.props.handleClick('Approved', 'green', event);
                break;
            case 3:
                this.props.handleClick('Rejected', 'red', event);
                break;
            default:
                console.log('ERROR: undefined status')
        }
    };

    render() {
        const { status } = this.state;

        return (
          <div className='bottomNav'>
            <Badge color="secondary" badgeContent={(this.props.rejectedReports).length} >
            <BottomNavigation value={status} onChange={this.handleChange} showLabels className={'navBar'}>
                <BottomNavigationAction label='Uncompleted' className={'navItem'} />
                <BottomNavigationAction label='Pending' className={'navItem'} />
                <BottomNavigationAction label='Approved' className={'navItem'} />
                <BottomNavigationAction label='Rejected' className={'navItem'} />
            </BottomNavigation>
            </Badge>
          </div>
        );
    }
}

StatusButtons.propTypes = {
    handleClick: PropTypes.func.isRequired
};

export default StatusButtons;
