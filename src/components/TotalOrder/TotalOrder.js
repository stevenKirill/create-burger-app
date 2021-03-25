import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classes from './totalOrder.module.css';

export default class TotalOrder extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <button className={classes.total} onClick={this.props.open}>ORDER NOW</button>
        )
    }
}

TotalOrder.propTypes = {
    open: PropTypes.func
}