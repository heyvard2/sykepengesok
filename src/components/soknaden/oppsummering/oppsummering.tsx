import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { useAppStore } from '../../../data/stores/app-store';
import { RSSvartype } from '../../../types/rs-types/rs-svartype';
import tekster from './oppsummering-tekster';
import './oppsummering.less';
import { Sporsmal } from '../../../types/types';
import CheckboxSum from './utdrag/checkbox-sum';
import JaEllerNei from './utdrag/ja-eller-nei';
import DatoSum from './utdrag/dato-sum';
import PerioderSum from './utdrag/perioder-sum';
import Fritekst from './utdrag/fritekst';
import LandSum from './utdrag/land-sum';
import UndertekstSum from './utdrag/undertekst-sum';
import CheckboxGruppe from './utdrag/checkbox-gruppe';
import TallSum from './utdrag/tall-sum';
import RadioGruppe from './utdrag/radio-gruppe';

export interface OppsummeringProps {
    sporsmal: Sporsmal;
}

const Oppsummering = () => {
    const { valgtSoknad } = useAppStore();

    return (
        <Ekspanderbartpanel apen={true} tittel={tekster['oppsummering.tittel']} tittelProps="element">
            {valgtSoknad.sporsmal
                .filter((sporsmal) => {
                    return (sporsmal.svar.length > 0 || sporsmal.undersporsmal.length > 0 || sporsmal.svartype === RSSvartype.IKKE_RELEVANT);
                })
                .map((sporsmal) => {
                    return (
                        <div className="oppsummering__seksjon">
                            <SporsmalVarianter sporsmal={sporsmal}/>
                        </div>
                    )
                })
            }
        </Ekspanderbartpanel>
    );
};

export default Oppsummering;

export const SporsmalVarianter = ({ sporsmal }: OppsummeringProps) => {
    switch (sporsmal.svartype) {
        case RSSvartype.CHECKBOX_PANEL:
        case RSSvartype.CHECKBOX: {
            return <CheckboxSum sporsmal={sporsmal}/>;
        }
        case RSSvartype.JA_NEI: {
            return <JaEllerNei sporsmal={sporsmal}/>;
        }
        case RSSvartype.DATO: {
            return <DatoSum sporsmal={sporsmal}/>;
        }
        case RSSvartype.PERIODER: {
            return <PerioderSum sporsmal={sporsmal}/>;
        }
        case RSSvartype.FRITEKST: {
            return <Fritekst sporsmal={sporsmal}/>;
        }
        case RSSvartype.LAND: {
            return <LandSum sporsmal={sporsmal}/>;
        }
        case RSSvartype.IKKE_RELEVANT: {
            return <UndertekstSum sporsmal={sporsmal}/>;
        }
        case RSSvartype.CHECKBOX_GRUPPE: {
            return (<CheckboxGruppe sporsmal={sporsmal}/>);
        }
        case RSSvartype.TALL:
        case RSSvartype.PROSENT:
        case RSSvartype.TIMER: {
            return <TallSum sporsmal={sporsmal}/>;
        }
        case RSSvartype.RADIO_GRUPPE_TIMER_PROSENT:
        case RSSvartype.RADIO_GRUPPE: {
            return <RadioGruppe sporsmal={sporsmal}/>;
        }
        default: {
            return null;
        }
    }
};
