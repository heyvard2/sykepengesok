import { Sporsmal } from '../types';
import { RSSvar } from './rs-svar';
import { RSSvartype } from './rs-svartype';
import { RSVisningskriterie } from './rs-visningskriterie';

export interface RSSporsmal {
    id: string;
    tag: string;
    sporsmalstekst: string;
    undertekst: string;
    svartype: RSSvartype;
    min: string;
    max: string;
    pavirkerAndreSporsmal: boolean;
    kriterieForVisningAvUndersporsmal: RSVisningskriterie;
    svar: RSSvar[];
    undersporsmal: RSSporsmal[];
}

export function sporsmalToRS(sporsmal: Sporsmal): RSSporsmal {
    return rsSporsmalMapping(sporsmal);
}

const rsSporsmalMapping = (sporsmal: Sporsmal): RSSporsmal => {
    const rsSporsmal = {} as RSSporsmal;
    rsSporsmal.id = sporsmal.id;
    rsSporsmal.tag = sporsmal.tag.toString() + tagIndexEllerBlank(sporsmal.tagIndex as any);
    rsSporsmal.sporsmalstekst = (sporsmal.sporsmalstekst === '' ? null : sporsmal.sporsmalstekst) as any;
    rsSporsmal.undertekst = sporsmal.undertekst;
    rsSporsmal.svartype = sporsmal.svartype;
    rsSporsmal.min = sporsmal.min;
    rsSporsmal.max = sporsmal.max;
    rsSporsmal.pavirkerAndreSporsmal = sporsmal.pavirkerAndreSporsmal;
    rsSporsmal.kriterieForVisningAvUndersporsmal = rsVisningskriterie(sporsmal.kriterieForVisningAvUndersporsmal) as any;
    rsSporsmal.svar = sporsmal.svarliste.svar;
    if (sporsmal.undersporsmal) {
        rsSporsmal.undersporsmal = sporsmal.undersporsmal.map((uspm: Sporsmal) => { return rsSporsmalMapping(uspm) });
    }
    else {
        rsSporsmal.undersporsmal = [];
    }
    return rsSporsmal;
};

const tagIndexEllerBlank = (tagIndex: number) => {
    if (tagIndex === undefined) return '';
    return `_${tagIndex}`;
};

const rsVisningskriterie = (kriterieForVisningAvUndersporsmal: string) => {
    if(kriterieForVisningAvUndersporsmal as keyof typeof RSVisningskriterie) {
        return RSVisningskriterie[kriterieForVisningAvUndersporsmal as keyof typeof RSVisningskriterie];
    }
    return null;
};
