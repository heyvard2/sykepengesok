import { arbeidstakerGradert } from '../../src/data/mock/data/soknader-opplaering'
import { RSSoknad } from '../../src/types/rs-types/rs-soknad'

describe('Tester feilmeldinger', () => {
    function gaTilSoknad(soknad: RSSoknad, steg: string) {
        cy.visit(`http://localhost:8080/soknader/${soknad.id}/${steg}`)
    }

    function gaVidere() {
        cy.contains('Gå videre').click({ force: true })
    }

    function feilmeldingHandtering(
        lokalFeilmelding: string,
        globalFeilmelding: string,
        focusTarget: string
    ) {
        cy.get('.skjemaelement__input--harFeil').should('have.css', 'border-color', 'rgb(186, 58, 38)')
        cy.get('.skjemaelement__feilmelding').contains(lokalFeilmelding)
        cy.get('.feiloppsummering')
            .should('have.css', 'background-color', 'rgb(255, 255, 255)')
            .should('have.css', 'border-color', 'rgb(186, 58, 38)')
            .within(() => {
                cy.contains('Det er 1 feil i skjemaet')
                cy.contains(globalFeilmelding).click()
            })
        cy.focused().should('have.attr', 'name', focusTarget)
    }

    function ingenFeilmeldinger() {
        cy.get('.skjemaelement__input--harFeil').should('not.exist')
        cy.get('.feiloppsummering').should('not.exist')
    }

    it('CHECKBOX_PANEL ingen valg', () => {
        gaTilSoknad(arbeidstakerGradert, '1')
        gaVidere()

        feilmeldingHandtering(
            'Du må bekrefte dette',
            'Du må bekrefte dette før du går videre',
            arbeidstakerGradert.sporsmal[0].id
        )
        cy.focused().click({ force: true })

        ingenFeilmeldinger()
    })

    it('JA_NEI ingen valg', () => {
        gaTilSoknad(arbeidstakerGradert, '3')
        gaVidere()

        cy.get('.radioPanel').should('have.css', 'border-color', 'rgb(186, 58, 38)')
        cy.get('.skjemaelement__feilmelding').contains('Du må velge et alternativ')
        cy.get('.feiloppsummering')
            .should('have.css', 'background-color', 'rgb(255, 255, 255)')
            .should('have.css', 'border-color', 'rgb(186, 58, 38)')
            .within(() => {
                cy.contains('Det er 1 feil i skjemaet')
                cy.contains('Du må oppgi om du var tilbake i arbeid før friskmeldingsperioden utløp')
                    .click()
            })
        cy.focused()
            .should('have.attr', 'name', arbeidstakerGradert.sporsmal[2].id)
            .click({ force: true })

        ingenFeilmeldinger()
    })

    it('DATO ingen dato', () => {
        gaVidere()
        feilmeldingHandtering(
            'Du må oppgi en gyldig dato',
            'Du må oppgi en gyldig dato',
            arbeidstakerGradert.sporsmal[2].undersporsmal[0].id
        )
    })

    it('DATO mindre enn min', () => {
        cy.get('.nav-datovelger__input').type('01.01.1900')
        gaVidere()
        feilmeldingHandtering(
            'Datoen kan ikke være før 01.04.2020',
            'Datoen kan ikke være før 01.04.2020',
            arbeidstakerGradert.sporsmal[2].undersporsmal[0].id
        )
    })

    it('DATO større enn max', () => {
        cy.get('.nav-datovelger__input').clear().type('01.01.5000')
        gaVidere()
        feilmeldingHandtering(
            'Datoen kan ikke være etter 24.04.2020',
            'Datoen kan ikke være etter 24.04.2020',
            arbeidstakerGradert.sporsmal[2].undersporsmal[0].id
        )
    })

    it('DATO ugyldig format', () => {
        cy.get('.nav-datovelger__input').clear().type('abc')
        gaVidere()
        feilmeldingHandtering(
            'Datoen følger ikke formatet dd.mm.åååå',
            'Datoen følger ikke formatet dd.mm.åååå',
            arbeidstakerGradert.sporsmal[2].undersporsmal[0].id
        )
    })

    it('PERIODER ingen fom', () => {
        gaTilSoknad(arbeidstakerGradert, '4')
        cy.get('input[value=JA]').click({ force: true })
        gaVidere()
        feilmeldingHandtering(
            'Du må oppgi en fra og med dato',
            'Du må oppgi en fra og med dato',
            arbeidstakerGradert.sporsmal[3].undersporsmal[0].id + '_0_fom'
        )
    })

    it('PERIODER ingen tom', () => {
        cy.focused().type('15.04.2020')
        gaVidere()
        feilmeldingHandtering(
            'Du må oppgi en til og med dato',
            'Du må oppgi en til og med dato',
            arbeidstakerGradert.sporsmal[3].undersporsmal[0].id + '_0_tom'
        )
    })

    it('PERIODER ugyldig format', () => {
        cy.focused().clear().type('abc')
        gaVidere()
        feilmeldingHandtering(
            'Til og med følger ikke formatet dd.mm.åååå',
            'Til og med følger ikke formatet dd.mm.åååå',
            arbeidstakerGradert.sporsmal[3].undersporsmal[0].id + '_0_tom'
        )
    })

    it('PERIODER tom før fom', () => {
        cy.focused().clear().type('10.04.2020')
        gaVidere()
        feilmeldingHandtering(
            'Fra og med må være før til og med',
            'Fra og med må være før til og med',
            arbeidstakerGradert.sporsmal[3].undersporsmal[0].id + '_0_fom'
        )
    })

    it('PERIODER overlapper', () => {
        cy.get('#687305_0 .fom').clear().type('01.04.2020')
        cy.contains('+ Legg til ekstra periode').click()
        cy.get('#687305_1 .fom').type('05.04.2020')
        cy.get('#687305_1 .tom').type('20.04.2020')
        gaVidere()
        feilmeldingHandtering(
            'Perioder kan ikke overlappe',
            'Du kan ikke legge inn perioder som overlapper med hverandre',
            arbeidstakerGradert.sporsmal[3].undersporsmal[0].id + '_1_fom'
        )
    })

    it('PERIODER slett feil', () => {
        cy.contains('Slett periode').click()
        ingenFeilmeldinger()
    })

    it('RADIO prosent eller timer ikke valgt', () => {
        gaTilSoknad(arbeidstakerGradert, '8')
        cy.get('input[value=JA]').click({ force: true })
        cy.get(`input[name=${arbeidstakerGradert.sporsmal[7].undersporsmal[0].id}]`).type('37.5')
        gaVidere()

        cy.get('.radioknapp').should('have.css', 'border-color', 'rgb(186, 58, 38)')
        cy.get('.skjemaelement__feilmelding').contains('Du må velge prosent eller timer')
        cy.get('.feiloppsummering')
            .should('have.css', 'background-color', 'rgb(255, 255, 255)')
            .should('have.css', 'border-color', 'rgb(186, 58, 38)')
            .within(() => {
                cy.contains('Det er 1 feil i skjemaet')
                cy.contains('Du må velge prosent eller timer')
                    .click()
            })
        cy.focused()
            .should('have.attr', 'name', arbeidstakerGradert.sporsmal[7].undersporsmal[1].id)
            .click({ force: true })

        ingenFeilmeldinger()
    })

    it('TALL ingen valg', () => {
        gaVidere()
        feilmeldingHandtering(
            'Du må oppgi en verdi',
            'Du må svare på hvor mye du jobbet totalt',
            arbeidstakerGradert.sporsmal[7].undersporsmal[1].undersporsmal[0].undersporsmal[0].id
        )
    })

    it('TALL mindre enn min', () => {
        cy.focused().type('-10')
        gaVidere()
        feilmeldingHandtering(
            'Må være minimum 51',
            'Vennligst fyll ut et tall mellom 51 og 99',
            arbeidstakerGradert.sporsmal[7].undersporsmal[1].undersporsmal[0].undersporsmal[0].id
        )
    })

    it('TALL større enn max', () => {
        cy.focused().clear().type('1000')
        gaVidere()
        feilmeldingHandtering(
            'Må være maksimum 99',
            'Vennligst fyll ut et tall mellom 51 og 99',
            arbeidstakerGradert.sporsmal[7].undersporsmal[1].undersporsmal[0].undersporsmal[0].id
        )
    })

    it('TALL grad mindre enn sykmeldingsgrad', () => {
        cy.get(`input[id=${arbeidstakerGradert.sporsmal[7].undersporsmal[1].undersporsmal[1].id}]`).click({ force: true })
        gaVidere()
        feilmeldingHandtering(
            'Du må oppgi en verdi',
            'Du må svare på hvor mye du jobbet totalt',
            arbeidstakerGradert.sporsmal[7].undersporsmal[1].undersporsmal[1].undersporsmal[0].id
        )
        cy.focused().type('1')
        gaVidere()
        feilmeldingHandtering(
            'Timene utgjør mindre enn 50 %.',
            'Timene du skrev inn tyder på at du har jobbet mindre enn 50 %. Du må enten svare nei på øverste spørsmålet eller endre antall timer totalt.',
            arbeidstakerGradert.sporsmal[7].undersporsmal[1].undersporsmal[1].undersporsmal[0].id
        )
    })

    it('TALL grad feilmelding går bort', () => {
        cy.focused().clear().type('50')
        ingenFeilmeldinger()
    })

    it('CHECKBOX_GRUPPE ingen valgt', () => {
        gaTilSoknad(arbeidstakerGradert, '9')
        cy.get('input[value=JA]').click({ force: true })
        gaVidere()

        cy.get('.checkboksContainer label')
            .first()
            .then(els => {
                // get Window reference from element
                const win = els[0].ownerDocument.defaultView
                // use getComputedStyle to read the pseudo selector
                const before = win!.getComputedStyle(els[0], 'before')
                const contentValue = before.borderColor

                expect(contentValue).to.eq('rgb(186, 58, 38)')
            })
        cy.get('.skjemaelement__feilmelding').contains('Du må velge et alternativ')
        cy.get('.feiloppsummering')
            .should('have.css', 'background-color', 'rgb(255, 255, 255)')
            .should('have.css', 'border-color', 'rgb(186, 58, 38)')
            .within(() => {
                cy.contains('Det er 1 feil i skjemaet')
                cy.contains('Du må oppgi hvilke inntektskilder du har')
                    .click()
            })
        cy.focused().should('have.attr', 'name', arbeidstakerGradert.sporsmal[8].undersporsmal[0].undersporsmal[0].id)
    })

    it('CHECKBOX_GRUPPE feilmelding går bort', () => {
        cy.focused().click({ force: true })
        ingenFeilmeldinger()
    })
})
