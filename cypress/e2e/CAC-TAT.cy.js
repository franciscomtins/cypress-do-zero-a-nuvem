
describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')
  })

  it('verifica o título da aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', () => {
    cy.clock()

    const longText = Cypress._.repeat('abcdefghijlmnopqrstuvxz', 10)

    cy.get('#firstName').type('Francisco')
    cy.get('#lastName').type('Martins')
    cy.get('[type="email"]').type('meuemail@mail.com')
    cy.get('#open-text-area').type(longText, {delay: 0})
    cy.contains('button', 'Enviar').click()

    cy.get('.success').should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')

    cy.tick(3000)

    cy.get('.success').should('not.be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.clock()

    cy.get('#firstName').type('Francisco')
    cy.get('#lastName').type('Martins')
    cy.get('[type="email"]').type('formatoerrado.com')
    cy.get('#open-text-area').type('Teste email formato errado')
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')

   cy.tick(3000)

   cy.get('.success').should('not.be.visible')
  })
  
  it('Validar valor não númerico no telefone', () => {
    cy.get('#phone').type('xpto')

    cy.get('#phone').should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.clock()

    cy.get('#firstName').type('Francisco')
    cy.get('#lastName').type('Martins')
    cy.get('[type="email"]').type('email@email.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('Teste telefone obrigatório, mas não informado')
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')

    cy.tick(3000)

    cy.get('.success').should('not.be.visible')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
      .type('Francisco')
      .should('have.value', 'Francisco')
      .clear()
      .should('have.value', '')

    cy.get('#lastName')
      .type('Martins')
      .should('have.value', 'Martins')
      .clear()
      .should('have.value', '')

    cy.get('[type="email"]')
      .type('email@email.com')
      .should('have.value', 'email@email.com')
      .get('[type="email"]').clear()
      .should('have.value', '')
    
    cy.get('#phone')
      .type('988887777')
      .should('have.value', '988887777')
      .get('#phone').clear()
      .should('have.value', '')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.clock()

    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')

    cy.tick(3000)

    cy.get('.success').should('not.be.visible')
  })

  it('envia o formuário com sucesso usando um comando customizado', () => {
    cy.clock()

    cy.fillMandatoryFieldsAndSubmit()

    cy.get('.success')
      .should('be.visible')
      .contains('Mensagem enviada com sucesso.').should('be.visible') //validando msg de outra forma

    cy.tick(3000)
    cy.get('.success').should('not.be.visible')
  })

  it('envia o formuário com sucesso usando um comando customizado com objeto', () => {
    cy.clock()

    const data = {
      firstName: 'Francisco',
      lastName: 'Martins',
      email: 'teste@mail.com',
      text: 'Custom Comands com objeto no argumento'
    }

    cy.fillMandatoryFieldsAndSubmitV2(data)

    cy.get('.success')
      .should('be.visible')
      .contains('Mensagem enviada com sucesso.').should('be.visible')

    cy.tick(3000)
    cy.get('.success').should('not.be.visible')
  })

  it('envia o formuário com sucesso usando um comando customizado com objeto e valores padrão', () => {
    cy.fillMandatoryFieldsAndSubmitV3()

    cy.get('.success')
      .should('be.visible')
      .contains('Mensagem enviada com sucesso.').should('be.visible')
  })

  it('seleciona um produto (YouTube) por seu texto', () =>{
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product')
      .select(1)
      .should('have.value', 'blog')
  })

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[value="feedback"]')
    .check()
    .should('be.checked' )
  })

  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .each(typeOfService => {
        cy.wrap(typeOfService)
          .check()
          .should('be.checked')
      })
  })

  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
  })

  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json')
      .should(input => {
        expect(input[0].files[0].name).to.equal('example.json')
        console.log(input[0].files[0].name)
      })
  })

  it('seleciona um arquivo simulando um drag-and-dro', () => {
    cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json', {action: 'drag-drop'})
      .should(input => {
        expect(input[0].files[0].name).to.equal('example.json')
        console.log(input[0].files[0].name)
      })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('sampleFile')
    cy.get('#file-upload')
      .selectFile('@sampleFile')
      .should(input => {
        expect(input[0].files[0].name).to.equal('example.json')
        console.log(input[0].files[0].name)
      })
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () =>{
    cy.contains('a', 'Política de Privacidade')
      .should('have.attr', 'target', '_blank') 
      .and('have.attr', 'href', 'privacy.html')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.contains('a', 'Política de Privacidade')
      .invoke('removeAttr', 'target')
      .click()   

    cy.contains('h1', 'CAC TAT - Política de Privacidade')
      .should('be.visible')
  })

  it('exibe e oculta as mensagens de sucesso e erro usando .invoke()', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('preenche o campo da área de texto usando o comando invoke.', () => {
    cy.get('#open-text-area')
      .invoke('val', 'Qualquer texto aqui!')
      .should('have.value', 'Qualquer texto aqui!')
  })
  
  it.only('faz uma requisição HTTP', () => {
    cy.request('https://cac-tat-v3.s3.eu-central-1.amazonaws.com/index.html')
      .as('getRequest')
      .its('status')
      .should('be.equal', 200)
    cy.get('@getRequest')
      .its('statusText')
      .should('be.equal', 'OK')
    cy.get('@getRequest')
      .its('body')
      .should('include', 'CAC TAT')
  })

})

