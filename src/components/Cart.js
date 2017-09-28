import React, { Component } from 'react';
import { Panel, ListGroup, ListGroupItem, Alert, Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import _ from 'lodash';
import { withRouter } from 'react-router-dom'
import { removeFromCart } from '../actions'
import { cartTotal } from '../utils'
import DatePicker from './DatePicker'

class Cart extends Component {

  onButtonClick() {
    this.props.history.push(this.props.isAuthenticated ? '/checkout' : '/login')
  }

  renderCartItems() {
    return (
      <ListGroup>
      { this.props.cartItems.map((item) =>
        <ListGroupItem key={ item.menuItem['@id'] }>
          { item.menuItem.name }
          <span className="quantity text-muted">×{ item.quantity }</span>
          <button type="button" className="close pull-right" aria-label="Close"
            onClick={ () => this.props.actions.removeFromCart(item) }>
            <span aria-hidden="true">×</span>
          </button>
        </ListGroupItem>
      ) }
      </ListGroup>
    )
  }

  renderButton() {
    const buttonDisabled = this.props.cartItems.length === 0;

    return (
      <Button disabled={ buttonDisabled } bsStyle="primary" bsSize="large" block onClick={ this.onButtonClick.bind(this) }>Commander</Button>
    )
  }

  render() {

    const title = (
      <h3>Panier</h3>
    );

    return (
      <Panel className="cart" header={title}>
        <DatePicker />
        <hr />
        { this.props.cartItems.length > 0 ? this.renderCartItems(): (
          <Alert bsStyle="warning">Votre panier est vide</Alert>
        ) }
        <hr />
        <p>
          <strong>Total : { this.props.total } €</strong>
        </p>
        { !this.props.readonly && this.renderButton() }
      </Panel>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    cartItems: state.cartItems,
    total: cartTotal(state.cartItems),
    isAuthenticated: !!state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ removeFromCart }, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Cart))
