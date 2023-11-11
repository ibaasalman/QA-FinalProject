import IdGenerator from "cypress/support/helpers/id-generator-helper";

class AddEmployeePage {

  URLs = {
    EMPLOYEES:
      "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees",
    USERS:
      "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users",
    EDIT_DETAILS: (id: number) => {
      return `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/${id}/job-details`;
    }
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

  addLoginDetails = (empId:number,logainDetails: any) => {
    return cy
      .api({
        method: "POST",
        url: this.URLs.USERS,
        body: {
          username: logainDetails.username,
          password: logainDetails.password,
          status: true,
          userRoleId: 2,
          empNumber: empId
      }
      })
      .its("body.data");
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
