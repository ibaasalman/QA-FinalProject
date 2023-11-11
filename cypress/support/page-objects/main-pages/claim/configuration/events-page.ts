class EventsPage {
  URLs = {
    EVENTS:
      "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/claim/events",
  };

  addEventViaAPI = (eventData: any) => {
    return cy
      .api({
        method: "POST",
        url: this.URLs.EVENTS,
        body: {
          name: eventData.name,
          description: eventData.description,
          status: true,
        },
      })
      .its("body.data");
  };

  deleteEventViaAPI = (id: number[]) => {
    return cy.api({
      method: "DELETE",
      url: this.URLs.EVENTS,
      body: {
        ids: id,
      },
    });
  };
}

export default EventsPage;
