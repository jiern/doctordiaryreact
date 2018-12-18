/*

            <Route
              exact
              path={ROUTES.DOCTOR_START_PAGE}
              render={props => (
                <DoctorOverview
                  {...props}
                  setHeaderText={this.setHeaderText}
                  setSubHeaderText={this.setSubHeaderText}
                  setHeaderColor={this.setHeaderColor}
                  visitorOrganisationUnitID={this.state.visitorOrganisationUnitID}
                  setView={this.setView}
                  viewTypes={viewTypes}
                  reportModes={reportModes}
                  reportMode={this.state.reportMode}
                  reportRejected={this.state.reportRejected}
                />
              )}
            />

          <Route
            exact
            path={ROUTES.DOCTOR_REPORT_VIEW}
            render ={ props => (
                <ReportView
                  {...props}
                  setView={this.props.setView}
                  viewTypes={this.props.viewTypes}
                  visitorOrganisationUnitID = {this.props.visitorOrganisationUnitID}
                  setHeaderText={this.props.setHeaderText}
                  setSubHeaderText={this.props.setSubHeaderText}
                  prettyPrintDate={this.prettyPrintDate}
                  reportModes={this.props.reportModes}
                  reportMode={this.props.reportMode}
                  reportRejected={this.props.reportRejected}
                />
            )}
          />


   // Render inside data-element Approved/Rejected Current Status TODO: Fjern, dette er bare for synlighet
  renderStatusOptions = () => {
    return this.state.reportStatusOptionSetNames.map( (item,i) =>
      <p key={i}> {item} </p>
    )
  };

  // Render inside form meta data fields TODO: Fjern
  renderFormMetaData = () => {
    return this.state.formDataElementsFromProgramStage.map( (item,i) =>
      <li key={i}> {item} </li>
    )
  };

  getAllReportsByDoctor = () => {
    Api.getAllReportsByDoctor(this.props.visitorOrganisationUnitID)
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error during getAllReportsByDoctor request:', error);
      })
  };

// POST Requests - Add new resource NB! Not finished ...
  updateReport = (visitorName, eventID, orgUnitID, orgUnitName, trackedEntityID, programID, programStageID) => {
    //TODO: Kanskje vi heller skal sende med en body med innholdet i ny rapport? Usikker på fremgangsmåte

    return fetch(`${dhis2.developmentBaseUrl}/events/${eventID}`, {
      method: 'POST',
      'Content-type': 'application/json',
      headers,
      body: {
      "href": `https://course.dhis2.org/dhis/api/events/${eventID}`,
      "event": `${eventID}`,
      "status": "ACTIVE", // COMPLETED?
      "program": `${programID}`,
      "programStage": `${programStageID}`,
      "enrollment": "", // ID, hva?
      "enrollmentStatus": "ACTIVE",
      "orgUnit": `${orgUnitID}`, // ID Fra app state
      "orgUnitName": `${orgUnitName}`, // Fra app state ID
      "trackedEntityInstance": `${trackedEntityID}`, // Finn tracked entity instance
      "eventDate": "", // format: 2018-11-08T00:00:00.000
      "dueDate": "", // format: 2018-11-08T18:28:24.963
      "storedBy": `${visitorName}`, // i.e. admin, visitor full name
      "dataValues": [ // alle fields og verdier, eksempel:
      {
        "created": "2018-11-08T18:28:24.976",
        "lastUpdated": "2018-11-08T18:28:24.977",
        "value": "10", // endret verdi
        "dataElement": "CXL5mg5l0cv",
        "providedElsewhere": false,
        "storedBy": "admin"
      }
    ],
      "notes": [ // NB Er dette det samme som comments?
      {
        "note": "rHqefMMpJ3u",
        "value": "qwertyuiop",
        "storedBy": "admin",
        "storedDate": "2018-11-08T18:25:29.469"
      },
      {
        "note": "PRu6nBaReN8",
        "value": "lkjshflkdsajhflkdsajfhdsalkfdlkflkdfhsadlkf fhehehehehehehe luke smith",
        "storedBy": "AkselJ",
        "storedDate": "2018-11-08T20:02:17.610"
      }
    ],
      "followup": true,
      "deleted": false,
      "created": "", // format 2018-11-08T13:42:09.330
      "lastUpdated": "", // format 2018-11-08T20:02:17.612"
      "createdAtClient": "", // format 2018-11-08T13:42:09.330
      "lastUpdatedAtClient": "", // format 2018-11-08T20:02:17.612
      "attributeOptionCombo": "", // id, eks HllvX50cXC0
      "attributeCategoryOptions": "" // id eks xYerKDKCefk
    }
    })
      .catch(error => error)
      .then(response => response.json());
  };

    //MARIS gamle knappegreier

    // Status buttons component for DoctorOverview

/*const status = {
  DECLINED: 'Declined',
  PENDING: 'Pending',
  APPROVED: 'Approved',
  ALL: 'All',
};

const StatusButtons = props => {

  const value = props.value;

  return (
    <div className="button-container">
      <button onClick={(e) => props.handleStatusButtonsClick(`${status.DECLINED}`, 'red', e)}>
        Declined
      </button>
      <button onClick={(e) => props.handleStatusButtonsClick(`${status.PENDING}`, 'yellow', e)}>
        Pending
      </button>
      <button onClick={(e) => props.handleStatusButtonsClick(`${status.APPROVED}`, 'green', e)}>
        Approved
      </button>
      <button onClick={(e) => props.handleStatusButtonsClick(`${status.ALL}`, 'blue', e)}>
        All
      </button>

        <BottomNavigation
            value={ value }
            onChange={(e) => props.handleChange(e, value, "Declined", 'blue')}
            showLabels
        >
            <BottomNavigationAction label="Declined" />
            <BottomNavigationAction label="Pending" />
            <BottomNavigationAction label="Approved" />
            <BottomNavigationAction label="All" />
        </BottomNavigation>

    </div>
  );

};

StatusButtons.propTypes = {
  handleChange: PropTypes.func.isRequired
};

export default StatusButtons;
*/
/*
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

/**
 * Contains report results based on status DECLINED, ACCEPTED, PENDING or UNCOMPLETED
 * A list of the doctors filtered events
 */
