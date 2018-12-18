IN5320 - Group 17 - Case 1: Doctors diary / Doctor reports

Assumptions
-----------
1. OrganisationUnit === Doctor
Assumes one organisation unit represents one doctor, 
which is stated as OK in piazza and necessary due to the API layout.
Uses TeiOrganisationUnit as they display the right facility associated with doctor.

2. setFormDataElementsFromProgramStage function
Slices data elements form program stage with hard coded numbers 17-23.
Not optimal solution, but could not find way to differentiate elements with the data provided in the API.
Assumes the index of the elements will stay the same, and relatively easy to change if that is not the case.

3. Comments are only necessary to provide to rejected reports

4. Hard coded IDs
Some places in the code there are hardcoded IDs.
This is because we could not find a way to retrieve the IDs from other places, and see that other groups has done the same.
We assume this is OK and that they will not change much.
We have gotten most data dynamically, and the hard coded data is put in const elements for easy editing if the IDs would change.

Functionality
-------------
Our application is split into two interfaces:
 1. Doctor overview for
        A. looking at his/her own reports and the status of them
        B. Sending reports to the tracker program for DHO to approve
 2. DHO Overview for
        A. Looking at affiliated districts doctor reports
        B. Approving/Rejecting reports from the Doctor Program and commenting on them

We organized our project into two groups based on the two interfaces,
as to provide productivity and avoid potential unnecessary merge conflicts.

Adrian and Mari: Doctor Overview
Tidemann and Rambi: DHO Overview

We helped each other out during the project, so some work overlaps.
We constructed our App.js so that we could reuse each others smaller components and functions.

Missing functionality/implementation
------------------------------------
We have used a lot of time on setting up a modular structure for easier collaboration,
as well as making readable code for easy maintenance and navigation, 
and thus underestimated the time used for the implementation of some functionality.
We do hope that our existing functionality is of quality and prone to easy management,
with many smaller functions and components for re-use.
Also, everyone in our group unfortunately have little to no experience in React and frontend in general,
and have used a lot of time trying to understand the language, Material UI as well as the API.

DOCTOR VIEW:

1. LocalStorage:
Local storage was in our requirement specification, but unfortunately, we did not get the time to implement it.
This is a problem regarding the doctors unstable internet connection, that we acknowledge should have been implemented, 
and would have been if we had gotten the time.

2. PUT in events
Have made pseudocode for putting elements into an existing report
Did not get the time to implement this fully

DHO VIEW:

1. Commenting and chat-functionality:
The DHO should be able to comment on an event and end it back to the tracker program for the doctor to view, if rejected.
We initially wanted a chat function for communication to and fro', but did not have time to implement this.
The doctor gets the first comment saved to the tracker in rejected reports in an expansion box,
would have implemented this as a chat function / showed all notes attached if time.

2. PUT for events:
DHO should send the event status and be able to comment on it,
did not have the time to implement this.

3. Populating the report view:
DHO should click on a report on the main view and the right information should be shown in the report view.
We implemented every object and most of the API-calls that we needed, but didnt have time for the population of the text fields via the API and event-ID. 

Things that does not work optimally
-----------------------------------

GENERAL:

1. Routing:
We have used toggling boolean values in order to route between the interfaces in the Doctor and DHO view.
We did try to implement routing through react-router-dom, but we think that some history blocking is a reason for
our components not rendering using <Link>, and we did not get enough time to look further into that.

DOCTOR VIEW: 

1. Responsive design:
The doctor should be able to use his mobile phone for this app,
but we did not get to implement all in a way that provides enough usability for this to be fully implemented.

2. Report date:
One could argue that you should be able to make a report for a date other than the current date.
We have not implemented this due to the time.

DHO VIEW: 

1. Filter:
The filterization of declined/pending/approved does not work quite right. 
Some problems with the final filter algorithm. 



Sources
-------
API-request inspiration from lecturer K. Svalestuen
https://github.com/kjesvale/dhis2-sample-app

setMonthToNumber() from
https://stackoverflow.com/questions/13566552/easiest-way-to-convert-month-name-to-month-number-in-js-jan-01





