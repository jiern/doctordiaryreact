import React, {Component} from 'react';
import PropTypes from "prop-types";
import DHOtabell from './DHOtabell';
import ReportApprovalView from './ReportApprovalView';
import Api from "./../../Api";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const status = {
    DECLINED: 'DHO Declined',
    PENDING: 'DHO Pending',
    APPROVED: 'DHO Approved',
    ALL: 'All'
};

const approvalStatus = {
    APPROVED: '1',
    REJECTED: '2',
    PENDING: '3'
  };

class DHOOverview extends Component{
 
    constructor(){
        super();
        this.state = {
            status: '',
            color: '',
            allCurrentDoctorsReports: [],
            pending: [],
            rejected: [],
            accepted: [],
            startPageMounted: false,
            statusValue: 3,
            allCompleted: ''
        };
    }

    componentDidMount(){
        console.log("Mounted, for DHO");
        this.getAllDistrictReports();
        this.setState({startPageMounted: true});
        this.props.setView(this.props.viewTypes.DHO_FRONT_PAGE);
      }

    setStatus = (status, e) => {
        e.preventDefault();
        this.setState({status: status})
    };

    setStatusValue(value){
        this.setState({statusValue: value});
    }

    handleClick = (status, color, e, value) => {
        this.setStatus(status, e);
        this.setStatusValue(value);
        this.props.setHeaderText(status);
        this.props.setHeaderColor(color);
    };

    getAllDistrictReports = () => {
        Api.getAllDistrictReports()
          .then(data => { 
            this.setAllDistrictReports(data.events);
                
          })
          .catch(error => {
            console.error('Error during getVisitorOrganisationUnit request:', error);
          })
      };
          
    setAllDistrictReports = (events) => {
            this.setState({allCurrentDoctorsReports: events});
            this.getReportsBasedComplete(this.state.allCurrentDoctorsReports);
        };

    getReportsBasedComplete = (reports) => {
        let arrayWithCompletedReports = [];
        
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
        }
        }
    this.setState({allCompleted: arrayWithCompletedReports},
    () => this.getFilterReports(this.state.allCompleted));
}

