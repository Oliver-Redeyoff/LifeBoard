import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Header } from './components/Header'
import AccountBalance from './components/AccountBalance'
import { authenticateMonzo } from './services/ApiService'

class App extends Component {

  state = {
    user: {},
    users: [],
    numberOfUsers: 0,
    isLoading: true,
    isMonzoAuthenticated: false
  }

  async componentDidMount() {
    
    const authResponse = await fetch('/api/monzoIsAuthenticated');
    let isAuth = await authResponse.json();

    if(isAuth) {
      this.setState({isLoading: false});
      this.setState({isMonzoAuthenticated: true});
    } else {
      let currentUrl = window.location.href
      let params = this.getParams(currentUrl);

      if(params.code) {
        console.log("There is a code in the url. Your Monzo code is : " + params.code);
        authenticateMonzo(params.code)
          .then(response => {
            console.log(response);
            this.setState({isMonzoAuthenticated: true});
            this.setState({isLoading: false});
          });
      } else {
        console.log("You are not already authenticated and there is no code in url. Please authenticate.")
        this.setState({isLoading: false});
      }
    }

  }

  redirectMonzo = async () => {

    const redirectResponse = await fetch('/api/getMonzoRedirectLink');
    let link = await redirectResponse.json();

    window.open(link);

  }

  getParams = (url) => {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  };

  render() {
    let content;
    if (this.state.isLoading === false) {
      if (this.state.isMonzoAuthenticated) {
        content = 
        <div className="widget-list">
          <AccountBalance></AccountBalance>
        </div>;
      } else {
        content = <button onClick={this.redirectMonzo}>Authenticate with monzo</button>
      }
    } else {
      content = <div class="loader"></div>
    }

    return (
      <div className="App">
        
        <Header></Header>

        {content}

      </div>
    );
  }
}

export default App;
