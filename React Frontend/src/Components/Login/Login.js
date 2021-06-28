import React, { Component } from "react";
import { withRouter } from "react-router-dom";  // new import 
import { connect } from "react-redux";          // new import 
import PropTypes from "prop-types";             // new import 

import { login } from "./LoginActions.js";  

class Login extends Component {

     constructor(props) {
        super(props);
        this.state = {
        username: "",
        password: ""
    };
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onLoginClick = () => {
    const userData = {
      username: this.state.username,
      password: this.state.password
    };
    this.props.login(userData, "/home");
    console.log("Login " + userData.username + " " + userData.password);
  };

  render() {
    return (
      <div className="container">
            <h2>Login</h2>
            <div className="row">
                <div className="col s6">
                    <input type="text" name="username" 
                    placeholder="Enter user name" 
                    value={this.state.username} 
                    onChange={this.onChange}
                    id="usernameId"
                    className="validate" />
                </div>
            </div>
            <div className="row">
                <div className="col s6 ">
                    <input type="password" name="password" 
                    placeholder="Enter password" 
                    id="passwordId" 
                    value={this.state.password} 
                    onChange={this.onChange} 
                    className="validate" />
                </div>
            </div>
            <div className="row">

                <div className="col s6 push-s4">
                    <a className="waves-effect waves-light btn" 
                    onClick={this.onLoginClick}>Login</a>
                </div>
                <div className="col s4 pull-s6">
                    <a href="/signup">Sign Up</a>
                </div>
            </div>
      </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  login
})(withRouter(Login));