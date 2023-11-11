///<reference types="cypress" />

import LoginPage from "cypress/support/page-objects/main-pages/login-page";
import AddEmployeePage from "cypress/support/page-objects/main-pages/pim/add-employee-page";
import EventsPage from "cypress/support/page-objects/main-pages/claim/configuration/events-page";
import ExpensesPage from "cypress/support/page-objects/main-pages/claim/configuration/expenses-page";
import SubmitClaim from "cypress/support/page-objects/main-pages/claim/submit-claim-page";
import SideBarPage from "cypress/support/page-objects/main-pages/sidebar-page";
import EmployeeClaimsPage from "cypress/support/page-objects/main-pages/claim/employee-claims-page";

const MY_LOGIN_PAGE: LoginPage = new LoginPage();
const MY_ADD_EMPLOYEE_PAGE: AddEmployeePage = new AddEmployeePage();
const MY_EVENTS_PAGE: EventsPage = new EventsPage();
const MY_EXPENSE_PAGE: ExpensesPage = new ExpensesPage();
const MY_SUBMIT_CLAIM_PAGE: SubmitClaim = new SubmitClaim();
const MY_SIDEBAR: SideBarPage = new SideBarPage();
const MY_EMPLOYEE_CLAIMS_PAGE: EmployeeClaimsPage = new EmployeeClaimsPage();

let employeeId: number;
let eventId: number;
let expenseId: number;
let claimId: number;
let ClaimreferenceId: String;

describe("claims page test cases", () => {
  before("initiate employee , event ,expense", () => {
    //login to the system as a admin
    cy.visit("./");
    MY_LOGIN_PAGE.login("Admin", "admin123");

    //create new Emplyee with Login Details based on fixture data
    cy.fixture("employee-data").as("empData");
    cy.get("@empData").then((res: any) => {
      MY_ADD_EMPLOYEE_PAGE.addViaAPI(res).then(({ empNumber }: any) => {
        employeeId = empNumber;
        MY_ADD_EMPLOYEE_PAGE.addLoginDetails(empNumber, res.loginDetails);
      });
    });

    //create new event based on fixture data
    cy.fixture("event-data").as("eventData");
    cy.get("@eventData").then((res: any) => {
      MY_EVENTS_PAGE.addEventViaAPI(res).then(({ id }: any) => {
        eventId = id;
      });
    });

    //create new expense based on fixture data
    cy.fixture("expense-data").as("expenseData");
    cy.get("@expenseData").then((res: any) => {
      MY_EXPENSE_PAGE.addExpenseViaAPI(res).then(({ id }: any) => {
        expenseId = id;
      });
    });

    //logout as admain
    MY_LOGIN_PAGE.logout();
  });

  beforeEach("creating new claim", () => {
    //login as a employee based on fixture data
    cy.fixture("employee-data").as("empData");
    cy.get("@empData").then(({ loginDetails }: any) => {
      cy.visit("./");
      MY_LOGIN_PAGE.login(loginDetails.username, loginDetails.password);
    });

    //submit new claim based on fixture data
    cy.fixture("claim-data.json").as("claimData");
    cy.get("@claimData")
      .then((res: any) => {
        MY_SUBMIT_CLAIM_PAGE.addClaimViaAPI(eventId, res).then(
          ({ id, referenceId }: any) => {
            ClaimreferenceId = referenceId;
            claimId = id;
            // link the expense that created before with this new claim
            MY_SUBMIT_CLAIM_PAGE.linkExpenseViaAPI(id, expenseId, res).then(
              () => {
                //submit the new claim
                MY_SUBMIT_CLAIM_PAGE.submitClaim(claimId);
              }
            );
          }
        );
      })
      .then(() => {
        //logout as employee
        MY_LOGIN_PAGE.logout();

        //login as admain and navigate to claim page
        cy.visit("./");
        MY_LOGIN_PAGE.login("Admin", "admin123");
        MY_SIDEBAR.getPage("Claim").click();
        //click on the new claim
        MY_EMPLOYEE_CLAIMS_PAGE.findRowAndClick(ClaimreferenceId);
      });
  });

  it("admain reject employee claim", () => {
    MY_EMPLOYEE_CLAIMS_PAGE.rejectClaim();
    cy.get(".oxd-topbar-body-nav-tab-item").contains("Employee Claims").click();
    MY_EMPLOYEE_CLAIMS_PAGE.checkStatus(ClaimreferenceId, "Rejected");
  });

  it("admain accept employee claim", () => {
    MY_EMPLOYEE_CLAIMS_PAGE.approveClaim();
    cy.get(".oxd-topbar-body-nav-tab-item").contains("Employee Claims").click();
    MY_EMPLOYEE_CLAIMS_PAGE.checkStatus(ClaimreferenceId, "Paid");
  });

  after("Delete test data", () => {
    MY_EVENTS_PAGE.deleteEventViaAPI([eventId]);
    MY_EXPENSE_PAGE.deleteExpenseViaAPI([expenseId]);
    MY_ADD_EMPLOYEE_PAGE.deleteEmployeeViaAPI([employeeId]);
  });
});
