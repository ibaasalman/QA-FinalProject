export default class AddLocationPage {
  URLs = {
    ADD_LOCATION:
      "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/locations",
  };

  addLocationViaAPI = (data: any) => {
    return cy
      .api({
        url: this.URLs.ADD_LOCATION,
        method: "POST",
        body: {
          name: data.name,
          countryCode: data.countryCode,
          province: data.province,
          city: data.city,
          address: data.address,
          zipCode: data.zipCode,
          phone: data.phone,
          fax: data.fax,
          note: data.note,
        },
      })
      .its("body.data.id");
  };

  deleteLocationViaAPI = (id: number) => {
    return cy
      .api({
        url: this.URLs.ADD_LOCATION,
        method: "DELETE",
        body: {
          ids: [id],
        }
      })
  };
}
