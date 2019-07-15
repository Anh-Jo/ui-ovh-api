import React from 'react'


export const Button = ({ children, ...props}) => (
    <button {...props} style={{ borderRadius:4, padding:'10px 20px', margin:5}}>{children}</button>
)

export const Input = ({children, ...props}) => (
    <input {...props} style={{ borderRadius: 4, padding: '10px 20px', margin: 5, color: 'black'}}>{children}</input>
)