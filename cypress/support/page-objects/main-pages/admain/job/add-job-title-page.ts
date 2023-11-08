export default class AddJobTitlePage {
  URLs = {
    ADD_JOB_TITLE:
      "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/job-titles",
  };

  addJobTitleViaAPI = (data: any) => {
    return cy
      .api({
        url: this.URLs.ADD_JOB_TITLE,
        method: "POST",
        body: {
          title: data.title,
          description: data.description,
          specification: data.specification,
          note: data.note,
        },
      })
      .its("body.data.id");
  };

  deleteJobTitleViaAPI = (id: number) => {
    return cy
      .api({
        url: this.URLs.ADD_JOB_TITLE,
        method: "DELETE",
        body: {
          ids: [id],
        },
      });
  };
}
