import { Normaltekst } from 'nav-frontend-typografi'
import React from 'react'
import { useFormContext } from 'react-hook-form'

import { Sporsmal } from '../../types/types'
import { hentFeilmelding } from '../sporsmal/sporsmal-utils'
import Vis from '../vis'

interface FeilProps {
    sporsmal: Sporsmal;
}

const FeilLokal = ({ sporsmal }: FeilProps) => {
    const { errors } = useFormContext()
    const feilmelding = hentFeilmelding(sporsmal, errors[sporsmal.id])

    return (
        <div role="alert" aria-live="assertive">
            <Vis hvis={errors[sporsmal.id]}>
                <Normaltekst tag="span" className="skjemaelement__feilmelding">
                    {feilmelding.lokal}
                </Normaltekst>
            </Vis>
        </div>
    )
}

export default FeilLokal
