/**
 * Skenario Pengujian:
 *
 * - Login spec:
 *  - should display login page correctly
 *  - should display alert when email and password are wrong
 *  - should display homepage when email and password are correct
 */

describe('Login spec', () => {
  beforeEach(() => {
    cy.viewport(1280, 800)
    cy.visit('/login')
  })

  it('should display login page correctly', () => {
    // memverifikasi seluruh elemen formulir login tampil dengan benar
    cy.get('input#login-email').should('be.visible')
    cy.get('input#login-password').should('be.visible')
    cy.get('button#btn-login').should('be.visible').and('contain', 'Sign In')
  })

  it('should display alert when email and password are wrong', () => {
    // intercept API login untuk simulasi kredensial salah secara deterministik
    cy.intercept('POST', 'https://forum-api.dicoding.dev/v1/login', {
      statusCode: 401,
      body: {
        status: 'fail',
        message: 'email or password is wrong'
      }
    }).as('loginFailedRequest')

    const alertStub = cy.stub().as('alertStub')
    cy.on('window:alert', alertStub)

    // memasukkan email dan password yang tidak valid
    cy.get('input#login-email').type('invalid_user@dicoding.test')
    cy.get('input#login-password').type('wrongpassword')

    // menekan tombol submit Sign In
    cy.get('button#btn-login').click()

    // memverifikasi request selesai dan window:alert terpanggil secara andal dengan retry
    cy.wait('@loginFailedRequest')
    cy.get('@alertStub').should('have.been.calledWith', 'email or password is wrong')
  })

  it('should display homepage when email and password are correct', () => {
    // intercept API auth & profile untuk memastikan pengujian E2E deterministik dan stabil
    cy.intercept('POST', 'https://forum-api.dicoding.dev/v1/login', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          token: 'cypress-test-token-123'
        }
      }
    }).as('loginRequest')

    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/users/me', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          user: {
            id: 'cypress-user-id',
            name: 'Cypress Tester',
            email: 'tester@dicoding.test',
            avatar: 'https://ui-avatars.com/api/?name=Cypress+Tester'
          }
        }
      }
    }).as('profileRequest')

    // mock request threads dan users agar homepage stabil tanpa latency jaringan luar
    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/threads', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          threads: []
        }
      }
    }).as('threadsRequest')

    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/users', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          users: []
        }
      }
    }).as('usersRequest')

    // mengisi kredensial login
    cy.get('input#login-email').type('tester@dicoding.test')
    cy.get('input#login-password').type('validpassword')

    // menekan tombol submit Sign In
    cy.get('button#btn-login').click()

    // memverifikasi kedua request terkirim dan navigasi ke homepage berhasil
    cy.wait('@loginRequest')
    cy.wait('@profileRequest')
    cy.get('button#btn-login').should('not.exist')
    cy.get('aside.threads-sidebar-nav').should('be.visible')
  })
})
