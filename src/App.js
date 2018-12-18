import React, { Component } from 'react';
import './styles/App.css';
import DHOOverview from './components/dho-view/DHOOverview';
import DoctorOverview from './components/doctors-view/DoctorOverview';
import AppHeader from './components/AppHeader';
import Api from './Api';
import "@material-ui/core";

const roles = {
  DOCTOR: 'doctor',
  DHO: 'DHO',
  DOCTOR_ID: 'kNIhGGdyWFp',
  DHO_ID: 'RYOicE8XVw9'
};

const viewTypes = {
  FRONT_PAGE: 'FrontPage',
  REPORT_VIEW: 'ReportView',
  DHO_FRONT_PAGE: 'DHOFrontPage',
  DHO_REPORT_VIEW: 'DHOReportView',
};

const reportModes = {
  NEW_REPORT: 'New report',
  EDIT_REPORT: 'Edit report',
};

const approvalStatus = {
  APPROVED: '1',
  REJECTED: '2',
  PENDING: '3'
};

const dataElements = {
  ACCEPTANCE_STATUS: 'zrZADVnTtMa'
};

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      status: 'Rejected',
      renderReportView: false, // TODO: Use react-router-dom instead of toggling bool values
      renderDHOReportView: false,
      visitorRole: '',
      headerText: '',
      subHeaderText: '',
      headerColor: '',
      visitorUserRoles: '',
      view: '',
      goToFrontPage: false,
      reportMode: '',
      reportRejected: false,
      submitButtonText: 'Submit',
      reportID: '',
      orgUnitName: '',
      visitorOrganisationUnitID: '',
      allCurrentDoctorsReports: [],
      allCompletedDoctorsReports:[],
      allIncompleteDoctorsReports: [],
      acceptedCurrentDoctorReports: [],
      rejectedCurrentDoctorReports: [],
      pendingCurrentDoctorReports: [],
      programStageDataElements: {}, // All elements from program stage
      formDataElementsFromProgramStage: [], // Relevant elements for use in doctors report form
      trackedEntityInstance: '',
    };
  }

  componentDidMount(){
    //this.getVisitorInformation();
    this.loadViewBasedOnVisitor();
  };

  // Handling of API-requests

  /**
   * Checks if logged in user has the user role of DHO or Doctor and loads interface based on this
   */
  loadViewBasedOnVisitor = () => {
    this.getVisitorUserRoles();
    this.getVisitorOrganisationUnitID();
  };

  /**
   * Get information about logged in user, for validation purposes
   */
  getVisitorInformation = () => {
    Api.getVisitorInformation()
      .then(data => { console.log(data)} )
      .catch(error => {
        console.error('Error during getVisitorInformation request:', error);
      })
  };

  /**
   * Gets logged in doctors related organisation unit ID based on associated teiOrganisationUnit
   */
  getVisitorOrganisationUnitID = () => {
    Api.getVisitorOrganisationUnit()
      .then(data => {
        this.setVisitorOrganisationUnitID(data.teiSearchOrganisationUnits[0].id);
      })
      .catch(error => {
        console.error('Error during getVisitorOrganisationUnit request:', error);
      });
  };

  /**
   * Gets all reports made by logged in doctor based on orgUnitID
   * Calls function for dividing into arrays of completed and uncompleted reports
   * Finds logged in users tracked entity instance for future use if not already found
   * @param orgUnitID
   */
  getAllReportsByDoctor = (orgUnitID) => {
    if(this.state.trackedEntityInstance === '' && this.state.visitorRole === roles.DOCTOR)
      this.getVisitorTrackedEntityInstance(orgUnitID);
    if(this.state.orgUnitName === '')
      this.getOrganisationUnitNameBasedOnID(orgUnitID);

    Api.getAllReportsByDoctor(orgUnitID)
      .then(data => {
        this.setState({allCurrentDoctorsReports: data.events},
          () => this.getReportsByCompletionStatus(this.state.allCurrentDoctorsReports));
      })
      .catch(error => {
        console.error('Error during getAllReportsByDoctor request:', error);
      })
  };

  /**
   * Get doctors trackedEntityInstance ID based on logged in doctors organisation unit ID
   * For use in posting report to the doctors associated tracker program
   */
  getVisitorTrackedEntityInstance = (orgUnitID) => {
    Api.getTrackedEntityInstanceByVisitorOrgUnitID(orgUnitID)
      .then( data => {
        this.setTrackedEntityInstance(data.trackedEntityInstances[0].trackedEntityInstance);
      }).catch( error => {
      console.error('Error during getVisitorTrackedEntityInstance request: ', error);
    });
  };

  /**
   * Get organisation unit name based on organisation unit ID,
   * for use in posting doctor report to tracker program
   * @param orgUnitID
   */
  getOrganisationUnitNameBasedOnID = orgUnitID => {
    Api.getOrgUnitNameBasedOnOrgUnitID(orgUnitID)
      .then(data => {
        this.setState({orgUnitName: data.name});
      })
      .catch(error => {
        console.error('Error during getOrganisationUnitNameBasedOnID request:', error);
      })
  };

  /**
   * Checks if input reports are completed or under editing (active) based on report status.
   * If reports are completed, they have been sent to the DHO for approval.
   * If not, they are still under editing.
   * @param reports
   */
  getReportsByCompletionStatus = reports => {
    let arrayWithCompletedReports = [];
    let arrayWithIncompleteReports = [];
    for(let key in reports) {
      if (reports[key].status === 'COMPLETED') {
        if(arrayWithCompletedReports.length > 0){
          for (let key2 in arrayWithCompletedReports) {
            if (key2 !== key) {
              arrayWithCompletedReports.push(reports[key]);
              break;
            } else {
              console.log("Duplicate keys");
            }
          }
        } else arrayWithCompletedReports.push(reports[key]);
      } else {
        // Active report
        if(arrayWithIncompleteReports.length > 0){
          for(let key2 in arrayWithIncompleteReports){
            if(key2 !== key){
              arrayWithIncompleteReports.push(reports[key]);
              break;
            }else {
              console.log("Duplicate keys");
            }
          }
        } else arrayWithIncompleteReports.push(reports[key]);
      }
    }
    this.setState({allIncompleteDoctorsReports: arrayWithIncompleteReports});
    this.setState({allCompletedDoctorsReports: arrayWithCompletedReports},
      () => this.getReportsByApprovedStatus(this.state.allCompletedDoctorsReports));
  };

  /**
   * Checks if completed input reports are accepted, rejected or complete, waiting for approval based on approval dataElement value
   * If reports are accepted, the DHO has accepted the report
   * If reports are rejected, the DHO has rejected the report and it has to be resubmitted for new approval
   * If reports are pending, the report has been sent to the tracker program but has yet to be approved or rejected by DHO
   * @param completedReports
   */
  getReportsByApprovedStatus = completedReports => {
    let arrayWithAcceptedReports = [];
    let arrayWithPendingReports = [];
    let arrayWithRejectedReports = [];

    for(let key in completedReports){
      for(let key2 in completedReports[key].dataValues){
        if(completedReports[key].dataValues[key2].dataElement === dataElements.ACCEPTANCE_STATUS){
          if (completedReports[key].dataValues[key2].value === approvalStatus.APPROVED
            || completedReports[key].dataValues[key2].value === 'Approved')
            arrayWithAcceptedReports.push(completedReports[key]);
          else if (completedReports[key].dataValues[key2].value === approvalStatus.PENDING
            || completedReports[key].dataValues[key2].value === 'Pending')
            arrayWithPendingReports.push(completedReports[key]);
          else if (completedReports[key].dataValues[key2].value === approvalStatus.REJECTED
            || completedReports[key].dataValues[key2].value === 'Reject')
            arrayWithRejectedReports.push(completedReports[key]);
        }
      }
    }

    this.setState({
      acceptedCurrentDoctorReports: arrayWithAcceptedReports,
      pendingCurrentDoctorReports: arrayWithPendingReports,
      rejectedCurrentDoctorReports: arrayWithRejectedReports
    });
  };

  /**
   * Gets all user roles affiliated with logged in user
   */
  getVisitorUserRoles = () => {
    Api.getVisitorUserRoles()
      .then(data => {
        this.setVisitorUserRoles(data.userCredentials.userRoles);
      })
      .catch(error => {
        console.error('Error during getVisitorOrganisationUnit request:', error);
      })
  };

  /**
   * Finds logged in users user roles and sets view based on DHO or Doctor role
   * @param userRoles
   */
  findDHOOrDoctorUserRole = userRoles => {
    for(let i = 0; i < userRoles.length; i++){
      if(userRoles[i].id === roles.DHO_ID){
        console.log("Mounting DHO view");
        this.setVisitorRole(roles.DHO);
        this.setView(viewTypes.DHO_FRONT_PAGE);
        this.setHeaderColor('blue');
        this.setHeaderText('All');
        this.setSubHeaderText('');
      } else if (userRoles[i].id === roles.DOCTOR_ID){
        console.log("Mounting doctor view");
        this.setVisitorRole(roles.DOCTOR);
        this.setView(viewTypes.FRONT_PAGE);
        this.setHeaderColor('red');
        this.setHeaderText('Rejected reports');
        this.setSubHeaderText('');
      }
    }
  };

  // Routing and event handling

  /**
   * Routes to doctor front page for overview of doctor reports
   * @param event
   */
  handleBackButtonClick = event => {
    event.preventDefault();
    this.toggleRenderReportView();
    this.updateFrontPageHeader();
    this.clearReportID();
  };

  /**
   * Routes to doctor report view for submission of new reports
   * @param event
   */
  handleNewReportButtonClick = event => {
    event.preventDefault();
    this.toggleRenderReportView();
    this.updateNewReportHeader();
    this.clearReportID();
  };

  /**
   * Routes to doctor report view for editing existing active report
   * @param event
   */
  handleEditReportButtonClick = event => {
    event.preventDefault();
    let reportID = event.target.id;
    this.setReportID(reportID);
    this.toggleRenderReportView();
    this.updateEditReportHeader();
  };

  setReportID = reportID => {
    this.setState({reportID: reportID})
  };

  clearReportID = () => {
    this.setState({reportID: ''})
  };

  //TODO:  DHO Routing ----------------------------------
  handleNewDHOReportButtonClick = event => {
      event.preventDefault();
      console.log("New DHO report button clicked!");
      this.toggleRenderDHOReportView();
      this.updateNewDHOReportHeader();
  };

  handleDHOBackButtonClick = event => {
      event.preventDefault();
      console.log("DHO back button clicked!");
      this.toggleRenderDHOReportView();
      this.updateDHOFrontPageHeader();
  };

  handleDeleteReportButtonClick = event => {
    //deleteReportByID
  };

  deleteReportByID = () => {};

  // Update header based on view

  updateFrontPageHeader = () => {
    this.setHeaderText(this.state.status + ' reports');
    switch(this.state.status){
      case 'Rejected': this.setHeaderColor('red'); break;
      case 'Pending': this.setHeaderColor('yellow'); break;
      case 'Approved': this.setHeaderColor('green'); break;
      case 'Uncompleted': this.setHeaderColor('blue'); break;
    }
    this.setSubHeaderText('');
    this.setView(viewTypes.FRONT_PAGE);
  };

  updateNewReportHeader = () => {
    this.setHeaderText("New report");
    this.setSubmitButtonText('Submit');
    let currentDate = this.getCurrentDate();
    this.setSubHeaderText(currentDate.slice(0, 15));
    this.setReportMode(reportModes.NEW_REPORT);
    this.setView(viewTypes.REPORT_VIEW);
    this.setHeaderColor('blue');
  };

  updateDHOFrontPageHeader = () => {
      this.setHeaderText('All');
      this.setSubHeaderText('');
      this.setView(viewTypes.DHO_FRONT_PAGE);
  };

