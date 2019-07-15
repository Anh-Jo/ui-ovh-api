import React, {useReducer, useEffect, useState} from 'react';
import { Button, Input } from './component'
const API_ENDPOINT = 'https://eu.api.ovh.com/1.0'
const INITIAL_STATE = {
    cartId: null,
    isMounted: false,
    actionRequired: false,
    print: '',
    request: {
        path: ''
    }
};

function App() {
    const [domainName, setDomainName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [state, dispatch] = useReducer(stateReducer, INITIAL_STATE)

    const sendRequest = async (data) => {
        setIsLoading(true)
        dispatch({type: 'ACTION_WAS_FIRED'})
        const {path, body, callBack} = data
        const raw = await fetch(API_ENDPOINT + path, body || BASE_BODY)
        const clean = await raw.json()
        console.log('sendRequest answer : ', clean)
        dispatch({type: callBack, payload: clean})
        setIsLoading(false)
    }

    useEffect(() => {
        if (state.actionRequired) {
            sendRequest(state.request)
        }
    }, [state.actionRequired])

    return (
        <div className="App" style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: '#506c75',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Button onClick={() => dispatch({type: 'USER_REQUEST_TOKEN'})}>Load Token</Button>
            <div>
                <Input disabled={!state.cartId} value={domainName} onChange={e => setDomainName(e.target.value)}
                       placeholder={'Saisir un nom de domaine'}/>
                <Button onClick={() => dispatch({type: 'USER_WANT_TO_CHECK_DOMAIN', payload: {domainName}})}>Check
                    avaibilities
                </Button>
            </div>
            <div>
                {state.print}
            </div>
            {
                isLoading && <div style={{
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
                }}> Chargement en cours </div>
            }
        </div>
    );
}

const BASE_BODY = {
    headers: {
        "Content-type": "application/json"
    }
}


const stateReducer = (state, action) => {
    const {type, payload} = action
    switch (type) {
        case 'ACTION_WAS_FIRED' : {
            console.log('Reducer : ACTION_WAS_FIRED')
            return {...state, actionRequired: false}
        }
        case 'USER_REQUEST_TOKEN': {
            console.log('Reducer : USER_REQUEST_TOKEN')
            const body = {...BASE_BODY, method: 'POST', body: JSON.stringify({ovhSubsidiary: 'FR'})}
            return {
                ...state,
                request: {
                    body,
                    path: '/order/cart',
                    callBack: 'OVH_ANSWER_TOKEN'
                },
                actionRequired: true
            }
        }
        case 'OVH_ANSWER_TOKEN' : {
            console.log('Reducer : OVH_ANSWER_TOKEN')
            return {...state, cartId: payload.cartId}
        }
        case 'USER_WANT_TO_CHECK_DOMAIN' : {
            console.log('Reducer : USER_WANT_TO_CHECK_DOMAIN')
            return {
                ...state,
                actionRequired: true,
                request: {
                    path: `/order/cart/${state.cartId}/domain?domain=${payload.domainName}`,
                    callBack: 'OVH_ANSWER_DOMAIN_CHECK'
                },
            }
        }
        case 'OVH_ANSWER_DOMAIN_CHECK': {
            const [data] = payload
            switch (data.action) {
                case 'create' :
                    return {...state, print: "Domaine disponible."}
                case 'transfer':
                    return {...state, print: "Domaine déjà existant, nécessite un transfert."}
                default:
                    return {...state, print: 'error ..'}
            }
        }
        default:
            return state
    }
}


export default App;