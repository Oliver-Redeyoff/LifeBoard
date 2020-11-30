import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';


class AccountBalance extends Component {

  state = {
    isLoading: true,
    balance: 0,
  }

  async componentDidMount() {
    let balanceInfo = await this.getBalance();
    if (balanceInfo.balance) {
      this.setState({isLoading: false, balance: balanceInfo.balance/100});
    }
  }

  async getBalance() {
    const authResponse = await fetch('/api/getMonzoBalance');
    let balance = await authResponse.json();

    return balance;
  }

  
  render() {
    
    if (!this.state.isLoading) {
      var content = 
      <div className="balance-value">
        <h1>{this.state.balance}</h1>
      </div>
    } else {
      var content =
      <h1>Loading...</h1>
    }

    return (
      <div className="widget">
        <h3 className="widget-label">Balance</h3>
        {content}
      </div>
    );
  }
}

export default AccountBalance;
