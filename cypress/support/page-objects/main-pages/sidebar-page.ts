export default class SideBarPage{
    getPage = (page:string) =>{
        return cy.get('.oxd-main-menu').contains(page);
    }
}