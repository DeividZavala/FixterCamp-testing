describe("Fixtercommerce", () => {
    it("should visit the page", ()=>{
        cy.visit("/")
        cy.get("#products-container > div").should("have.length", 6)
    })
})