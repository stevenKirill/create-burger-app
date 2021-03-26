import React, {Component} from 'react';
import {Loader} from '../../components/common/Loader/Loader';
import axios from '../../API/axios-orders';
import classes from './orders.module.css';
import {withErrorBoundary} from '../../hoc/withError';

export class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            loading: false,
            error: '',
        }
    };

    componentDidMount() {
        this.setState({loading: true})
        const signData = JSON.parse(localStorage.getItem('signData'));
        const queryParams =`?auth=${signData.token}&orderBy="userId"&equalTo="${signData.id}"`;
        axios.get('/orders.json' + queryParams)
        .then((response) => {
            const orders = response.data;
            const array = [];
            for(let orderItem in orders) {
                const tmp = {};
                tmp.id = orderItem;
                tmp.order = orders[orderItem];
                array.push(tmp)
            }
            this.setState((prev) => {
                return {
                    ...prev,
                    loading: false,
                    orders: prev.orders.concat(array)
                }
            })
        })
        .catch((err) => {
            console.error(err)
            this.setState((prev) => {
                return {
                    ...prev,
                    loading: false,
                    error: "Ошибка запроса",
                };
            })
        })
    };
    
    /* Функция рендеринга заказов */
    renderOrdres = (orders) => {
        return orders.map((order) => {
            const {id, order: {ingridients, totalPrice, userData}} = order;
            return (
                <div key={id} className={classes.order}>
                    <div className={classes.rowContainer}>
                        <div className={classes.row}>
                        <label className={classes.label}>Ingridients</label>
                        {ingridients.map((ingridient, idx) => {
                            const k = id + idx;
                            return (
                                <div key={k}>
                                    <span>{ingridient.name} -</span>
                                    <span> {ingridient.quantity}</span>
                                </div>
                            );
                        })}
                        </div>
                        <div className={classes.row}>
                            <label className={classes.label}>Price:</label>
                            <div className={classes.price}>{totalPrice}</div>
                        </div>
                        <div className={classes.row}>
                            <label className={classes.label}>User:</label>
                            <div className={classes.user}>{userData.userName}</div>
                        </div>
                    </div>
                </div>
            )
        })
    };
    
    /**Функция рендеринга ошибки */
    renderError = (errorMsg) => {
        return <div className={classes.error}>{errorMsg}</div>
    };
    /*Функция рендеринга когда нету данных */
    renderEmpty = () => {
        return (
            <div className={classes.noData}>No data</div>
        );
    };

    render() {
        const {loading, orders, error} = this.state;
        let component = null;
        if (loading) {
            component = <div className={classes.loaderWrapper}><Loader/></div> 
        } else {
            // если ошибка рендерим ее
            if (error.length !== 0) {
                component = this.renderError(error)
            } else {
                // если данных нет тогда не рендерим
                component = orders.length === 0 ? this.renderEmpty() : this.renderOrdres(orders);
            }
        }
        return (
            <div>
                <h1 className={classes.header}>Orders Page</h1>
                {component}
            </div>
        );
    }
};

export default withErrorBoundary(Orders);