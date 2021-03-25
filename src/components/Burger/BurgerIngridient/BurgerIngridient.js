import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classes from './burgerIngridient.module.css';

class BurgerIngridient extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let ingridient = null;
        switch(this.props.ingridientType) {
            case 'meat':
                ingridient = <div className={classes.meat}></div>
                break;
            case 'cheese':
                ingridient = <div className={classes.cheese}></div>
                break;
            case 'salad':
                ingridient = <div className={classes.salad}></div>
                break;
            case 'bread-top':
                const seeds = [];
                const top = [5,10,17,22,26,29];
                const left = [20,50,100,150,200,250,337,385,428];
                for(let i = 0; i < 10; i++) {
                    const seed = <div className={classes.seeds} style={{
                        top: `${top[Math.floor(Math.random() * top.length)]}px`,
                        left: `${left[Math.floor(Math.random() * left.length)]}px`,
                    }}></div>
                    seeds.push(seed);
                }
                ingridient = <div className={classes.breadTop}>
                    <div className={classes.seeds}>{seeds}</div>
                </div>
                break;
            case 'bread-bottom':
                ingridient = <div className={classes.breadBottom}></div>
                break;
            case 'bacon':
                ingridient = <div className={classes.bacon}></div>
                break;
        }
        return ingridient;
    }
}

BurgerIngridient.propTypes = {
    ingridientType: PropTypes.string
}

export default BurgerIngridient;