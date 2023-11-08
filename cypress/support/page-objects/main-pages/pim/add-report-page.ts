class AddReportPage {
  lastOptionIndex = 0;

  URLs = {
    DELETE_REPORT:
      "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/reports/defined",
  };

  elemnts = {
    reportName: () => cy.get('input[placeholder="Type here ..."]'),
    selectCriteria: () => cy.get(".oxd-select-text-input"),
    selectOption: () => cy.get(".oxd-select-option"),
    addCriteriaBtn: () => cy.get(".oxd-icon.bi-plus").eq(0),
    selectDisplayFieldGroup: () =>cy.get(".oxd-select-text-input").eq(this.lastOptionIndex + 1),
    selectDisplayField: () =>cy.get(".oxd-select-text-input").eq(this.lastOptionIndex + 2),
    addDisplayBtn: () => cy.get(".oxd-icon.bi-plus").eq(1),
    switchInputs: () => cy.get(".oxd-switch-input"),
    save: () => cy.get(".oxd-button--secondary"),
    title: () => cy.get(".orangehrm-card-container > .oxd-text"),
    reportLabel : ()=> cy.get('.orangehrm-card-container > .oxd-text'),
    rowsCountLabel : ()=> cy.get('.oxd-report-table-header--pagination > .oxd-text'),
    tableFieldGroupRow : ()=> cy.get('.group-rgRow'),
    tableFieldRow : ()=> cy.get('.header-rgRow.actual-rgRow'),
    rows : ()=> cy.get('.content-wrapper div.rgRow')
  };

  addNewReport = (settings: any, searchCriteriaValues: any) => {

    //typing report name based on settings object
    this.elemnts.reportName().type(settings.reportName, { force: true });

    //choose  searchCriteria options based on settings object + searchCriteriaValues array 
    settings.searchCriteria.forEach((criteria: string, index: number) => {
      this.elemnts.selectCriteria().eq(0).click();
      this.elemnts.selectOption().contains(criteria).click();
      this.elemnts.addCriteriaBtn().click();

      this.elemnts
        .selectCriteria()
        .eq(2 + index)
        .click();
      this.elemnts.selectOption().contains(searchCriteriaValues[index]).click();
      this.lastOptionIndex = index + 2;
    });

    //choose  DisplayFieldGroup,displayFiedls options based on settings object
    settings.displayFiedls.forEach((item: any, index: number) => {
      this.elemnts.selectDisplayFieldGroup().click();
      this.elemnts.selectOption().contains(item.fieldGroup).click();
      this.elemnts.selectDisplayField().click();
      this.elemnts.selectOption().contains(item.field).click();
      this.elemnts.addDisplayBtn().click();
    });

    // turn on all switchInputs headers
    this.elemnts.switchInputs().each((el) => {
      cy.wrap(el).click();
    });

    //save as new report
    this.elemnts.save().click();
  };

  cheackReport = (reportData:any,expectedData:any[])=>{

    //cheack the report table label (title)
    this.elemnts.reportLabel().should("have.text",reportData.reportName);

    //assert the num of rows with expeted data length
    this.elemnts.rowsCountLabel().invoke('text').then((text:string) => {
      const countNumber = text.match(/\d+/);
      if(countNumber != null){
       expect(countNumber[0]).to.eq(`${expectedData.length}`);
      }
    });
    
    // assert table headers FieldGroups with settings based
    this.elemnts.tableFieldGroupRow().children('.rgHeaderCell').each((cell,index)=>{
      const fieldGroup = reportData.displayFiedls[index].fieldGroup
      cy.wrap(cell).contains(fieldGroup).should('have.text',fieldGroup)
    })

    // assert table headers Fields with settings based
    this.elemnts.tableFieldRow().children('.rgHeaderCell').each((cell,index)=>{
      const field = reportData.displayFiedls[index].field
      cy.wrap(cell).contains(field).should('contain',field)
    })

    // assert rows values with the expected result
    this.elemnts.rows().each((row,rowIndex)=>{
      cy.wrap(row).children('.rgCell').each((cell,cellIndex)=>{
        cy.wrap(cell).should("contain",expectedData[rowIndex][cellIndex])
      })
    })


  }

  deleteReportViaAPI = (id: number) => {
    return cy
      .api({
        url: this.URLs.DELETE_REPORT,
        method: "DELETE",
        body: {
          ids: [id],
        }
      });
  };

}
export default AddReportPage;
