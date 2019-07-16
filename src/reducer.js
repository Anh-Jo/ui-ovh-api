import React from 'react'
import { BASE_BODY} from "./constant";

export default (state, action) => {
    const {type, payload} = action
    switch (type) {
        case ACTION_WAS_FIRED : {
            console.log('Reducer : ACTION_WAS_FIRED')
            return {...state, actionRequired: false}
        }
        case USER_REQUEST_TOKEN : {
            console.log('Reducer : USER_REQUEST_TOKEN')
            const body = {...BASE_BODY, method: 'POST', body: JSON.stringify({ovhSubsidiary: 'FR'})}
            return {
                ...state,
                request: {
                    body,
                    path: '/order/cart',
                    callBack: OVH_ANSWER_TOKEN
                },
                actionRequired: true
            }
        }
        case OVH_ANSWER_TOKEN : {
            console.log('Reducer : OVH_ANSWER_TOKEN')
            return {...state, cartId: payload.cartId}
        }
        case USER_WANT_TO_CHECK_DOMAIN : {
            console.log('Reducer : USER_WANT_TO_CHECK_DOMAIN')
            return {
                ...state,
                actionRequired: true,
                request: {
                    path: `/order/cart/${state.cartId}/domain?domain=${payload.domainName}.${payload.extension}`,
                    callBack: OVH_ANSWER_DOMAIN_CHECK
                },
            }
        }
        case OVH_ANSWER_DOMAIN_CHECK : {
            if(payload.length === 0) return state
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
        case USER_ADD_TO_CART : {
            const { domainName, extension }  = payload
            const body = { ...BASE_BODY, method:'POST', body: JSON.stringify({ domain : domainName + '.' + extension})}
            return {
                ...state,
                actionRequired: true,
                request: {
                    path: `/order/cart/${state.cartId}/domain`,
                    callBack: USER_VALIDATE_ORDER,
                    body
                },
            }
        }
        case USER_VALIDATE_ORDER : {
            return state
        }
        default:
            return state
    }
}

export const ACTION_WAS_FIRED = 'ACTION_WAS_FIRED'
export const USER_REQUEST_TOKEN = 'USER_REQUEST_TOKEN'
export const USER_WANT_TO_CHECK_DOMAIN = 'USER_WANT_TO_CHECK_DOMAIN'
export const USER_ADD_TO_CART = 'USER_ADD_TO_CART'
export const USER_VALIDATE_ORDER = 'USER_VALIDATE_ORDER'
export const OVH_ANSWER_DOMAIN_CHECK = 'OVH_ANSWER_DOMAIN_CHECK'
export const OVH_ANSWER_TOKEN = 'OVH_ANSWER_TOKEN'
