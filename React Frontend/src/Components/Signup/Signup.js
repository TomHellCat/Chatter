import React, { Component } from "react";
import { withRouter } from "react-router-dom"; // new import
import { connect } from "react-redux"; // new import
import PropTypes from "prop-types"; // new import
import { Link } from "react-router-dom";

import { signupNewUser } from "./SignupActions";

class Signup extends Component {

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

  onSignupClick = () => {
    const userData = {
      username: this.state.username,
      password: this.state.password
    };
    this.props.signupNewUser(userData);
    console.log("Sign up " + userData.username + " " + userData.password);
  };

  render() {
    return (
      <div className="container">
            <h2>Signup</h2>
            <form>

            <div className="row">
                <div className="col s6">
                    <input isInvalid={this.props.createUser.usernameError} name="username" placeholder="username" id="usernameId" type="text"  value={this.state.username} onChange={this.onChange} className="validate" />
                </div>
            </div>
            <div className="row">
                <div className="col s6 ">
                <input isInvalid={this.props.createUser.passwordError} placeholder="password" id="passwordId" type="password" name="password" value={this.password} onChange={this.onChange} className="validate" />
                </div>
            </div>
            <div className="row">
                <div className="col s6 ">
                <input placeholder="confirm" id="confirmId" type="text" className="validate" />
                </div>
            </div>
            <div className="row">

                <div className="col s6 push-s4">
                    <a className="waves-effect waves-light btn" onClick={this.onSignupClick}>Signup</a>
                </div>
                <div className="col s4 pull-s6">
                    <a href="/">Login</a>
                </div>
            </div>
            </form>
        </div>
    );
  }
}

Signup.propTypes = {
  signupNewUser: PropTypes.func.isRequired,
  createUser: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  createUser: state.createUser
});

export default connect(mapStateToProps, {
  signupNewUser
})(withRouter(Signup));