// Updating DHO header with the ID? of a single report
  updateNewDHOReportHeader = () => {
      this.setHeaderText("Report: " + "34634"); //Todo: Fetch id of a single report
//    this.setSubmitButtonText('Submit');
//    let currentDate = this.getCurrentDate();
//    this.setSubHeaderText(currentDate);
//    this.setReportMode(reportModes.NEW_REPORT);
      this.setView(viewTypes.DHO_REPORT_VIEW);
      this.setHeaderColor('blue');
  };

  updateEditReportHeader = () => {
    this.setHeaderText('Edit report');
    this.setSubmitButtonText('Resubmit');
    let currentDate = this.getCurrentDate();
    this.setSubHeaderText(currentDate.slice(0, 15));
    this.setReportMode(reportModes.EDIT_REPORT);
    this.setView(viewTypes.REPORT_VIEW);
    this.setHeaderColor('blue');
  };

    updateDHOEditReportHeader = () => {
      this.setHeaderText("Report: " + "54554");
      this.setView(viewTypes.DHO_REPORT_VIEW);
      this.setHeaderColor('blue');
    };

  // State

  /**
   * Sets report filtering status as rejected, pending, approved or uncompleted
   * @param status
   * @param e
   */
  setStatus = (status, e) => {
    e.preventDefault();
    this.setState({status: status});
  };

  setVisitorOrganisationUnitID = orgUnitID => {
    this.setState({visitorOrganisationUnitID: orgUnitID},
      () => this.getAllReportsByDoctor(this.state.visitorOrganisationUnitID));
  };

  setTrackedEntityInstance = (trackedEntityInstanceID) => {
    this.setState({trackedEntityInstance: trackedEntityInstanceID});
  };

  /**
   * Sets all user roles affiliated with logged in user
   * @param userRoles
   */
  setVisitorUserRoles = userRoles => {
    this.setState({visitorUserRoles: userRoles},
      () => this.findDHOOrDoctorUserRole(this.state.visitorUserRoles));
  };

  /**
   * Sets role of DHO or doctor based on found user role
   * @param role
   */
  setVisitorRole = role => {
    this.setState({visitorRole: role})
  };

  setView = view => {
    this.setState({view: view});
  };

  setReportMode = mode => {
    this.setState({reportMode: mode})
  };

  setHeaderText = headerText => {
    this.setState({headerText: headerText})
  };

  setSubHeaderText = subHeaderText => {
    this.setState({subHeaderText: subHeaderText})
  };

  setHeaderColor = headerColor => {
    this.setState({headerColor: headerColor})
  };

  setSubmitButtonText = text => {
    this.setState({submitButtonText: text});
  };

  toggleRenderReportView = () => {
    this.setState({renderReportView: !this.state.renderReportView});
  };

  // When clicking on a row in DHO view
  toggleRenderDHOReportView = () => {
      this.setState({renderDHOReportView: !this.state.renderDHOReportView});
  };

  toggleRejectedStatus = () => {
    this.setState({reportRejected: !this.state.reportRejected})
  };

  // helpers

  /**
   * Prettyprints current date
   * @returns {string}
   */
  getCurrentDate = () => {
    return this.prettyPrintDate(new Date().toString());
  };

  /**
   * Returns date in a more readable format of month, day and year
   * @param date
   * @returns {string}
   */
  prettyPrintDate = (date) => {
    if(date!==undefined){
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
      let temp1 = date.slice(0, 10);
      let time = date.slice(11, 19);
      let temp2 = temp1.replace(/-/g, "/");
      const d = new Date(temp2);
      let year = date.slice(0, 4);
      let day = date.slice(8, 10);
      if(time === '00:00:00') time = '';
      let newDate = monthNames[d.getMonth()] + ' ' + day + ' ' + year + ' ' + time;
      return newDate;
    } else {
      return '';
    }
  };

  render() {
    return (
      <div>
        <div className="App">
          <AppHeader
            headerText={this.state.headerText}
            subHeaderText={this.state.subHeaderText}
            headerColor={this.state.headerColor}
            view={this.state.view}
            viewTypes={viewTypes}
            handleBackButtonClick={this.handleBackButtonClick}
            handleDHOBackButtonClick={this.handleDHOBackButtonClick}
            handleNewReportButtonClick={this.handleNewReportButtonClick}
            handleNewDHOReportButtonClick={this.handleNewDHOReportButtonClick}
          />
          {
            ( this.state.visitorRole === roles.DHO )
            &&
            <div>
              <DHOOverview
                setHeaderText={this.setHeaderText}
                setSubHeaderText={this.setSubHeaderText}
                setHeaderColor={this.setHeaderColor}
                state={this.state}
                setView={this.setView}
                viewTypes={viewTypes}
                renderDHOReportView={this.state.renderDHOReportView}
                handleDHOEditReportButtonClick={this.handleDHOEditReportButtonClick}
                setReportID = {this.setReportID}
                toggleRenderDHOReportView = {this.toggleRenderDHOReportView}
                updateDHOEditReportHeader = {this.updateDHOEditReportHeader}
                prettyPrintDate = {this.prettyPrintDate}
              />
            </div>
          }
          {
            ( this.state.visitorRole === roles.DOCTOR )
            &&
            <div>
              <DoctorOverview
                status={this.state.status}
                setStatus={this.setStatus}
                setHeaderText={this.setHeaderText}
                setSubHeaderText={this.setSubHeaderText}
                setHeaderColor={this.setHeaderColor}
                setView={this.setView}
                viewTypes={viewTypes}
                reportModes={reportModes}
                handleBackButtonClick={this.handleBackButtonClick}
                reportMode={this.state.reportMode}
                reportRejected={this.state.reportRejected}
                renderReportView={this.state.renderReportView}
                getCurrentDate={this.getCurrentDate}
                prettyPrintDate={this.prettyPrintDate}
                setSubmitButtonText={this.setSubmitButtonText}
                updateNewReportHeader={this.updateNewReportHeader}
                updateEditReportHeader={this.updateEditReportHeader}
                handleEditReportButtonClick={this.handleEditReportButtonClick}
                reportID={this.state.reportID}
                orgUnitName={this.state.orgUnitName}
                trackedEntityInstance={this.state.trackedEntityInstance}
                visitorOrganisationUnitID={this.state.visitorOrganisationUnitID}
                allCurrentDoctorsReports={this.state.allCurrentDoctorsReports}
                allCompletedDoctorsReports={this.state.allCompletedDoctorsReports}
                allIncompleteDoctorsReports={this.state.allIncompleteDoctorsReports}
                acceptedCurrentDoctorReports={this.state.acceptedCurrentDoctorReports}
                rejectedCurrentDoctorReports={this.state.rejectedCurrentDoctorReports}
                pendingCurrentDoctorReports={this.state.pendingCurrentDoctorReports}
              />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default App;
