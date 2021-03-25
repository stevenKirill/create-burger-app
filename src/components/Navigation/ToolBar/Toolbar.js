import React, {Component} from 'react';
import logo from '../../../assets/images/burger-logo.png'
import {Link, NavLink} from 'react-router-dom';
import classes from './toolbar.module.css';

export default class ToolBar extends Component {
    constructor(props) {
        super(props);
    };

    logOut = () => {
        this.props.setSignedIn()
        localStorage.removeItem('signData')
    };

    render() {
        const {signedIn} = this.props;
        return (
            <div className={classes.toolbarWrapper}>
                <div><img src={logo} className={classes.logo}/></div>
                <nav className={classes.toolbar}>
                    <ul className={classes.menu}>
                        {signedIn &&
                            <li className={classes.item}>
                                <NavLink to="/burger" activeClassName={classes.navlink} className={classes.navLinkDefault}>
                                    Burger builder
                                </NavLink>
                            </li>
                        }
                        {/* <li className={classes.item}>
                            <NavLink to='/checkout' activeClassName={classes.navlink}>
                                Checkout
                            </NavLink>
                        </li> */}
                        {signedIn &&
                            <li className={classes.item}>
                                <NavLink to='/orders' activeClassName={classes.navlink}>
                                    Orders
                                </NavLink>
                            </li>
                        }
                        <li className={classes.item} onClick={this.logOut}>
                            <NavLink to='/' activeClassName={classes.navlink}>
                                {signedIn ? 'Logout' : 'Login'}
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
} 