import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button} from '../Button/Button';
import PropTypes from 'prop-types';
import classes from './modal.module.css';

class Modal extends Component {
    constructor(props) {
        super(props);
        this.continue = bind(this.continue, this);
        function bind(fn,ctx) {
            return function(args) {
                fn.call(ctx,args)
            }
        }
        this.ref = React.createRef();
    }

    continue() {
        const {data: {ingridients,totalPrice}} = this.props
        const queryParams = [];
        for(const ingridient of ingridients) {
            queryParams.push(encodeURIComponent(ingridient.name) + '=' + encodeURIComponent(ingridient.quantity))
        };
        queryParams.push('price' + "=" + totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: queryString
        });
    }
    render() {
        const {show, data,close} = this.props;
        const {ingridients, totalPrice} = data;
        let modal = null;
        if (show) {
            modal = <div className={classes.wrapper} ref={this.ref} onClick={(e) => {
                if (e.target !== this.ref.current) {
                    return
                }
                close();
            }}>
                        <div className={`${classes.modal}`} style={{
                            transform: show ? 'translateY(0)' : 'translateY(-100vh)',
                        }}>
                            <header className={classes.header}>Check your purchase</header>
                            <section className={classes.body}>
                                <p>Total price: {totalPrice.toFixed(2)}$</p>
                                <ul className={classes.list}>
                                    {ingridients
                                    .filter(el => el.quantity !== 0)
                                    .map(item => {
                                        return (
                                            <li className={classes.item}>{item.name}-<span>{item.quantity}</span></li>
                                        )
                                    })}
                                </ul>
                            </section>
                            <footer className={classes.footer}>
                                <Button click={close} styles={'cancel'} label={'Cancel'}/>
                                <Button click={this.continue} styles={'continue'} label={'Continue'}/>
                            </footer>
                        </div>
                    </div> 
        };
        return (
            <>
                {modal}
            </>
        );
    }
};

Modal.propTypes = {
    show: PropTypes.bool,
    close: PropTypes.func,
    data: PropTypes.object,
};

export default withRouter(Modal)