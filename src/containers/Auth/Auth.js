import React, {Component} from 'react';
import {withErrorBoundary} from '../../hoc/withError';
import {Input} from '../../components/common/Input/Input';
import {Button} from '../../components/common/Button/Button';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import {MY_KEY} from '../../API/API_KEY';
import classes from './auth.module.css';

const PASSWORD_ERROR_TEXT = 'Incorrect Password, shoud contain at least 1 digit, 1 lowercase 1 uppercase and 8 characters';
const EMAIL_ERROR_TEXT = 'Incorrect email, try again';

class Auth extends Component {

    state = {
        loginData: {
            email: '',
            password: '',
        },
        errors: {
            emailError: '',
            passwordError: '',
        },
        valid: true,
        loginError: false,
        signUp: true,
        signData: {
            token: '',
            id: '',
            expiresIn: '',
            refreshToken: '',
        }
    };

    componentDidUpdate() {
        const {loginError} = this.state;
        if (loginError) {
            setTimeout(() => {
                this.setState({loginError: false})
            },5000)
        };
    }

    handleChangeInput = (e) => {
        this.setState((prev) => {
            return {
                ...prev,
                loginData: {
                    ...prev.loginData,
                    [e.target.name]: e.target.value,
                },
            }
        });
    };

    /** Функция валидации формы */
    validateForm = (form) => {
        const {email,password} = form;
        const validEmail = this.validateEmail(email);
        const validPassword = this.validatePassword(password);
        if (validEmail && validPassword) {
            this.setState((prev) => {
                return {
                    ...prev,
                    valid: true,
                    errors: {
                        emailError: '',
                        passwordError: '',
                    }
                }
            });
            return true;
        } else {
            if (!validPassword) {
                this.setInvalidState('passwordError');
            }
            if (!validEmail) {
                this.setInvalidState('emailError');
            };
            return false;
        };
    };

    setInvalidState = (field) => {
        const erText = field === 'passwordError' ? PASSWORD_ERROR_TEXT : EMAIL_ERROR_TEXT 
        this.setState((prev) => {
            return {
                ...prev,
                errors: {
                    ...prev.errors,
                    [field]: erText, 
                },
                valid: false,
            };
        });
    };

    /** Функция валидации email */
    validateEmail = (email) => {
        const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailReg.test(email); 
    };

    /** Функция валидации пароля */
    validatePassword = (password) => {
        // /^
        // (?=.*\d)          // should contain at least one digit
        // (?=.*[a-z])       // should contain at least one lower case
        // (?=.*[A-Z])       // should contain at least one upper case
        // [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
        // $/
        const passwordRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        return passwordRegExp.test(password);
    };

    handleSendForm = (e) => {
        e.preventDefault();
        const {loginData, signUp} = this.state;
        const {history} = this.props;
        const validData = this.validateForm(loginData);
        const url = signUp 
        ? `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${MY_KEY}`
        : `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${MY_KEY}`;

        if(!validData) {
            return;
        } else {
            const dataToSend = {
                ...loginData,
                returnSecureToken: true,
            };
            axios.post(url, dataToSend)
            .then((response) => {
                const {data: {expiresIn, idToken, localId, refreshToken}} = response;
                this.setState(prev => {
                    return {
                        ...prev,
                        signData: {
                            token: idToken,
                            id: localId,
                            expiresIn: expiresIn,
                            refreshToken: refreshToken
                        }
                    };
                });
                localStorage.setItem("signData",JSON.stringify(this.state.signData));
                this.props.func();
                history.replace('/burger');
            })
            .catch((err) => {
                this.setState({loginError: true});
            });
        }
        
    };

    /** Переключение между входом и регестрацией */
    switchAuth = () => {
        this.setState((prev => {
            return {
                ...prev,
                signUp: !prev.signUp,
            }
        }))
    };
    
    /** Функция рендеринга ошибок */
    renderError = () => {
        const errorsValues = Object.values(this.state.errors);
        return (
            <div className={classes.error}>
                {errorsValues.map((err,idx) => {
                    return <div key={idx + 10}>{err}</div>
                })}
            </div>
        );
    };

    render() {
        const {loginData: {email, password}, 
            errors: {emailError, passwordError},
            valid, loginError, signUp} = this.state;
            const switchBtnText = signUp ? 'Switch to sign in' : 'Switch to sign up';
            const title = signUp ? 'Sign up' : 'Sign in';
        return (
            <div className={classes.container}>
            {!valid && this.renderError()}
            {loginError && <div className={classes.loginError}>Invalid login (probably server error)</div>}
            <form onSubmit={this.handleSendForm}>
                <h1 className={classes.title}>{title}</h1>
                <div>
                    <div>
                        <label>Email</label>
                        <Input
                        inputType='email' 
                        name="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={this.handleChangeInput}
                        error={emailError}
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <label>Password</label>
                        <Input
                        inputType='password' 
                        name="password"
                        value={password}
                        placeholder="Enter your password"
                        onChange={this.handleChangeInput}
                        error={passwordError}
                        />
                    </div>
                </div>
                <Button click={this.handleSendForm} label="SEND" styles={['continue', 'center']}/>
            </form>
            <Button click={this.switchAuth} label={switchBtnText} styles={['cancel','center','mt-10']}/>
            </div>
        )
    }
};

export default withErrorBoundary(withRouter(Auth));
