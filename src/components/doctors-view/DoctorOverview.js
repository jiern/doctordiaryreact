import React, {Component} from 'react';
import PropTypes from "prop-types";
import ReportResult from "../doctors-view/ReportResult";
import StatusButtons from "./../helpers/StatusButtons";
import ReportView from "./ReportView";
//import {ROUTES} from "../helpers/Routes";
//import {Route} from "react-router-dom";

/**
* Front page for doctor, listing all of his/her current reports based on filters
* */
class DoctorOverview extends Component{
  constructor(props){
    super(props);
    this.state = {
      pending: false,
      color: '',
      startPageMounted: false,
    };
  }

  componentDidMount(){
    this.props.setView(this.props.viewTypes.FRONT_PAGE);
    this.setState({startPageMounted: true});
    this.setHeader('Rejected', 'red')
  }

  // Event handling

  /**
   * Handles menu options for filtering reports based on approval status
   * @param status Rejected, Pending, Approved or Uncompleted
   * @param color Associated header color
   * @param e Event
   */
  handleStatusButtonsClick = (status, color, e) => {
    this.props.setStatus(status, e);
    this.props.setHeaderText(status + ' reports');
    this.props.setHeaderColor(color);
  };

  setHeader = (status, color) => {
    this.props.setHeaderText(status);
    this.props.setHeaderColor(color);
  };

  render(){
    return(
      <div>
        { this.props.renderReportView && this.state.startPageMounted ?
            <ReportView
              status={this.props.status}
              setView={this.props.setView}
              reportID={this.props.reportID}
              viewTypes={this.props.viewTypes}
              reportMode={this.props.reportMode}
              orgUnitName={this.props.orgUnitName}
              reportModes={this.props.reportModes}
              setHeaderText={this.props.setHeaderText}
              reportRejected={this.props.reportRejected}
              getCurrentDate={this.props.getCurrentDate}
              prettyPrintDate={this.props.prettyPrintDate}
              setSubHeaderText={this.props.setSubHeaderText}
              startPageMounted={this.state.startPageMounted}
              setSubmitButtonText={this.props.setSubmitButtonText}
              trackedEntityInstance={this.props.trackedEntityInstance}
              updateNewReportHeader={this.props.updateNewReportHeader}
              handleBackButtonClick={this.props.handleBackButtonClick}
              updateEditReportHeader={this.props.updateEditReportHeader}
              visitorOrganisationUnitID = {this.props.visitorOrganisationUnitID}
            />
          :
          <div>
            <div className="scrollable-reports-container">
              <ReportResult
              status={this.props.status}
              prettyPrintDate={this.props.prettyPrintDate}
              rejectedCurrentDoctorReports={this.props.rejectedCurrentDoctorReports}
              pendingCurrentDoctorReports={this.props.pendingCurrentDoctorReports}
              acceptedCurrentDoctorReports={this.props.acceptedCurrentDoctorReports}
              allIncompleteDoctorsReports={this.props.allIncompleteDoctorsReports}
              handleEditReportButtonClick={this.props.handleEditReportButtonClick}
              />
            </div>
          <StatusButtons
          handleClick = {this.handleStatusButtonsClick}
          rejectedReports = {this.props.rejectedCurrentDoctorReports}
          />
          </div>
        }
      </div>
    );
  }

}

export default DoctorOverview;

DoctorOverview.propTypes = {
  setHeaderText: PropTypes.func,
  setSubHeaderText: PropTypes.func,
  setHeaderColor: PropTypes.func,
  setView: PropTypes.func,
  viewTypes: PropTypes.object,
  reportModes: PropTypes.object,
  reportMode: PropTypes.string,
  reportRejected: PropTypes.bool,
  reportID: PropTypes.string,
};