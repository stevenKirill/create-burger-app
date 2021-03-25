import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classes from './burger.module.css';
import BurgerIngridient from './BurgerIngridient/BurgerIngridient';

class Burger extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidUpdate() {
        if(!this.props.calculateScroll) {
            this.ref.current.classList.remove(classes.maxBurgerHeight);
            return
        }
        if (this.ref.current !== null) {
            const {offsetHeight} = this.ref.current;
            if (offsetHeight > 270) {
                this.ref.current.classList.add(classes.scrollable)
            } else {
                if (this.ref.current.classList.contains(classes.scrollable)) {
                    this.ref.current.classList.remove(classes.scrollable)
                }
            }
        }
    }

    render() {
        const {ingridients} = this.props;
        const allZero = ingridients.every(ingridient => ingridient.quantity === 0);
        let customIngridients = null;
        if (allZero) {
            customIngridients = <p className={classes.startAdding}>Start adding ingridients!</p>
        } else {
            customIngridients = ingridients.map(ingridient => {
                if (ingridient.quantity === 0) {
                    return;
                }
                let foodType = [];
                for(let i = 0; i < ingridient.quantity; i++) {
                    foodType.push(<BurgerIngridient ingridientType={ingridient.name}/>)
                }
                return foodType;
            }).reduce((acc,curr) => {
                return acc.concat(curr);
            },[])
        };
        const burgerClasses = [classes.burger,classes.maxBurgerHeight].join(' ');
        return (
            <div>
                <div className={burgerClasses} ref={this.ref}>
                    <BurgerIngridient ingridientType="bread-top"/>
                        {customIngridients}
                    <BurgerIngridient ingridientType="bread-bottom"/>
                </div>
            </div>
        )
    }
}

Burger.propTypes = {
    ingridients: PropTypes.arrayOf(PropTypes.object)
}

export default Burger;