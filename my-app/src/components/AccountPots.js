import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';


class AccountPots extends Component {

  state = {
    isLoading: true,
    pots: []
  }

  async componentDidMount() {
    let potInfo = await this.getPots();
    console.log(potInfo);
    this.setState({isLoading: false, pots: potInfo.pots});
  }

  async getPots() {
    const authResponse = await fetch('/api/getMonzoPots');
    let pots = await authResponse.json();
    return pots;
  }

  
  render() {
    
    var content = [];

    if (!this.state.isLoading) {

      this.state.pots.forEach(pot => {
        let progress;
        if (pot.goal_amount) {
          let perc = (Math.round(pot.balance/pot.goal_amount*100))+'%'
          progress = 
            <div className="progress">
              <div className="progress-bar" style={{width: perc}}>{perc}</div>
            </div>
        }

        content.push(
          <div className="sub-widget">
            <h3 className="widget-label">{pot.name}</h3>
            <div class="widget-content">
              <h1 class="balance-value" style={{marginTop: '25px', fontWeight: '600'}}><span style={{opacity: '0.8'}}>£</span> {pot.balance/100}</h1>
              {progress}
            </div>
          </div>)
      })

      console.log(content);

    } else {
      content.push(<div class="loader"></div>)
    }

    return (
      <div>
        <div class="widget-container">
          <div className="widget bg-red">
            {content}
          </div>
        </div>
      </div>
    );
  }
}

export default AccountPots;
