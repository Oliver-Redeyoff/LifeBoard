import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Header } from './components/Header'
import { Users } from './components/Users'
import { DisplayBoard } from './components/DisplayBoard'
import CreateUser from './components/CreateUser'
import { getAllUsers, createUser, checkMonzoAuth, getMonzoRedirectLink, authenticateMonzo } from './services/UserService'

class App extends Component {

  state = {
    user: {},
    users: [],
    numberOfUsers: 0,
    isLoading: true,
    isMonzoAuthenticated: false
  }

  componentDidMount() {
    let currentUrl = window.location.href
    let params = this.getParams(currentUrl);

    if(params.code) {
      console.log(params.code)
      authenticateMonzo(params.code)
        .then(response => {
          console.log(response);
          this.setState({isLoading: false});
        });
    } else {
      // check if is authenticated, if not do authentication
      checkMonzoAuth()
        .then(response => {
          this.setState({isLoading: false});
          console.log('monzo auth : ' + response);
          this.setState({isMonzoAuthenticated: response});
        });
    }

  }

  redirectMonzo = () => {
    getMonzoRedirectLink()
      .then(response => {
        window.open(response);
      });
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

  createUser = (e) => {
      createUser(this.state.user)
        .then(response => {
          console.log(response);
          this.setState({numberOfUsers: this.state.numberOfUsers + 1})
      });
  }

  getAllUsers = () => {
    getAllUsers()
      .then(users => {
        console.log(users)
        this.setState({users: users, numberOfUsers: users.length})
      });
  }

  onChangeForm = (e) => {
      let user = this.state.user
      if (e.target.name === 'firstname') {
          user.firstName = e.target.value;
      } else if (e.target.name === 'lastname') {
          user.lastName = e.target.value;
      } else if (e.target.name === 'email') {
          user.email = e.target.value;
      }
      this.setState({user})
  }

  render() {
    let content;
    if (this.state.isLoading === false) {
      if (this.state.isMonzoAuthenticated) {
        content = 
        <div>

        <div className="container mrgnbtm">
          <div className="row">
            <div className="col-md-8">
                <CreateUser 
                  user={this.state.user}
                  onChangeForm={this.onChangeForm}
                  createUser={this.createUser}
                  >
                </CreateUser>
            </div>
            <div className="col-md-4">
                <DisplayBoard
                  numberOfUsers={this.state.numberOfUsers}
                  getAllUsers={this.getAllUsers}
                >
                </DisplayBoard>
            </div>
          </div>
        </div>
        <div className="row mrgnbtm">
          <Users users={this.state.users}></Users>
        </div>

      </div>;
      } else {
        content = <button onClick={this.redirectMonzo}>Authenticate with monzo</button>
      }
    } else {
      content = <h1>Loading...</h1>
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
