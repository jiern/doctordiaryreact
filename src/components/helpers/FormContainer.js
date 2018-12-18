import React, { Component } from "react";
import Input from "../helpers/Input";
import TextArea from "../helpers/TextArea";
import Select from "../helpers/Select";
import FormButtons from "../helpers/FormButtons";
import PropTypes from "prop-types";
import Api from "../../Api";
import Chip from '@material-ui/core/Chip';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

const optionValues = {
  EQUIPMENT_DRUG_ISSUES: '1',
  USER_PATIENT_ISSUES: '2',
  TECHNICAL_ISSUES: '3',
  HEALTH_WORKER_ISSUES: '4',
  NONE: '5'
};

class FormContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editabilityToggle: false,
      notes: {},
      dataValues: {
        EZstOIjb7wN: '',
        romAEndBlt4: '',
        p5D5Y9x7yMc: '',
        CXL5mg5l0cv: '',
        LoY92GDoDC6: '',
        BIB2zYDYIJp: ''
      },
      challengeOptions: [
        'Equipment/Drug issues',
        'User/Patient issues',
        'Technical issues',
        'Health worker issues',
        'None'
      ],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleOptionsInput = this.handleOptionsInput.bind(this);
  }

  componentDidMount(){
    this.setCompatibleDate(new Date().toString());

    if(this.state.editabilityToggle === true)
      this.setState({editabilityToggle: !this.state.editabilityToggle},
        () => console.log(this.state.editabilityToggle));

    if(this.props.status === 'Approved' || this.props.status === 'Pending'){
      if(this.state.editabilityToggle === false)
        this.setState({editabilityToggle: !this.state.editabilityToggle});
    }

    if(this.props.reportID !== ''){
      this.getReportByID(this.props.reportID);
      if(this.props.status === 'Rejected')
        this.getNotesFromDHOBasedOnReportID(this.props.reportID);
    }
  }

  getReportByID = reportID => {
    Api.getReportByID(reportID)
      .then( data => {
        if(data.dataValues !== undefined){
          console.log(data.dataValues.length);
          {data.dataValues.map(element => {
              let dataElement = '';
              if(element.dataElement === 'romAEndBlt4'){
                 dataElement = this.state.challengeOptions[element.value];
              } else dataElement = element.value;
              this.setState(
                prevState => ({
                  dataValues: {
                    ...prevState.dataValues,
                    [element.dataElement]: dataElement,
                  }
                }),
                () => console.log(this.state.dataValues)
              )
          })}
        }
        if(data.notes !== undefined){
          if(data.notes.length > 0)
            this.setState({notes: data.notes[0]})
        }
      }).catch(error => { console.log(error) });
  };

  /* This lifecycle hook gets executed when the component mounts */
  handleInput(e) {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(
      prevState => ({
        dataValues: {
          ...prevState.dataValues,
          [name]: value
        }
      })
    );
  }

  //Sets option values to numbers based on tracker program
  handleOptionsInput(e){
    let value = e.target.value;
    let name = e.target.name;

    let newValue = '';

    switch(value){
      case 'Equipment/Drug issues': newValue = optionValues.EQUIPMENT_DRUG_ISSUES; break;
      case 'User/Patient issues': newValue = optionValues.USER_PATIENT_ISSUES; break;
      case 'Technical issues': newValue = optionValues.TECHNICAL_ISSUES; break;
      case 'Health worker issues': newValue = optionValues.HEALTH_WORKER_ISSUES; break;
      case 'None': newValue = optionValues.NONE; break;
      default: newValue = '';
    }

    this.setState(
      prevState => ({
        dataValues: {
          ...prevState.dataValues,
          [name]: newValue
        }
      })
    );
  };

  handleClearForm(e) {
    e.preventDefault();
    this.setState({
      dataValues: {
        EZstOIjb7wN: "",
        romAEndBlt4: "",
        p5D5Y9x7yMc: "",
        CXL5mg5l0cv: "",
        LoY92GDoDC6: "",
        BIB2zYDYIJp: ""
      }
    });
  }

  /**
   * Handles submission of report to trackerProgram fro DHO to review
   * @param e Event
   */
  handleSubmit = (e) => {
    if(this.props.reportMode === this.props.reportModes.EDIT_REPORT){
      if(this.props.status === 'Rejected' || this.props.status === 'Uncompleted')
        console.log('TODO: PUT Requests for rejected or uncompleted reports');
        // PUT on eventID for resubmission
        // For each edited field
        // this.sendDataElements(eventID, dataElement, value)
    } else {
      e.preventDefault();
      let doctorsTrackedEntityID = this.props.trackedEntityInstance;
      // TODO: Convert to DHIS2 compatible date
      let currentDate = this.setCompatibleDate(new Date().toString());
      let orgUnitID = this.props.orgUnitID;
      let orgUnitName = this.props.orgUnitName;
      let dataValues = this.setDataValueObjects(this.state.dataValues);
      console.log(dataValues);
      let body = {
        "program": `r6qGL4AmFV4`,
        "programStage": `ZJ9TrNgrtfb`,
        "orgUnit": orgUnitID, // ID Fra app state
        "orgUnitName": orgUnitName, // Fra app state ID
        "trackedEntityInstance": doctorsTrackedEntityID, // Finn tracked entity instance
        "eventDate": currentDate,
        "status": 'COMPLETED',
        "dataValues": dataValues
      };
      console.log(JSON.stringify(body));
      Api.createNewReport(body).then(data => {
        console.log(data);
      }).catch(error => console.log(error));
      this.props.handleBackButtonClick(e);
      //alert('New report created!');
    }

  };

  setDataElements = (eventID, dataElements, value) => {
    //For each data element
      // Get ID and Value
      // buildReportDataElement(eventID, dataElement, value);
  };

  /**
   * Builds body for editing provided dataElement value for given report
   * @param eventID
   * @param dataElement
   * @param value
   */
  buildReportDataElement = (eventID, dataElement, value) => {
    let temp = {
      "dataValues": [
        {
          "dataElement": dataElement,
          "value": value,
        }
      ]
    };
    let body = JSON.stringify(temp);
    this.updateReportDataElement(eventID, dataElement, body);
  };

  /**
   * Converts from GMT+0100 to DHIS compatable date
   * @param date
   * @returns {string}
   */
  setCompatibleDate = date => {
    let year = date.substring(11, 15);
    let  month = date.substring(3,7);
    let monthNum = this.setMonthToNumber(month, year);
    let day = date.substring(8, 10);
    return year + '-' + monthNum + '-' + day;
  };

  setMonthToNumber = (mon, year) => {
    return new Date(Date.parse(mon +" 1, " + year)).getMonth()+1
  };

  /**
   * Sets object with dataValues to array of objects with one dataValue each
   * For posting report to tracker program
   * @param dataValues
   */
  setDataValueObjects = dataValues => {
    console.log(dataValues);
    let arrayOfObjects = [];
    Object.keys(dataValues).map(key => {
      let object = {};
      object['dataElement'] = key;
      object['value'] = dataValues[key];
      arrayOfObjects.push(object);
    });
    return arrayOfObjects;
  };

  render() {
    return (
      <form className="formContainer" onSubmit={this.handleSubmit}>
        {(this.props.reportMode === this.props.reportModes.EDIT_REPORT)
        && (this.props.status !== undefined)
          && <Chip label={'Status: '+ this.props.status} />
        }
        <Input
          inputType={"number"}
          name={"BIB2zYDYIJp"}
          label={"No of Emergency Cesearean Cases provided anaesthesia during day till 5PM"}
          value={this.state.dataValues.BIB2zYDYIJp}
          placeholder={"Enter a number"}
          handleChange={this.handleInput}
          disabled={this.state.editabilityToggle}
        />
        <Input
          inputType={"number"}
          name={"CXL5mg5l0cv"}
          label={"No of Emergency Cesearean Cases provided anaesthesia during night time (5PM - Morning)"}
          value={this.state.dataValues.CXL5mg5l0cv}
          placeholder={"Enter a number"}
          handleChange={this.handleInput}
          disabled={this.state.editabilityToggle}
        />
        <Input
          inputType={"number"}
          name={"EZstOIjb7wN"}
          label={"Anaesthesia provided to other cases "}
          value={this.state.dataValues.EZstOIjb7wN}
          placeholder={"Enter a number"}
          handleChange={this.handleInput}
          disabled={this.state.editabilityToggle}
        />
        <Select
          title={"Challenge"}
          name={"romAEndBlt4"}
          options={this.state.challengeOptions}
          value={this.state.dataValues.romAEndBlt4}
          handleChange={this.handleInput}
          disabled={this.state.editabilityToggle}
        />
        <Input
          inputType={"text"}
          name={"p5D5Y9x7yMc"}
          value={this.state.dataValues.p5D5Y9x7yMc}
          label='Other challenges faced'
          placeholder={"Describe other challenges"}
          handleChange={this.handleInput}
          disabled={this.state.editabilityToggle}
        />
        <TextArea
          value={this.state.dataValues.LoY92GDoDC6}
          name={"LoY92GDoDC6"}
          label='Remarks'
          handleChange={this.handleInput}
          placeholder={"Write a comment to the District Health Officer"}
          disabled={this.state.editabilityToggle}
        />
        <FormButtons
          action={this.handleClearForm}
          type={"clear"}
          title={"Clear"}
          disabled={this.state.editabilityToggle}
        />
        <FormButtons
          action={this.handleSubmit}
          type={'primary'}
          title={'Submit'}
          disabled={this.state.editabilityToggle}
        />
        {(this.props.reportMode === this.props.reportModes.EDIT_REPORT)
        && (this.props.status === 'Rejected')
        &&
        <ExpansionPanel>
          <ExpansionPanelSummary>
            Comments from DHO
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              {(this.state.notes !== undefined)
                ? (this.state.notes.value)
                : <p>What a great report!</p>
              }
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        }
      </form>
    );
  }
}

FormContainer.propTypes= {
  reportID: PropTypes.string,
};

export default FormContainer;