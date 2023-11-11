class EmployeeClaimsPage {
  elements = {
    tableRows: () => cy.get(".oxd-table-body .oxd-table-row"),
    approveBtn: () => cy.get(".oxd-button").contains("Approve"),
    rejectBtn: () => cy.get(".oxd-button").contains("Reject"),
  };

  findRowAndClick(ReferenceId: any) {
    let found = false;
    this.elements.tableRows().each((row, index) => {
      cy.then(() => {
        console.log("found : " + found);
        if (found) {
          return;
        }

        cy.wrap(row)
          .children()
          .eq(0)
          .invoke("text")
          .then((celltxt) => {
            console.log("ReferenceId : " + ReferenceId);
            console.log(celltxt);
            if (celltxt == ReferenceId) {
              found = true;
              cy.wrap(row).children().eq(-1).find("button").click();
            }
          });
      });
    });
  }

  approveClaim() {
    this.elements.approveBtn().click();
  }

  rejectClaim() {
    this.elements.rejectBtn().click();
  }

  checkStatus(ReferenceId: any,status:string) {
    let found = false;
    this.elements.tableRows().each((row, index) => {
      cy.then(() => {
        console.log("found : " + found);
        if (found) {
          return;
        }

        cy.wrap(row)
          .children()
          .eq(0)
          .invoke("text")
          .then((celltxt) => {
            console.log("ReferenceId : " + ReferenceId);
            console.log(celltxt);
            if (celltxt == ReferenceId) {
              found = true;
              cy.wrap(row).children().eq(6).should('contain',status);
            }
          });
      });
    });
  }
}

export default EmployeeClaimsPage;
