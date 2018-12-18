import React, {Component} from 'react';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import BackIcon from '@material-ui/icons/ArrowBackIos'
//import { Link } from 'react-router-dom';
//import { ROUTES } from './helpers/Routes';

class AppHeader extends Component{

  render() {
    //TODO: Fix flex-row class in App.css
    let className = 'App-header flex-row';
    let backBtn = '';
    let newBtn = '';
    let DHObackBtn = '';
    let DHOnewBtn = '';

    // checks what report acceptance status user is currently watching and changes header color and text accordingly
    switch(this.props.headerColor){
      case 'blue':
        className += ' blue_background'; break;
      case 'red':
        className += ' red_background'; break;
      case 'green':
        className += ' green_background'; break;
      case 'yellow':
        className += ' yellow_background'; break;
      default:
        className += ' blue_background'; break;
    }

    if(this.props.view === this.props.viewTypes.FRONT_PAGE){
      newBtn = 'new-button';
    } else if (this.props.view === this.props.viewTypes.REPORT_VIEW){
      backBtn = 'back-button';
    } else if (this.props.view === this.props.viewTypes.DHO_REPORT_VIEW){
      DHObackBtn = 'back-button';
    } else if (this.props.view === this.props.viewTypes.DHO_FRONT_PAGE) {
      DHOnewBtn = 'new-button';
    }

    /*
    * TODO: ROUTING: <Link to={ROUTES_DOCTOR_REPORT_VIEW}</Link> etc.
    */
    return (
      <header className={className}>
        <div className={'HeaderContainer'}>
          <div className={'elementOne'}>
            {
              backBtn !== '' &&
                <div className={'centerElements'}>
                  <Button onClick={this.props.handleBackButtonClick} className={'centerElements'} id={'btnWhite'}>
                    <BackIcon />
                    Back
                  </Button>
                </div>
            }
            {
                DHObackBtn !== '' &&
                <div className={'centerElements'}>
                    <Button onClick={this.props.handleDHOBackButtonClick} className={'centerElements'} id={'btnWhite'}>
                        <BackIcon />
                        Back to DHO view
                    </Button>
                </div>
            }
          </div>
          <div className={'header'}>
            {
              this.props.headerText !== '' &&
              <p className={'headerText'}>{this.props.headerText}</p>
            }
            {
              this.props.subHeaderText !== '' &&
              <p className={'subHeaderText'}>{this.props.subHeaderText}</p>
            }
          </div>
          <div className={'elementTwo'}>
            {
              newBtn !== '' &&
                <div className={'centerElements'}>
                  <Button className={'newBtn'} variant="extendedFab" onClick={this.props.handleNewReportButtonClick}>
                    <AddIcon />
                    New report
                  </Button>
                </div>
            }
          </div>
        </div>
      </header>
    );
  }

}

export default AppHeader;

AppHeader.propTypes = {
  setView: PropTypes.func,
  view: PropTypes.string,
  headerText: PropTypes.string,
  subHeaderText: PropTypes.string,
  headerColor: PropTypes.string,
  handleNewReportButtonClick: PropTypes.func,
  handleBackButtonClick: PropTypes.func,
};