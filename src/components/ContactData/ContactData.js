import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button} from '../common/Button/Button';
import {Loader} from '../common/Loader/Loader';
import {Input} from '../common/Input/Input';
import axios from '../../API/axios-orders';
import classes from './contactData.module.css';

class ContactData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userData: {
                userName: '',
                city: '',
                street: '',
                contactlessDelivery: false,
                paymentType: 'Cash',
            },
            errors: {
                userName: '',
                city: '',
                street: '',
            },
            valid: true,
        };
    };

    /** Функция обработчик формы отправка на сервер. */
    handleSendData = (event) => {
        event.preventDefault();
        const {userData} = this.state;
        const {ingridients, totalPrice} = this.props;
        const validData = this.validate(userData);
        if (!validData) {
            this.setState((prev) => {
                return {
                    ...prev,
                    valid: false,
                }
            })
            return;
        } else {
            this.setState({loading: true, valid: true});
            const signData = JSON.parse(localStorage.getItem('signData'));
            const order = {
                ingridients: ingridients || [],
                totalPrice: totalPrice || '',
                userData: userData || {},
                userId: signData.id || '',
            };
            const {history} = this.props;
            axios.post('/orders.json?auth=' + signData.token, order)
            .then((response) => {
                this.setState({loading: false});
                history.replace('/orders');
            })
            .catch((error) => {
                console.log(error)
                this.setState({loading: false});
                history.replace('/orders');
            })
        }

    }
    /**
     * 
     * @param {object} userData данные заказа 
     * @returns считает корректные поля если все корреткны то вернет макс количество полей если нет тогда вернет false
     */
    validate = (userData) => {
        let countValid = 0;
        const {userName,city,street} = userData;
        if(!this.validateField(userName,3,10)) {
            this.setState((prev) => {
                return {
                    ...prev,
                    errors: {
                        ...prev.errors,
                        userName: 'Incorrect name, should contain at least 3 symbols, max 10',
                    }
                }
            });
        } else {
            countValid++;
            this.setState((prev) => {
                return {
                    ...prev,
                    errors: {
                        ...prev.errors,
                        userName: '',
                    }
                }
            });
        };
        if(!this.validateField(city,5,12)) {
            this.setState((prev) => {
                return {
                    ...prev,
                    errors: {
                        ...prev.errors,
                        city: 'Incorrect city input length, min value is 5 max is 12',
                    }
                }
            });
        } else {
            countValid++;
            this.setState((prev) => {
                return {
                    ...prev,
                    errors: {
                        ...prev.errors,
                        city: '',
                    }
                }
            });
        };
        if(!this.validateField(street,5,12)) {
            this.setState((prev) => {
                return {
                    ...prev,
                    errors: {
                        ...prev.errors,
                        street: 'Incorrect street, min should be 5 symbols, max 12',
                    }
                }
            });
        } else {
            countValid++;
            this.setState((prev) => {
                return {
                    ...prev,
                    errors: {
                        ...prev.errors,
                        street: '',
                    }
                }
            });
        };
        return countValid === 3;
    };

    /**
     * 
     * @param {*string} str Строка валидации 
     * @param {*number} min мин длина строки
     * @param {*number} max макс длина строки
     * @returns бул если строка корректна тогда true а иначе false
     */
    validateField(str, min, max) {
        if(str === '' || str.length < min || str.length > max) {
            return false;
        };
        return true
    };

    /**
     * Обработчик на input в форме
     * @param {} e Объект event
     * @returns 
     */
    handleChange = (e) => {
        if (e.target.type === 'checkbox') {
            this.setState((prev) => {
                return {
                    ...prev,
                    userData: {
                        ...prev.userData,
                        [e.target.name]: e.target.checked,
                    }
                }
            });
            return;
        };
        this.setState((prev) => {
            return {
                ...prev,
                userData: {
                    ...prev.userData,
                    [e.target.name]: e.target.value,
                },
            }
        });
    };

    /**
     * Функция рендеринга формы
     */
    renderForm = () => {
        return (
            <form onSubmit={this.handleSendData} className={classes.forma}>
            <h1>Contact data</h1>
            <div className={classes.inputContainer}>
                <div>
                    <label>Name</label>
                    <Input
                    inputType='text' 
                    name="userName"
                    value={this.state.userData.name}
                    placeholder="Enter your name"
                    onChange={this.handleChange}
                    error={this.state.errors.userName}
                    />
                </div>
                <div>
                    <label>City</label>
                    <Input
                    inputType="text"
                    placeholder="Enter your city"
                    name="city"
                    value={this.state.userData.city}
                    onChange={this.handleChange}
                    error={this.state.errors.city}
                    />
                </div>
                <div>
                    <label>Street</label>
                    <Input
                    inputType="text"
                    name="street"
                    value={this.state.userData.street}
                    placeholder="Enter your street"
                    onChange={this.handleChange}
                    error={this.state.errors.street}
                    />
                </div>
                <div className={classes.wrapper}>
                    <label className={classes.label}>Contactless delivery</label>
                    <Input
                    inputType="checkbox"
                    name="contactlessDelivery"
                    value={this.state.userData.contactlessDelivery}
                    onChange={this.handleChange}
                    />
                </div>
                <div className={classes.marginTop}>
                    <label className={classes.label}>Payment type</label>
                    <Input
                    inputType="select"
                    name="paymentType"
                    value={this.state.userData.paymentType}
                    onChange={this.handleChange}
                    options={['Cash','Card']}
                    />
                </div>
            </div>
            <div className={classes.buttonContainer}>
                <Button label={'Order'} styles={['continue', 'center']} click={this.handleSendData}/>
            </div>
        </form>
        );
    };

    /**
     * Функция для рендеринга ошибок
     */
    renderErrors = () => {
        const errors = Object.values(this.state.errors);
        return errors.filter(error => error !== '').map((errorText,id) => {
            return (
                <div key={id} className={classes.error}>{errorText}</div>
            )
        })
    };

    render() {
        let component = null;
        const {loading, valid} = this.state;
        if (!loading) {
            component = this.renderForm();
        } else {
            component = <div className={classes.loaderContainer}><Loader/></div>
        }
        return (
            <div>
                {component}
                {!valid && <div className={classes.errorsContainer}>
                    {this.renderErrors()}
                </div>}
            </div>
        )
    };
};

export default withRouter(ContactData)