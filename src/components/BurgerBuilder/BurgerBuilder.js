import React, {Component} from 'react';
import Burger from '../Burger/Burger';
import Controls from '../Controls/Controls';
import TotalOrder from '../TotalOrder/TotalOrder';
import Modal from '../common/Modal/Modal';
import classes from './burgerBuilder.module.css';

const PRICES = {
    meat: 1.5,
    cheese: 0.5,
    salad: 0.7,
    bacon: 1,
}

class BurgerBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ingridients: [
                {   
                    order: 1,
                    name: 'salad',
                    quantity: 0,
                    disabledAdd: false,
                    disabledRemove: true,
                },
                {
                    order: 2,
                    name: 'bacon',
                    quantity: 0,
                    disabledAdd: false,
                    disabledRemove: true,
                },
                {
                    order: 3,
                    name: 'cheese',
                    quantity: 0,
                    disabledAdd: false,
                    disabledRemove: true,
                },
                {
                    order: 4,
                    name: 'meat',
                    quantity: 0,
                    disabledAdd: false,
                    disabledRemove: true,
                }
        ],
            totalPrice: 3,
            message: '',
            purchasing: false,
        }
        this.ref = React.createRef();
    }

    componentDidUpdate() {
        if (this.ref.current !== null) {
            setTimeout(() => {
                this.setState((prev) => {
                    const prevDisabled = prev.ingridients.filter(el => el.disabledAdd).map(el => {
                        return {
                            ...el,
                            disabledAdd: false,
                        }
                    });
                    const others = prev.ingridients.filter(el => !el.disabledAdd);
                    const updated = [...others,...prevDisabled].sort((a,b) => a.order - b.order);
                    return {
                        ...prev,
                        message: '',
                        ingridients: updated
                    }
                })
            },3000)
        }
    };

    /**
     * Добавление ингредиентов 
     */
    handleAddIngridient = (e) => {
        const currentIngridient = e.target.parentNode.dataset.name;
        const findInState = this.state.ingridients.find(el => el.name === currentIngridient);
        if(this.limitIngridient(findInState)) {
            return;
        }
        findInState.quantity++;
        findInState.disabledRemove = false;
        const currentIngridientPrice = PRICES[findInState.name];
        this.setState((prev) => {
            const other = prev.ingridients.filter(el => el.name !== currentIngridient);
            const updated = [...other,findInState].sort((a,b) => a.order - b.order);
            return {
                ...prev,
                totalPrice: prev.totalPrice + currentIngridientPrice,
                ingridients: updated
            }
        });
    };

    /**
     * Удаление ингридиентов
     */
    handleRemoveIngridient = (e) => {
        const currentIngridient = e.target.parentNode.dataset.name;
        const findInState = this.state.ingridients.find(el => el.name === currentIngridient);
        findInState.quantity--;
        const currentIngridientPrice = PRICES[findInState.name];
        if (findInState.quantity < 1) {
            findInState.disabledRemove = true;
            this.setState((prev) => {
                const other = prev.ingridients.filter(el => el.name !== currentIngridient);
                const updated = [...other,findInState].sort((a,b) => a.order - b.order);
                return {
                    ...prev,
                    totalPrice: prev.totalPrice - currentIngridientPrice,
                    ingridients: updated
                }
            })
            return;
        };
        this.setState((prev) => {
            const other = prev.ingridients.filter(el => el.name !== currentIngridient);
            const updated = [...other,findInState].sort((a,b) => a.order - b.order);
            return {
                ...prev,
                totalPrice: prev.totalPrice - currentIngridientPrice,
                ingridients: updated
            }
        });
    }

    limitIngridient = (ingridient) => {
        if(ingridient.quantity === 3) {
            ingridient.disabledAdd = true;
            this.setState((prev) => {
                const other = prev.ingridients.filter(el => el.name !== ingridient.name);
                const updated = [...other,ingridient].sort((a,b) => a.order - b.order);
                return {
                    ingridients: updated,
                    message: `You can't add more than 3 pieces of ${ingridient.name}`,
                }
            });
            return true;
        } else {
            return false;
        }
    }

    handleOpenPurchaseModal = () => {
        this.setState({purchasing: true})
    }

    handleClosePurchaseModal = () => {
        this.setState({purchasing: false})
    }

    render() {
        let messageBlock = null;
        if (this.state.message !== '') {
            messageBlock = <p ref={this.ref} className={classes.message}>{this.state.message}</p>
        };
        return (
            <div className={classes.lol}>
                {messageBlock}
                <Modal 
                show={this.state.purchasing}
                close={this.handleClosePurchaseModal}
                data={{
                    ingridients: this.state.ingridients,
                    totalPrice: this.state.totalPrice,
                }}/>
                <Burger ingridients={this.state.ingridients} calculateScroll={true}/>
                <div className={classes.controlsWrapper}>
                    <div className={classes.controlsWrapperInner}>
                        <p className={classes.currentPrice}>Current price: {this.state.totalPrice.toFixed(2)}$</p>
                        <Controls
                        ingridients={this.state.ingridients}
                        add={this.handleAddIngridient}
                        remove={this.handleRemoveIngridient}/>
                        <TotalOrder open={this.handleOpenPurchaseModal}/>
                    </div>
                </div>
            </div>
        )
    }
};

export default BurgerBuilder;