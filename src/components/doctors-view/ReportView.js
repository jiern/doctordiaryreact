import React, {Component} from 'react';
import PropTypes from "prop-types";
import Api from "./../../Api";
import FormContainer from "../helpers/FormContainer";

const options = {
    STATUS_OPTION_SET_ID: 'MfRa7PD2tkj',
    CHALLENGES_FACED_OPTION_SET_ID: 'KuFLEh0XiJk',
    ACCEPTED_ID: 'XupdTFYoiHU',
    REJECTED_ID: 'fmCqCB4XRnH',
    PENDING_ID: 's4ppesUuVUj',
};

/**
* A doctor report form, in create or edit mode by doctor
* Form for filling in new report or editing existing
*/
class ReportView extends Component{

  constructor(props){
    super(props);
    this.state = {
      programStageDataElements: {}, // object with all elements related to program stage
      formDataElementsFromProgramStage: [], // array with relevant form elements
      formDataElementIDsFromProgramStage: [], // array with relevant form element IDs
      reportStatusOptionSet: [], // accepted, rejected and completed, waiting for approving
      challengesFacedOptionSet: [],
      reportStatusOptionSetNames: [],
      challengesFacedOptionSetNames: [],
      currentReportStatus: '',
      trackedEntityInstance: '',
      submitButtonTitle: '',
      newForm: {
        EmergencyCasesNight: '',
        EmergencyCasesDay: '',
        OtherCases: '',
        ChallengesFaced: '',
        ChallengesFacedOther: '',
        RemarksOfChallenges: '',
        Status: ''
      }
    };
  }

  componentDidMount(){
    this.getAllDataElementsFromProgramStage();
    this.getStatusOptionSetOptionsByID(options.STATUS_OPTION_SET_ID);
    this.getChallengesFacedOptionSetOptionsByID(options.CHALLENGES_FACED_OPTION_SET_ID);
    this.props.setView(this.props.viewTypes.REPORT_VIEW);
    if(this.props.reportMode === this.props.reportModes.NEW_REPORT){
      // New report mode, update headers and info
      this.props.updateNewReportHeader();
      this.setSubmitButtonTitle("Submit");
    } else if (this.props.reportMode === this.props.reportModes.EDIT_REPORT){
      // Edit report mode, update headers and info
      this.props.updateEditReportHeader();
      if(this.props.status === 'Approved' || this.props.status === 'Pending'){
        this.props.setHeaderText('View Report');
      } else this.setSubmitButtonTitle("Resubmit");
    }
  };

  // Handling of API-requests

  /**
   * Gets all options for 'challenges faced' dataElement in program stage
   * @param optionSetID
   */
  getChallengesFacedOptionSetOptionsByID = optionSetID => {
    Api.getOptionSetOptionsByOptionSetID(optionSetID)
      .then(data => {
        this.setState({challengesFacedOptionSet: data.options},
          () => this.setChallengesFacedOptionSet(this.state.challengesFacedOptionSet));
      })
      .catch(error => {
        console.error('Error during getChallengesFacedOptionSetOptionsByID request:', error);
      })
  };

  /**
   * Gets accepted/rejected/pending status options from program stage
   * @param optionSetID
   */
  getStatusOptionSetOptionsByID = optionSetID => {
    Api.getOptionSetOptionsByOptionSetID(optionSetID)
      .then(data => {
        this.setState({reportStatusOptionSet: data.options},
          () => this.setReportStatusOptionSet(this.state.reportStatusOptionSet));
      })
      .catch(error => {
        console.error('Error during getStatusOptionSetOptionsByID request:', error);
      })
  };

  /**
   * Sets accepted/rejected/pending status options from program stage
   * @param reportStatusOptionSet
   */
  setReportStatusOptionSet = reportStatusOptionSet => {
    let objectWithDataElements  = reportStatusOptionSet;
    let arrayWithDataElements = [];
    for(let key in objectWithDataElements) {
      Api.getOptionById(objectWithDataElements[key].id)
        .then(data => {
          arrayWithDataElements.push(data.displayName);
          this.setState({reportStatusOptionSetNames: arrayWithDataElements});
        }).catch(error => error);
    }
  };

