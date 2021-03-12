describe("Fixtercommerce", () => {
    it("should visit the page and render products and cart items", ()=>{
        cy.setupAndVisit()
        cy.get("#products-container > div").should("have.length", 6)
    })
    it("should show empty message if no products", () => {
        cy.setupAndVisit([])
        cy.get('.uk-alert-primary').should("be.visible")
    })
    it("should render error message", () => {
        cy.intercept("GET", "/products", { statusCode: 500 })
        cy.visit("/")
        cy.get('.uk-alert-danger').should("be.visible")
    })
    it("should add product to the cart", ()=>{
        cy.intercept("PATCH", "/cart", {
            "id": 1,
            "products": [
              {
                "id": 1,
                "image": "https://images-na.ssl-images-amazon.com/images/I/814z4KAsOcL._AC_UL160_SR160,160_.jpg",
                "price": "1619.00",
                "name": "XBSX Call of Duty Black Ops: Cold War - Standard",
                "quantity": 1
              }
            ]
          }).as("update")
        cy.setupAndVisit(undefined, {})

        cy.get("#cart > div").should("have.length", 0)

        cy.get("#products-container > div").first().find("button").click()

        cy.wait("@update")

        cy.get("#cart > div").should("have.length", 1)
    })
})