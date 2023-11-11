class SubmitClaim {
  URLs = {
    CLAIM:
      "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/claim/requests",
    EXPENSE: (claimID: number) =>
      `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/claim/requests/${claimID}/expenses`,
    SUBMIT: (claimID: number) =>
      `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/claim/requests/${claimID}/action`,
  };

  addClaimViaAPI = (eventID: number, claimData: any) => {
    return cy
      .api({
        method: "POST",
        url: this.URLs.CLAIM,
        body: {
          claimEventId: eventID,
          currencyId: claimData.currencyId,
          remarks: claimData.remarks,
        },
      })
      .its("body.data");
  };

  linkExpenseViaAPI = (claimID: number, expenseID: number, claimData: any) => {
    return cy
      .api({
        method: "POST",
        url: this.URLs.EXPENSE(claimID),
        body: {
          expenseTypeId: expenseID,
          date: claimData.expense.date,
          amount: claimData.expense.amount,
          note: claimData.expense.note,
        },
      })
      .its("body.data");
  };

  submitClaim = (claimID: number) => {
    return cy.api({
      method: "PUT",
      url: this.URLs.SUBMIT(claimID),
      body: {
        action: "SUBMIT",
      },
    });
  };
}

export default SubmitClaim;
