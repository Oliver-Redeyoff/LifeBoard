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
    
    var content;

    if (!this.state.isLoading) {
      content = 
      <div class="widget-content">
        <h1 class="balance-value" style={{marginTop: '25px', fontWeight: '600'}}><span style={{opacity: '0.8'}}>£</span> {this.state.balance}</h1>
      </div>

    } else {
      content =
      <div class="loader"></div>
    }

    return (
      <div class="widget-container">
        <div className="widget bg-green">
          <h3 className="widget-label">Balance</h3>
          {content}
        </div>
      </div>
    );
  }
}

export default AccountBalance;
