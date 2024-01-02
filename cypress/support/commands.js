Cypress.Commands.add('fillMandatoryFieldsAndSubmit', () =>{
    cy.get('#firstName').type('Francisco')
    cy.get('#lastName').type('Martins')
    cy.get('[type="email"]').type('teste@mail.com')
    cy.get('#open-text-area').type('Teste Custom Comands.')
    cy.contains('button', 'Enviar').click()
})

// Usando objeto para declarar dados 
Cypress.Commands.add('fillMandatoryFieldsAndSubmitV2', data => {
    cy.get('#firstName').type(data.firstName)
    cy.get('#lastName').type(data.lastName)
    cy.get('[type="email"]').type(data.email)
    cy.get('#open-text-area').type(data.text)
    cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('fillMandatoryFieldsAndSubmitV3', (data = {
    firstName: 'Jess',
    lastName: 'Martins',
    email: 'jess@mail.com',
    text: 'Custo Comands com Objeto e Valor Default'        
}) => {
    cy.get('#firstName').type(data.firstName)
    cy.get('#lastName').type(data.lastName)
    cy.get('[type="email"]').type(data.email)
    cy.get('#open-text-area').type(data.text)
    cy.get('button[type="submit"]').click()
})