  /**
   * Sets all options for 'challenges faced' dataElement in program stage
   * @param challengesFacedOptionSet
   */
  setChallengesFacedOptionSet = challengesFacedOptionSet => {
    let objectWithDataElements  = challengesFacedOptionSet;
    let arrayWithDataElements = [];
    for(let key in objectWithDataElements) {
      Api.getOptionById(objectWithDataElements[key].id)
        .then(data => {
          arrayWithDataElements.push(data.displayName);
          this.setState({challengesFacedOptionSet: arrayWithDataElements});
        }).catch(error => error);
    }
  };

  /**
   * Get all data elements from tracker programs stage
   * For use in populating the form information
   */
  getAllDataElementsFromProgramStage = () => {
    Api.getAllDataElementsFromProgramStage(this.props.visitorOrganisationUnitID)
      .then(data => {
        this.setState({programStageDataElements: data.headers},
          () => this.setFormDataElementsFromProgramStage());
      })
      .catch(error => {
        console.error('Error during getAllDataElementsFromProgramStag request:', error);
      })
  };

  /**
   * Updates an edited report with provided dataElement value
   * @param eventID
   * @param dataElement
   * @param body
   */
  updateReportDataElement = (eventID, dataElement, body) => {
    Api.updateReportDataElement(eventID, dataElement, body)
      .then( data => {
        console.log('Successfully updated dataElement with response: ' + data);
      })
      .catch(error => {
        console.error('Error during updateReportDataElement: ', error);
      })
  };

  /**
   * Gets elements from index 17-23 in program stage data element response.
   * Derives the dataElement names and IDs for further use in doctors form.
   */
  setFormDataElementsFromProgramStage = () => {
    let objectWithDataElements = this.state.programStageDataElements.slice(17, 23);
    let arrayWithDataElements = [];
    let dataElementIDs = [];
    for(let key in objectWithDataElements) {
      arrayWithDataElements.push(objectWithDataElements[key].column);
      dataElementIDs.push(objectWithDataElements[key].name)
    }
    this.setState({formDataElementsFromProgramStage: arrayWithDataElements});
    this.setState({formDataElementIDsFromProgramStage: dataElementIDs});
  };

  setSubmitButtonTitle = mode => {
    this.setState({submitButtonText: mode})
  };

  // Event handling

  // Send post/put request
  handleCancelButtonClick = () => {
    //If not empty values in form
    //DialogBox: Do you want to save the report?
    //If yes:
    //this.saveReportDraft();
    //handleBackButtonClick();
  };

  // If cancelled reporting, but wanting to save changes
  saveReportDraft = () => {
    //Check if event exists
    //If yes, PUT request
    //If no, POST request
  };

  render(){
    return(
      <div>
        {this.props.reportRejected &&
          <p>TODO: Display DHO comment box here!</p>
        }
        { this.props.startPageMounted &&
          <FormContainer
            dataElements={this.state.formDataElementIDsFromProgramStage}
            trackedEntityInstance={this.props.trackedEntityInstance}
            handleBackButtonClick={this.props.handleBackButtonClick}
            orgUnitID={this.props.visitorOrganisationUnitID}
            orgUnitName={this.props.orgUnitName}
            handleSubmit={this.handleSubmit}
            reportID={this.props.reportID}
            status={this.props.status}
            submitButtonTitle={this.state.submitButtonTitle}
            reportMode={this.props.reportMode}
            reportModes={this.props.reportModes}
          />
        }
      </div>
    );
  }

}

export default ReportView;

ReportView.propTypes = {
  setHeaderText: PropTypes.func,
  setSubHeaderText: PropTypes.func,
  setHeaderColor: PropTypes.func,
  visitorOrganisationUnitID: PropTypes.string.isRequired,
  prettyPrintDate: PropTypes.func,
  reportModes: PropTypes.object,
  reportMode: PropTypes.string,
  reportRejected: PropTypes.bool,
  orgUnitName: PropTypes.string,
  reportID: PropTypes.string,
};