describe("Fixtercommerce", () => {
    it("should visit the page and render products and cart items", ()=>{
        cy.setupAndVisit()
        cy.get("#products-container > div").should("have.length", 6)
    })
    it("should show empty message if no products", () => {
        cy.setupAndVisit([])
        cy.get('.uk-alert-primary').should("be.visible")
    })
})