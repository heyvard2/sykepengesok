import React from 'react';
import cls from 'classnames';
import SoknadHeader from './soknad-header';
import { Soknad, Sykmelding } from '../types/types';

interface AvbruttSoknadArbeidstakerProps {
    soknad: Soknad,
    sykmelding?: Sykmelding
}

const AvbruttSoknadArbeidstaker = ({ soknad, sykmelding }: AvbruttSoknadArbeidstakerProps) => {
    const classNames = cls('panel statuspanel statuspanel--enKol');
    if (!sykmelding) {
        // TODO: State må settes når dineSykmeldinger hentes
        /*
                sykmelding = state.dineSykmeldinger.data.find((sykmld) => {
                    return sykmld.id === soknad.sykmeldingId;
                })
        */
    }
    return (
        <>
            <SoknadHeader soknad={soknad}/>
{/*
            <div className={classNames}>
                <Statusopplysninger>
                    <SykmeldingNokkelOpplysning className="nokkelopplysning--statusopplysning" overskrift="h2"
                        tittel={tekster['statuspanel.status']}
                    >
                        <p>{tekster['sykepengesoknad.status.AVBRUTT']}</p>
                    </SykmeldingNokkelOpplysning>
                    <SykmeldingNokkelOpplysning tittel="Dato avbrutt">
                        <p>{tilLesbarDatoMedArstall(soknad.avbruttDato)}</p>
                    </SykmeldingNokkelOpplysning>
                </Statusopplysninger>
                <GjenapneSoknad soknad={soknad}/>
            </div>
            <SykmeldingUtdrag sykmelding={sykmelding} erApen/>
*/}
        </>
    );
};

export default AvbruttSoknadArbeidstaker;
