import React from 'react';
import classes from './Button.module.css';

export const Button = (props) => {
    const getStyles = () => {
        let finalStyle = '';
        const {styles} = props;
        if(Array.isArray(styles)) {
            for(const s of styles) {
                finalStyle += `${classes[s]} `;
            }
        } else {
            finalStyle = classes[props.styles];
        }
        return finalStyle;
    }
    
    return (
        <button className={getStyles()} onClick={props.click}>{props.label}</button>
    );
}