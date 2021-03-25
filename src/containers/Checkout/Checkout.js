import React, {Component} from 'react';
import Burger from '../../components/Burger/Burger';
import {Button} from '../../components/common/Button/Button';
import {Route} from 'react-router-dom';
import ContactData from '../../components/ContactData/ContactData';
import classes from './Checkout.module.css'

export default class Checkout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ingridients: [],
            noIngridients: false,
            totalPrice: '',
        }
    };

    componentDidMount() {
        const {location: {search}} = this.props;
        if (search === '') {
            this.setState({noIngridients: true});
            return;
        }
        const withoutQuestion = search.slice(1);
        const ingridients = withoutQuestion.split('&');
        const burgerIngridients = [];
        let price = '';
        for(const ing of ingridients) {
            const eachIngridient = {};
            const separate = ing.split('=');
            if(separate[0] === 'price') {
                price = separate[1];
                continue;
            }
            eachIngridient.name = separate[0];
            eachIngridient.quantity = separate[1]
            burgerIngridients.push(eachIngridient);
        };
        this.setState({
            ingridients: burgerIngridients,
            totalPrice: `${price}$`
        });
    }

    cancel = () => {
        this.props.history.goBack();
    };

    continue = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render() {
        const {ingridients, noIngridients} = this.state;
        return (
            <React.Fragment>
                <h1 className={classes.header}>Checkout Page</h1>
                {noIngridients && 
                <p className={classes.empty}>
                    You haven't added any ingridient yet.
                    <p>Start adding in burger builder section and then press Order button</p>
                </p>}
                {!noIngridients &&
                <div>
                    <Burger ingridients={ingridients} calculateScroll={false}/>
                    <div className={classes.buttons}>
                        <Button click={this.cancel} styles={'cancel'} label={'Cancel'}/>
                        <Button click={this.continue} styles={'continue'} label={'Continue'}/>
                    </div>
                </div>
                }
                <Route 
                path={this.props.match.path + '/contact-data'} 
                render={() => <ContactData ingridients={ingridients} totalPrice={this.state.totalPrice}/>}/>
            </React.Fragment>
        )
    }
}