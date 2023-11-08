///<reference types="cypress" />
import LoginPage from "cypress/support/page-objects/main-pages/login-page";
import AddLocationPage from "cypress/support/page-objects/main-pages/admain/organization/add-location-page";
import AddJobTitlePage from "cypress/support/page-objects/main-pages/admain/job/add-job-title-page";
import AddEmployeePage from "cypress/support/page-objects/main-pages/pim/add-employee-page";
import SideBarPage from "cypress/support/page-objects/main-pages/sidebar-page";
import AddReportPage from "cypress/support/page-objects/main-pages/pim/add-report-page";

const MY_LOGIN_PAGE: LoginPage = new LoginPage();
const MY_LOCATION_PAGE: AddLocationPage = new AddLocationPage();
const MY_ADD_JOB_TITLE_PAGE: AddJobTitlePage = new AddJobTitlePage();
const MY_ADD_EMPLOYEE_PAGE: AddEmployeePage = new AddEmployeePage();
const MY_SIDEBAR: SideBarPage = new SideBarPage();
const MY_ADD_REPORT_PAGE: AddReportPage = new AddReportPage();

// vars to hold the return IDs for new data
let locDataId: number;
let jobTitleId: number;
let employeesIds: number[] = [];
let reportId: any;

describe("", () => {
  before(
    "Creating the employees and associate them to location,jobTitle and salary.",
    () => {
      //Login into the orangeHRM system
      cy.visit("./");
      MY_LOGIN_PAGE.login("Admin", "admin123");

      //Add new location based on the fixture data
      cy.fixture("location-data").as("locData");
      cy.get("@locData").then((locData: any) => {
        MY_LOCATION_PAGE.addLocationViaAPI(locData).then((id) => {
          locDataId = id;
        });
      });

      //Add new job title based on the fixture data
      cy.fixture("job-title-data").as("jobTitleData");
      cy.get("@jobTitleData").then((jobTitleData: any) => {
        MY_ADD_JOB_TITLE_PAGE.addJobTitleViaAPI(jobTitleData).then((id) => {
          jobTitleId = id;
        });
      });

      //Add new employees based on the fixture data
      cy.fixture("employees-data").as("empData");
      cy.get("@empData").then((res: any) => {
        res.forEach((user: any, index: number) => {
          MY_ADD_EMPLOYEE_PAGE.addViaAPI(user).then(({ empNumber }: any) => {
            employeesIds.push(empNumber);

            //Edit the details to associate them with the created location and job title.
            MY_ADD_EMPLOYEE_PAGE.editDetailsAPI(
              empNumber,
              locDataId,
              jobTitleId
            );
            //Add salary component based on fixture data
            MY_ADD_EMPLOYEE_PAGE.addSalaryAPI(empNumber, user.salary);
          });
        });
      });
    }
  );

  it("Generate an Employee report with search criteria by (Personal : First name/ Job: Job title/ Salary:Amount)", () => {
    cy.visit("./");

    // navigate to add report page
    MY_SIDEBAR.getPage("PIM").click();
    cy.get(".oxd-topbar-body-nav-tab-item").contains("Reports").click();
    cy.get(".orangehrm-header-container > .oxd-button").click();

    //get report settings data + values from fixtures
    cy.get("@locData").then((locData: any) => {
      cy.get("@jobTitleData").then((jobTitleData: any) => {
        cy.fixture("report-settings-data").then((settings: any) => {
          MY_ADD_REPORT_PAGE.addNewReport(settings, [
            jobTitleData.title,
            locData.name,
          ]);

          // save the report new ID
          cy.url()
            .should("include", "displayPredefinedReport")
            .then((url) => {
              // Extract the ReportID from the URL
              reportId = url.split("/").pop();
            });

          // only to view table for 2s
          cy.wait(2000);
          
          // prepare expectedData passed on fixture data
          const expectedData: any[] = [];
          cy.fixture("employees-data").as("empData");
          cy.get("@empData").then((empData: any) => {
            empData.forEach((item: any) => {
              expectedData.push([
                item.firstName,
                jobTitleData.title,
                item.salary.salaryAmount,
              ]);
            });
          });

          //validate the report table by passing the expect data results and report settings
          MY_ADD_REPORT_PAGE.cheackReport(settings, expectedData);

        });
      });
    });
  });
  after("Delete the report,employees,location and jobTitle", () => {
    MY_ADD_REPORT_PAGE.deleteReportViaAPI(+reportId);
    MY_ADD_EMPLOYEE_PAGE.deleteEmployeeViaAPI(employeesIds);
    MY_LOCATION_PAGE.deleteLocationViaAPI(locDataId);
    MY_ADD_JOB_TITLE_PAGE.deleteJobTitleViaAPI(jobTitleId);
  });
});