getFilterReports = (completed) => {
    let arrayWithAcceptedReports = [];
    let arrayWithPendingReports = [];
    let arrayWithRejectedReports = [];

    for(let key in completed){
      for(let key2 in completed[key].dataValues){
          if (completed[key].dataValues[key2].value === approvalStatus.APPROVED)
            arrayWithAcceptedReports.push(completed[key]);
          else if (completed[key].dataValues[key2].value === approvalStatus.PENDING)
            arrayWithPendingReports.push(completed[key]);
          else
            arrayWithRejectedReports.push(completed[key]);

      }
    }

    this.setState({
      accepted: arrayWithAcceptedReports,
      pending: arrayWithPendingReports,
      rejected: arrayWithRejectedReports
    });
}

    returnEventInfo = () =>{

        if(this.state.statusValue === 1){
            return this.state.rejected.map((data,index) => {
                return(
                    <TableRow key={index}  onClick={this.handleDHOEditReportButtonClick} hover style={{cursor: 'pointer'}}>
                            <TableCell component="th" scope="row" id={data.event}>
                        <div  id={data.event}>{index}</div></TableCell>
                    <TableCell id={data.event}>
                        <div   id={data.event}>{data.storedBy}</div></TableCell>
                    <TableCell   id={data.event}>
                        <div  id={data.event}>{this.props.prettyPrintDate(data.dueDate)}</div></TableCell>
                    <TableCell  id={data.event}>
                        <div  id={data.event}>{data.orgUnitName}</div></TableCell>
                    </TableRow>)
        })
        }else if(this.state.statusValue === 0){
            return this.state.pending.map((data,index) => {
                return(
                    <TableRow key={index}  onClick={this.handleDHOEditReportButtonClick} hover style={{cursor: 'pointer'}}>
                        <TableCell component="th" scope="row" id={data.event}>
                        <div  id={data.event}>{index}</div></TableCell>
                    <TableCell id={data.event}>
                        <div   id={data.event}>{data.storedBy}</div></TableCell>
                    <TableCell   id={data.event}>
                        <div  id={data.event}>{this.props.prettyPrintDate(data.dueDate)}</div></TableCell>
                    <TableCell  id={data.event}>
                        <div  id={data.event}>{data.orgUnitName}</div></TableCell>
                    </TableRow>)
        })
        }else if(this.state.statusValue === 2){
            return this.state.accepted.map((data,index) => {
            return(
                <TableRow key={index}  onClick={this.handleDHOEditReportButtonClick} hover style={{cursor: 'pointer'}}>
                    <TableCell component="th" scope="row" id={data.event}>
                        <div  id={data.event}>{index}</div></TableCell>
                    <TableCell id={data.event}>
                        <div   id={data.event}>{data.storedBy}</div></TableCell>
                    <TableCell   id={data.event}>
                        <div  id={data.event}>{this.props.prettyPrintDate(data.dueDate)}</div></TableCell>
                    <TableCell  id={data.event}>
                        <div  id={data.event}>{data.orgUnitName}</div></TableCell>
                </TableRow>)
        })

        }else if(this.state.statusValue === 3){
            return this.state.allCurrentDoctorsReports.map((data,index) => {

                return(
                    <TableRow key={index} id = {data.event} onClick={this.handleDHOEditReportButtonClick} hover style={{cursor: 'pointer'}}>
                    <TableCell component="th" scope="row" id={data.event}>
                        <div  id={data.event}>{index}</div></TableCell>
                    <TableCell id={data.event}>
                        <div   id={data.event}>{data.storedBy}</div></TableCell>
                    <TableCell   id={data.event}>
                        <div  id={data.event}>{this.props.prettyPrintDate(data.dueDate)}</div></TableCell>
                    <TableCell  id={data.event}>
                        <div  id={data.event}>{data.orgUnitName}</div></TableCell>
          </TableRow>)
        })
    }
    }

    handleDHOEditReportButtonClick = event => {
        event.preventDefault();
        console.log("Event ID: ", event.target.id);
        let reportID = event.target.id;
        this.props.setReportID(reportID);
        this.props.toggleRenderDHOReportView();
        this.props.updateDHOEditReportHeader();
    };
    
    render(){
        return(
            <div>
            {this.props.renderDHOReportView && this.state.startPageMounted ?
                <ReportApprovalView
                    setView={this.props.setView}
                    viewTypes={this.props.viewTypes}
                    setHeaderText={this.props.setHeaderText}
                    setSubmitButtonText={this.props.setSubmitButtonText}
                    updateNewDHOReportHeader={this.props.updateNewDHOReportHeader}
                />
                :
                <div>
                    <div className="scrollable-reports-container">
                    </div>
                    <div className="button-container">
                        <button className={'yellowButton'} onClick={(e) => this.handleClick(`${status.PENDING}`, 'yellow', e, 0)}>
                            PENDING
                        </button>
                        <button  className={'redButton'} onClick={(e) => this.handleClick(`${status.DECLINED}`, 'red', e, 1)}>
                            DECLINED
                        </button>
                        <button  className={'greenButton'} onClick={(e) => this.handleClick(`${status.APPROVED}`, 'green', e, 2)}>
                            APPROVED
                        </button>
                        <button className={'blueButton'} onClick={(e) => this.handleClick(`${status.ALL}`, 'blue', e, 3)}>
                            ALL
                        </button>
                    </div>
                    <DHOtabell
                        allCurrentDoctorsReports={this.state.allCurrentDoctorsReports}
                        returnEventInfo={this.returnEventInfo}
                    />
                </div>
            }
         </div>
        );
    }
}

export default DHOOverview;

DHOOverview.propTypes = {
  setHeaderText: PropTypes.func,
  setSubHeaderText: PropTypes.func,
  setHeaderColor: PropTypes.func,
};