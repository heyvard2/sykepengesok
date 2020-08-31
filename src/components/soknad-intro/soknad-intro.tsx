import './soknad-intro.less'

import parser from 'html-react-parser'
import ModalWrapper from 'nav-frontend-modal'
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi'
import Veilederpanel from 'nav-frontend-veilederpanel'
import React, { useState } from 'react'

import { tekst } from '../../utils/tekster'
import ForsteSoknadSvg from './soknad-intro-svg'

const SoknadIntro = () => {

    const [ aapen, setAapen ] = useState<boolean>(false)

    return (<>
        <div className="soknad-intro">
            <div className="blokk-s">
                <Veilederpanel kompakt svg={<ForsteSoknadSvg />}>
                    <Normaltekst tag="h2" className="panel__tittel sist">
                        {parser(tekst('sykepengesoknad.soknad-intro.personvern'))}
                        <p className="sist">
                            <button className="lenke no-border"
                                onClick={() => setAapen(true)}>
                                {tekst('sykepengesoknad.soknad-intro.personvern-les-mer')}
                            </button>
                        </p>
                    </Normaltekst>
                </Veilederpanel>
            </div>
        </div>
        <ModalWrapper className={'personvern-modal'} onRequestClose={() => setAapen(false)}
            contentLabel={'Personvern'}
            isOpen={aapen}
        >
            <Systemtittel tag="h3" className="modal__tittel">
                {tekst('sykepengesoknad.soknad-intro.personvern-modal-header')}
            </Systemtittel>
            {parser(tekst('sykepengesoknad.soknad-intro.personvern-modal-innhold'))}


            <div className={'lukk-wrapper'}>
                <button type="button" className="no-border lenke" onClick={() => setAapen(false)}
                >
                    <Normaltekst tag="span">Lukk</Normaltekst>
                </button>
            </div>


        </ModalWrapper>
    </>
    )
}

export default SoknadIntro
