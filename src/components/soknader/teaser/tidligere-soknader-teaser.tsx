import dayjs from 'dayjs';
import React from 'react';
import { RSSoknadstype } from '../../../types/rs-types/rs-soknadstype';
import { InngangsHeader, InngangsIkon, Inngangspanel } from '../inngang/inngangspanel';
import Vis from '../../vis';
import { getLedetekst, tekst } from '../../../utils/tekster';
import { tilLesbarPeriodeMedArstall } from '../../../utils/dato-utils';
import { Normaltekst } from 'nav-frontend-typografi';
import { HoyreChevron } from 'nav-frontend-chevron';
import { useAmplitudeInstance } from '../../amplitude/amplitude';
import {
    beregnUndertekst,
    hentIkon,
    hentIkonHover,
    hentTeaserStatustekst,
    SykepengesoknadTeaserProps
} from './teaser-util';

const TidligereSoknaderTeaser = ({ soknad }: SykepengesoknadTeaserProps) => {
    const { logEvent } = useAmplitudeInstance();
    const undertekst = beregnUndertekst(soknad);

    return (
        <article aria-labelledby={`soknader-header-${soknad.id}`} onClick={() => {
            logEvent('Velger søknad', { soknadstype: soknad.soknadstype });
        }}>
            <Inngangspanel to={`/kvittering/${soknad.id}`}>
                <InngangsIkon
                    ikon={hentIkon(soknad.soknadstype)}
                    ikonHover={hentIkonHover(soknad.soknadstype)}
                />
                <HoyreChevron />
                <div className='inngangspanel__innhold'>
                    <InngangsHeader
                        meta={ getLedetekst(tekst('soknad.teaser.dato'), {
                            '%DATO%': dayjs(soknad.opprettetDato).format('DD.MM.YYYY'),
                        })}
                        tittel={soknad.soknadstype === RSSoknadstype.OPPHOLD_UTLAND
                            ? tekst('soknad.utland.teaser.tittel')
                            : tekst('soknad.teaser.tittel')}
                        status={hentTeaserStatustekst(soknad)}
                    />
                    <Vis hvis={soknad.soknadstype !== RSSoknadstype.OPPHOLD_UTLAND}>
                        <Normaltekst className='inngangspanel__tekst'>
                            {getLedetekst(tekst('soknad.teaser.tekst'), {
                                '%PERIODE%': tilLesbarPeriodeMedArstall(soknad.fom, soknad.tom),
                            })}
                        </Normaltekst>
                    </Vis>
                    <Vis hvis={undertekst !== undefined}>
                        <Normaltekst className='inngangspanel__undertekst'>
                            {undertekst}
                        </Normaltekst>
                    </Vis>
                </div>
            </Inngangspanel>
        </article>
    );
};

export default TidligereSoknaderTeaser;
