import React from 'react';
import PropTypes from 'prop-types'
import classes from './controls.module.css';

function Controls({add,remove,ingridients}) {
        return ingridients.map((ingridient,index) => {
            return (
                <div data-name={ingridient.name} className={classes.controlWrapper} key={index}>
                    <span className={classes.label}>{ingridient.name}</span>
                    <button className={classes.add} onClick={add} disabled={ingridient.disabledAdd}>Add</button>
                    <button className={classes.remove} onClick={remove} disabled={ingridient.disabledRemove}>Remove</button>
                </div>
            );
        })
};

Controls.propTypes = {
    add: PropTypes.func,
    remove: PropTypes.func,
    ingridients: PropTypes.arrayOf(PropTypes.shape({
        order: PropTypes.number,
        name: PropTypes.string,
        quantity: PropTypes.number,
        disabledAdd: PropTypes.bool
    }))
}

export default Controls;