/*
class ReportResult extends Component {
  render() {
    console.log(this.props.acceptedCurrentDoctorReports.length);

    let status = '';
    let reports = [];

    switch(this.props.status){
      case 'Approved':
        status = 'approved';
        reports = [];
        reports = this.props.acceptedCurrentDoctorReports;
        break;
      case 'Rejected':
        status = 'rejected';
        reports = [];
        reports = this.props.rejectedCurrentDoctorReports;
        break;
      case 'Pending':
        status = 'pending';
        reports = [];
        reports = this.props.pendingCurrentDoctorReports;
        break;
      case 'Uncompleted':
        status = 'uncompleted';
        reports = [];
        reports = this.props.allIncompleteDoctorsReports;
        break;
    }

    if(status === 'uncompleted'){
      return (
        <div>
          <div className={'reportList'}>
            <Divider/>
            <List component="nav">
              {(this.props.allIncompleteDoctorsReports !== undefined) ?
                (this.props.allIncompleteDoctorsReports).map((event) => (
                  <ListItem key={event.event} id={event.event} button onClick={this.props.handleEditReportButtonClick}>
                    <ListItemText primary={event.event + `Due date: ${this.props.prettyPrintDate(event.dueDate)}`} className={'listItems'}/>
                  </ListItem>
                ))
                : <p>No uncompleted reports</p>
              }
            </List>
            <Divider/>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div className={'reportList'}>
            <Divider/>
            <List component="nav">
              {(reports !== undefined) &&
              (reports.length !== 0 ) ?
                (reports).map((event) => (
                  <ListItem key={event.event} button onClick={this.props.handleEditReportButtonClick}>
                    <ListItemText primary={event.event + this.props.prettyPrintDate(event.eventDate)} className={'listItems'}/>
                  </ListItem>
                ))
                : <p>No {status} reports</p>
              }
            </List>
            <Divider/>
          </div>
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

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: '70%',
    backgroundColor: theme.palette.background.paper,
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
    backgroundColor: 'inherit',
    padding: 0,
  },
});

export default withStyles(styles)(ReportResult);*/

