import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import EventIcon from '@material-ui/icons/EventNote';
import ListItemIcon from '@material-ui/core/ListItemIcon';

/**
* Contains report results based on status DECLINED, ACCEPTED, PENDING or UNCOMPLETED
* A list of the doctors filtered events
*/
class ReportResult extends Component {
  render() {
    let reports = [];
    reports.length = 0;

    switch(this.props.status) {
      case 'Approved':
        reports = [];
        reports = this.props.acceptedCurrentDoctorReports;
        break;
      case 'Rejected':
        reports = [];
        reports = this.props.rejectedCurrentDoctorReports;
        break;
      case 'Pending':
        reports = [];
        reports = this.props.pendingCurrentDoctorReports;
        break;
      default:
        break;
    }

    const { classes } = this.props;

    if(this.props.status === 'Uncompleted'){
      return (
        <div className={'reportList'}>
          <Divider/>
            <List component="nav">
              {(this.props.allIncompleteDoctorsReports !== undefined) &&
              (this.props.allIncompleteDoctorsReports.length !== 0) ?
                (this.props.allIncompleteDoctorsReports.length === 1) ?
                  <ListItem key={this.props.allIncompleteDoctorsReports.event} id={this.props.allIncompleteDoctorsReports.event} button onClick={this.props.handleEditReportButtonClick} className={classes.ul}>
                    <ListItemIcon>
                      <EventIcon />
                    </ListItemIcon>
                    {this.props.prettyPrintDate(this.props.allIncompleteDoctorsReports.dueDate)}
                  </ListItem>
                :
                (Array.from(new Set(this.props.allIncompleteDoctorsReports))).map((event, index) => (
                  <div className={'testd'}>
                  <ListItem key={index+event.event} id={event.event} button onClick={this.props.handleEditReportButtonClick} className={classes.ul}>
                    <ListItemIcon>
                      <EventIcon />
                    </ListItemIcon>
                    {this.props.prettyPrintDate(event.dueDate)}
                  </ListItem>
                  </div>
                ))
                : <p>No uncompleted reports</p>
              }
            </List>
          <Divider/>
        </div>
      )
    } else {
      return (
          <div className={'reportList'}>
            <Divider/>
              <List component="nav">
                {(reports !== undefined) &&
                (reports.length !== 0) ?
                  (reports.length === 1) ?
                    <ListItem key={reports.event} id={reports.event} button onClick={this.props.handleEditReportButtonClick} className={classes.ul}>
                      <ListItemIcon>
                        <EventIcon />
                      </ListItemIcon>
                      {reports[0].eventDate
                        ? this.props.prettyPrintDate(reports[0].eventDate)
                        : (reports[0].dataValues.length > 0)
                          ? (this.props.prettyPrintDate(reports[0].dueDate.split(0, 15)))
                          : <p>Empty report</p>
                      }
                    </ListItem>
                    :
                    (reports).map((event, index) => (
                      <ListItem key={index+event.event} id={event.event} button onClick={this.props.handleEditReportButtonClick} className={classes.ul}>
                        <ListItemIcon>
                          <EventIcon />
                        </ListItemIcon>
                        {event.eventDate
                          ? this.props.prettyPrintDate(event.eventDate)
                          : (event.dataValues.length > 0)
                          ? (this.props.prettyPrintDate(event.dueDate.split(0, 15)))
                          : <p>Empty report</p>
                        }
                      </ListItem>
                  ))
                  : <p>No {this.props.status} reports</p>
                }
              </List>
            <Divider/>
          </div>
      );
    }
  };
}

ReportResult.propTypes = {
  status: PropTypes.string,
  classes: PropTypes.object.isRequired,
  prettyPrintDate: PropTypes.func,
  allCompletedDoctorsReports: PropTypes.array
};

const styles = ({
  root: {
    width: '100%',
    maxWidth: '70%',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 600,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    textAlign: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

export default withStyles(styles)(ReportResult);