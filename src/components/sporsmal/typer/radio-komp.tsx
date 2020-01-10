import React, { useEffect, useState } from 'react';
import { SpmProps } from '../sporsmal-form/sporsmal-form';
import { RSSvartype } from '../../../types/rs-types/rs-svartype';
import { hentSvar } from '../sporsmal-utils';
import { useFormContext } from 'react-hook-form';
import Vis from '../../../utils/vis';
import { Normaltekst } from 'nav-frontend-typografi';
import AnimateOnMount from '../../animate-on-mount';
import UndersporsmalListe from '../undersporsmal/undersporsmal-liste';

const RadioKomp = ({ sporsmal }: SpmProps) => {
    const [ lokal, setLokal ] = useState<string>();
    const { register, setValue, errors } = useFormContext();

    useEffect(() => {
        const lagret = hentSvar(sporsmal);
        setValue(sporsmal.id, lagret);
        setLokal(lagret);
    }, [ sporsmal, setValue ]);

    const changeValue = (value: string) => {
        setValue(sporsmal.id, value);
        setLokal(lokal === value ? '' : value);
    };

    return (
        <>
            <Vis hvis={sporsmal.sporsmalstekst !== null}>
                <div className="skjema__sporsmal">
                    <Normaltekst tag="span">{sporsmal.sporsmalstekst}</Normaltekst>
                </div>
            </Vis>

            <div className={erHorisontal(sporsmal.svartype)
                ? 'skjemaelement skjemaelement--horisontal'
                : 'skjemaelement'}
            >
                {sporsmal.undersporsmal.map((uspm, idx) => {
                    return (
                        <div className="radioContainer" key={idx}>
                            <input type="radio"
                                id={uspm.id}
                                name={sporsmal.id}
                                value={uspm.sporsmalstekst}
                                checked={lokal === uspm.sporsmalstekst}
                                aria-checked={lokal === uspm.sporsmalstekst}
                                onChange={() => changeValue(uspm.sporsmalstekst)}
                                ref={register({ required: 'Et alternativ må velges' })}
                                className="skjemaelement__input radioknapp"
                            />
                            <label className="skjemaelement__label" htmlFor={uspm.id}>
                                {uspm.sporsmalstekst}
                            </label>

                            <AnimateOnMount
                                mounted={lokal === uspm.sporsmalstekst}
                                enter="undersporsmal--vis"
                                leave="undersporsmal--skjul"
                                start="undersporsmal"
                            >
                                <UndersporsmalListe undersporsmal={uspm.undersporsmal} />
                            </AnimateOnMount>
                        </div>
                    )
                })}
            </div>

            <div role="alert" aria-live="assertive">
                <Vis hvis={errors[sporsmal.id] !== undefined}>
                    <Normaltekst tag="span" className="skjemaelement__feilmelding">
                        {errors[sporsmal.id] && errors[sporsmal.id].message}
                    </Normaltekst>
                </Vis>
            </div>
        </>
    )
};

export default RadioKomp;

export const erHorisontal = (svartype: RSSvartype) => {
    return svartype === RSSvartype.RADIO_GRUPPE_TIMER_PROSENT;
};
