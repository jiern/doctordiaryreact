const dhis2TrackerProgram = {
  ProgramID: 'r6qGL4AmFV4',
  ProgramStageID: 'ZJ9TrNgrtfb'
};

const organisationUnita = {
  Bramaia: 'kbPmt60yi0L'
};

const dhis2 = {
  developmentBaseUrl: 'https://course.dhis2.org/dhis/api',
  productionBaseUrl: '../..',
  server: 'https://course.dhis2.org/dhis',
};

const devOrProdEnvironment = {
  environment: dhis2.productionBaseUrl,
};

//credentials: "include",
const headers = new Headers({
  Accept: 'application/json',
  Authorization: `Basic ${btoa('MatsW:District1-')}`
  // DHO = BjarneB  Doctors = AkselJ, CasperL, PatrikM, MatsW, YahyaJ, EllingS
});

class Api {

  // Visitor information

  getVisitorInformation = () => {
    return fetch(`${devOrProdEnvironment.environment}/me`, {
      method: 'GET',
      headers,
    })
      .catch(error => error)
      .then(response => response.json());
  };

  getVisitorUserRoles = () => {
    return fetch(`${devOrProdEnvironment.environment}/me?fields=userCredentials[userRoles]`, {
      method: 'GET',
      headers,
    })
      .catch(error => error)
      .then(response => response.json());
  };

  getVisitorOrganisationUnit = () => {
    return fetch(`${devOrProdEnvironment.environment}/me?fields=teiSearchOrganisationUnits`, {
      method: 'GET',
      headers,
    })
      .catch(error => error)
      .then(response => response.json());
  };

  getOrgUnitNameBasedOnOrgUnitID = orgUnitID => {
    return fetch(`${devOrProdEnvironment.environment}/organisationUnits/${orgUnitID}`, {
      method: 'GET',
      headers,
    })
      .catch(error => error)
      .then(response => response.json());
  };

  // Events/Reports

  getTrackedEntityInstanceByVisitorOrgUnitID = (orgUnitID) => {
    return fetch(`${devOrProdEnvironment.environment}/trackedEntityInstances.json?ou=${orgUnitID}&program=${dhis2TrackerProgram.ProgramID}`, {
      method: 'GET',
      headers,
    })
      .catch(error => error)
      .then(response => response.json());
  };

  createNewReport = (body) => {
    //credentials: "include",
    /*
    Dev headers and URL, removed for deployment (variables did not work in post)
    POST works in dev.
    return fetch(`https://course.dhis2.org/dhis/api/events/`, {
    headers: {
      'Content-type': 'application/json',
      Authorization: `Basic ${btoa('AkselJ:District1-')}`
    },
    */
    return fetch(`../../events/`, {
      method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Basic ${btoa('MatsW:District1-')}`
        },
      body: JSON.stringify(body)
    }).catch(error => error)
      .then(response => response.json());
  };

  updateReportDataElement = (eventID, dataElementID, body) => {
    return fetch(`${devOrProdEnvironment.environment}/events/${eventID}/${dataElementID}`, {
      method: 'PUT',
      headers,
      'Content-type': 'application/json',
      body: body
    })
  };

  getAllDistrictReports = () => {
    return fetch(`${devOrProdEnvironment.environment}/events?program=${dhis2TrackerProgram.ProgramID}`, {
    method: 'GET',
    headers,
  })
    .catch(error => error)
    .then(response => response.json());
  };

  getChiefdom = () => {
    return fetch(`${devOrProdEnvironment.environment}/organisationUnits/${organisationUnita.Bramaia}?fields=name`, {
      method: 'GET',
      headers,
    })
      .catch(error => error)
      .then(response => response.json());
  };


  // Events

  getReportByID = eventID => {
    return fetch(`${devOrProdEnvironment.environment}/events/${eventID}`, {
      method: 'GET',
      headers,
    })
      .catch(error => error)
      .then(response => response.json());
  };

  getSpecificDoctorsReport = (eventID, orgUnitID) => {
    return fetch(`${devOrProdEnvironment.environment}/events/${eventID}?program=${dhis2TrackerProgram.ProgramID}?orgUnit=${orgUnitID}`, {
      method: 'GET',
      headers,
    })
      .catch(error => error)
      .then(response => response.json());
  };

  getOptionSetOptionsByOptionSetID = optionSetID => {
    return fetch(`${devOrProdEnvironment.environment}/optionSets/${optionSetID}?fields=options`, {
      method: 'GET',
      headers,
    })
      .catch(error => error)
      .then(response => response.json());
  };

  // When rendering a specific doctors reports in DHO view
  getAllReportsByDoctor = orgUnitID => {
    return fetch(`${devOrProdEnvironment.environment}/events?program=${dhis2TrackerProgram.ProgramID}&orgUnit=${orgUnitID}&order=eventDate:DESC&paging=false`, {
      method: 'GET',
      headers, //NB! Only DHO can view
    })
      .catch(error => error)
      .then(response => response.json());
  };

  getAllDataElementsFromProgramStage = orgUnitID => { //
    return fetch(`${devOrProdEnvironment.environment}/events/query.json?orgUnit=${orgUnitID}&programStage=${dhis2TrackerProgram.ProgramStageID}&includeAllDataElements=true`, {
      method: 'GET',
      headers,
    })
      .catch(error => error)
      .then(response => response.json());
  };

  getOptionById = optionID => {
    return fetch(`${devOrProdEnvironment.environment}/options/${optionID}`, {
      method: 'GET',
      headers,
    })
      .catch(error => error)
      .then(response => response.json());
  };

  /*
  1 = Accepted/Approved
  2 = Rejected
  3 = Completed, waiting for approving (pending)
  */
  getOptionsSortOrderNumberById = optionID => {
    return fetch(`${devOrProdEnvironment.environment}/options/${optionID}?fields=sortOrder`, {
      method: 'GET',
      headers,
    })
      .catch(error => error)
      .then(response => response.json());
  };

  deleteReportByID = id => {
    return fetch(`${devOrProdEnvironment.environment}/events/${id}`, {
      method: 'DELETE',
      headers,
    })
      .catch(error => error)
      .then(response => response.json());
  };

  // Basic get functions

  getIcon = iconKey => {
    return fetch(`${devOrProdEnvironment.environment}/icons/${iconKey}.svg`, {
      method: 'GET',
      headers,
    })
      .catch(error => error) // if no success, return error
      .then(response => response.json()); // if success, parse response as .json and return
  };

  getDataElement = id => {
    return fetch(`${devOrProdEnvironment.environment}/dataElements/${id}`, {
      method: 'GET',
      headers,
    })
      .catch(error => error)
      .then(response => response.json());
  };

}

export default new Api();