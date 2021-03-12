describe("Fixtercommerce", () => {
    it("should visit the page", ()=>{

        cy.intercept("GET", "/products", {fixture:"products"}).as("load")

        cy.visit("/")

        cy.wait("@load")
        cy.get("#products-container > div").should("have.length", 6)
    })
})