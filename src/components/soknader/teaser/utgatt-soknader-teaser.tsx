import Alertstripe from 'nav-frontend-alertstriper'
import { HoyreChevron } from 'nav-frontend-chevron'
import ModalWrapper from 'nav-frontend-modal'
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi'
import React, { useState } from 'react'

import { RSSoknadstype } from '../../../types/rs-types/rs-soknadstype'
import { tilLesbarPeriodeMedArstall } from '../../../utils/dato-utils'
import { getLedetekst, tekst } from '../../../utils/tekster'
import { useAmplitudeInstance } from '../../amplitude/amplitude'
import Vis from '../../vis'
import { InngangsIkon, InngangsStatus } from '../inngang/inngangspanel'
import {
    hentIkon,
    hentIkonHover,
    hentTeaserStatustekst,
    periodeListevisning,
    SykepengesoknadTeaserProps
} from './teaser-util'

const UtgaattSoknaderTeaser = ({ soknad }: SykepengesoknadTeaserProps) => {
    const { logEvent } = useAmplitudeInstance()
    const [ aapen, setAapen ] = useState<boolean>(false)

    return (
        <article aria-labelledby={`soknader-header-${soknad.id}`} onClick={() => {
            logEvent('Velger søknad', { soknadstype: soknad.soknadstype })
        }}>
            <button className="inngangspanel inngangspanel__btn"
                onClick={() => setAapen(true)}>
                <div className="inngangspanel__del1">
                    <InngangsIkon
                        ikon={hentIkon(soknad)}
                        ikonHover={hentIkonHover(soknad)}
                    />
                    <div className="inngangspanel--inaktivt">
                        <Systemtittel tag="h3" className="inngangspanel__tittel">
                            {soknad.soknadstype === RSSoknadstype.OPPHOLD_UTLAND
                                ? tekst('soknad.utland.teaser.tittel')
                                : tekst('soknad.teaser.tittel')}
                        </Systemtittel>
                        <Vis hvis={soknad.soknadstype !== RSSoknadstype.OPPHOLD_UTLAND}>
                            <Normaltekst className="inngangspanel__periode">
                                {getLedetekst(tekst('soknad.teaser.periode'), {
                                    '%PERIODE%': tilLesbarPeriodeMedArstall(soknad.fom, soknad.tom),
                                })}
                            </Normaltekst>
                        </Vis>
                        {periodeListevisning(soknad)}
                    </div>
                </div>
                <div className="inngangspanel__del2">
                    <InngangsStatus status={soknad.status} tekst={hentTeaserStatustekst(soknad)} />
                    <HoyreChevron />
                </div>
            </button>
            <ModalWrapper className="modal__teaser_popup" onRequestClose={() => setAapen(false)}
                contentLabel={'planlagt'}
                isOpen={aapen}
            >
                <Systemtittel tag="h3" className="modal__tittel">
                    {tekst('soknad.teaser.utgaatt.popup.header')}
                </Systemtittel>
                <Alertstripe type="info">{tekst('soknad.teaser.utgaatt.popup.innhold')}</Alertstripe>
                <button className="knapp knapp--hoved" onClick={() => setAapen(false)}>
                    Lukk
                </button>
            </ModalWrapper>
        </article>
    )
}

export default UtgaattSoknaderTeaser
