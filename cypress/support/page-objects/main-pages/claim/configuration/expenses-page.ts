class ExpensesPage {
    URLs = {
      EXPENSES:
        "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/claim/expenses/types",
    };
  
    addExpenseViaAPI = (expenseData: any) => {
      return cy
        .api({
          method: "POST",
          url: this.URLs.EXPENSES,
          body: {
            name: expenseData.name,
            description: expenseData.description,
            status: expenseData.status
        }
        })
        .its("body.data");
    };
  
    deleteExpenseViaAPI = (id: number[]) => {
      return cy.api({
        method: "DELETE",
        url: this.URLs.EXPENSES,
        body: {
          ids: id,
        },
      });
    };
  }
  
  export default ExpensesPage;
  