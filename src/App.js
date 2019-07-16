import React, {useReducer, useEffect, useState} from 'react';
import { Button, Input } from './component'
import stateReducer, { USER_WANT_TO_CHECK_DOMAIN, USER_ADD_TO_CART , USER_REQUEST_TOKEN, ACTION_WAS_FIRED} from './reducer'
import { API_ENDPOINT, BASE_BODY } from "./constant";

const INITIAL_STATE = {
    cartId: null,
    isMounted: false,
    actionRequired: false,
    print: '',
    cart:{},
    request: {}
};

function App() {
    const [domainName, setDomainName] = useState('')
    const [extension, setExtension] = useState('fr')
    const [isLoading, setIsLoading] = useState(false)
    const [state, dispatch] = useReducer(stateReducer, INITIAL_STATE)

    const changeDomainName = (text) => {
        if(text.split('.').length > 1){
            // send error
        } else {
            setDomainName(text)
        }
    }
    const sendRequest = async (data) => {
        setIsLoading(true)
        dispatch({type: ACTION_WAS_FIRED})
        const {path, body, callBack} = data
        const raw = await fetch(API_ENDPOINT + path, body || BASE_BODY)
        const clean = await raw.json()
        console.log('OVH answer : ', clean)
        dispatch({type: callBack, payload: clean})
        setIsLoading(false)
    }

    useEffect(() => {
        if (state.actionRequired) {
            sendRequest(state.request)
        }
    }, [state.actionRequired])
    return (
        <div className="App" style={styles.wrapper}>
            <div style={styles.section}>
                <Button onClick={() => dispatch({type: USER_REQUEST_TOKEN})}>Load Token</Button>
            </div>
            <div style={styles.section}>
                <Input disabled={!state.cartId} value={domainName} onChange={e => changeDomainName(e.target.value)}
                       placeholder={'Saisir un nom de domaine'}/>
                       <select onChange={e => setExtension(e.target.value)}>
                           <option value={"fr"}>.FR</option>
                           <option value={"com"}>.COM</option>
                           <option value={"net"}>.NET</option>
                       </select>
                <Button onClick={() => dispatch({type: USER_WANT_TO_CHECK_DOMAIN, payload: {domainName, extension}})}>Check
                    avaibilities
                </Button>
            </div>
            <div style={styles.section}>
                <Button onClick={() => dispatch({type: USER_ADD_TO_CART, payload: { domainName, extension}})}>Ajouter au panier</Button>
            </div>
            <div>
                {state.print}
            </div>
            {
                isLoading && <div style={styles.loader}> Chargement en cours </div>
            }
        </div>
    );
}

const styles = {
    wrapper : {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#506c75',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loader: {
        width: 200,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 500,
        position: 'absolute',
        right: 50,
        top: 50,
        color: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    section:{
        border:'1px solid white',
        margin:10,
        borderRadius:4,
        padding:'5rem',
        minWidth:'50vw',
    }
}

export default App;