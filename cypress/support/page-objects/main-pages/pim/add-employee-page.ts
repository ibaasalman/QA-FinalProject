import IdGenerator from "cypress/support/helpers/id-generator-helper";

class AddEmployeePage {

  URLs = {
    EMPLOYEES:
      "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees",
    USERS:
      "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users",
    EDIT_DETAILS: (id: number) => {
      return `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/${id}/job-details`;
    },
    ADD_SALARY: (id: number) => {
      return `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/${id}/salary-components`;
    },
  };

  addViaAPI = (empData: any) => {
    return cy
      .api({
        method: "POST",
        url: this.URLs.EMPLOYEES,
        body: {
          firstName: empData.firstName,
          middleName: empData.middleName,
          lastName: empData.lastName,
          empPicture: null,
          employeeId: `${IdGenerator.genericRandomNumber()}`,
        },
      })
      .its("body.data");
  };

  editDetailsAPI = (empId: number, locId: number, jobTileId: number) => {
    return cy.api({
      method: "PUT",
      url: this.URLs.EDIT_DETAILS(empId),
      body: {
        jobTitleId: jobTileId,
        locationId: locId,
      },
    });
  };
  
  addSalaryAPI = (empId: number, salary: any) => {
    return cy.api({
      method: "POST",
      url: this.URLs.ADD_SALARY(empId),
      body: {
        salaryComponent: salary.salaryComponent,
        salaryAmount: salary.salaryAmount,
        currencyId: salary.currencyId,
        payFrequencyId: salary.payFrequencyId,
        comment: salary.comment,
        addDirectDeposit: salary.addDirectDeposit,
      },
    });
  };
  

  deleteEmployeeViaAPI = (id:number[]) => {
      return cy.api({
          method: 'DELETE',
          url: this.URLs.EMPLOYEES,
          body:{
              ids: id
          }
      })
  }
}

export default AddEmployeePage;
