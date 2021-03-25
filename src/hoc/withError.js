import React, { Component } from 'react';
import {classes} from './errors.module.css';

export const withErrorBoundary = WrappedComponent => (
    class extends Component {
      constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
      }
  
      componentDidCatch = (error, errorInfo) => {
        catchFunc(error, errorInfo, this)
      };
      
      /**Если произошла ошибка рендерим то что в функции вернули (кастомная верстка) иначе рендерим компонент */
      render() {
        if (this.state.errorInfo) {
          return handleError(this)
        }
        return <WrappedComponent {...this.props} />;
      }
    }
  );

const handleError = (ctx) => {
    return (
        <div style={ctx.props.style || classes.error}>
            <h2>Произошла ошибка.</h2>
            <details style={{ whiteSpace: 'pre-wrap'}}>
                {ctx.state.error && ctx.state.error.message}
                <br />
                {ctx.state.errorInfo.componentStack}
            </details>
      </div>
    )
};

const catchFunc = (error, errorInfo, ctx) => {
    // catch errors in any components below and re-render with error message
    ctx.setState({
      error: error,
      errorInfo: errorInfo
    })
};