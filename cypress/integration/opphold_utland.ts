import { soknaderOpplaering as soknader } from '../../src/data/mock/data/soknader-opplaering'
import { RSSoknad } from '../../src/types/rs-types/rs-soknad'

describe('Tester søknad om å beholde sykepenger utenfor EØS', () => {

    const soknad = soknader.find((sok: RSSoknad) => sok.id === 'b9d67b0d-b1f8-44a5-bcbd-6010b60b90ce')!

    before(() => {
        cy.visit('http://localhost:8080')
    })

    it('Laster startside', function() {
        cy.get('.typo-sidetittel').should('be.visible').and('have.text', 'Søknader om sykepenger')
        cy.get(`#soknader-list-til-behandling article a[href*=${soknad.id}]`).should('include.text', 'Søknad om å beholde sykepenger utenfor EØS')
        cy.get(`#soknader-list-til-behandling article a[href*=${soknad.id}]`).click()
    })


    it('PERIODEUTLAND - steg 1', function() {
        cy.url().should('include', `${soknad.id}/1`)


        cy.contains('Opplysninger fra sykmeldingen').should('not.exist')
        cy.contains('Når skal du reise?')

        cy.get('.skjemaelement__input.form-control').focus()
        cy.get('.flatpickr-calendar').contains('17').click({ force: true })
        cy.get('.flatpickr-calendar').contains('24').click({ force: true })


        cy.contains('Gå videre').click()
    })

    it('LAND - steg 2', function() {
        cy.url().should('include', `${soknad.id}/2`)
        cy.contains('Gå videre').click()
        cy.contains('Du må velge ett land')
        cy.contains('Det er 1 feil i skjemaet')
        cy.contains('Du må oppgi et land utenfor EØS. Innenfor EØS trenger du ikke søke.')


        cy.contains('Hvilket land skal du reise til?')
        cy.get('.skjemaelement__input').type('Fransk')
        cy.contains('Fransk Polynesia')
        cy.contains('Søre franske territorier').click({ force: true })

        cy.contains('Du må velge ett land').should('not.exist')
        cy.contains('Det er 1 feil i skjemaet').should('not.exist')
        cy.contains('Du må oppgi et land utenfor EØS. Innenfor EØS trenger du ikke søke.').should('not.exist')

        cy.get('.skjemaelement__input').type('De')
        cy.contains('De forente arabiske emirater')
        cy.contains('De okkuperte palestinske områdene').click({ force: true })

        cy.get('.skjemaelement__input').type('R')
        cy.contains('Amerikansk Samoa').click({ force: true })
        cy.contains('Amerikansk Samoa')
        cy.get(':nth-child(3) > .etikett__slett').click()
        cy.contains('Amerikansk Samoa').should('not.exist')

        cy.contains('Gå videre').click()
    })

    it('ARBEIDSGIVER', function() {
        cy.url().should('include', `${soknad.id}/3`)


        cy.contains('Har du arbeidsgiver?')
        cy.contains('Nei').click({ force: true })

        cy.contains('Gå videre').click()
    })

    it('BEKRFEFT', function() {
        cy.url().should('include', `${soknad.id}/4`)


        cy.contains('Bekreft opplysninger')
        cy.contains('Før du reiser ber vi deg bekrefte')
        cy.contains('Jeg bekrefter de to punktene ovenfor').click({ force: true })

        cy.contains('Send søknaden').click()
    })

    it('Kvittering', function() {
        cy.url().should('include', `kvittering/${soknad.id}`)

        cy.contains('Søknaden er sendt til NAV')
        cy.contains('Endre søknad').should('not.exist')
        cy.contains('Send til NAV').should('not.exist')
        cy.get('.ekspanderbartPanel__tittel > .typo-element').click()
        cy.contains('Hvilket land skal du reise til?')
        cy.contains('Søre franske territorier')
        cy.contains('De okkuperte palestinske områdene')
        cy.contains('Amerikansk Samoa').should('not.exist')

    })

})
