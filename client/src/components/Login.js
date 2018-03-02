import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';


class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    login = async () => {
        const response = await this.props.login({
            variables: {
                email: this.state.email,
                password: this.state.password
            }
        });
        if(response.data.login){
            console.log(response);
            sessionStorage.setItem('token', response.data.login.token); 
        }
    }

    reset = () => {
        sessionStorage.removeItem('token');
    }

    render(){
        return(
            <div>
                <input type="text" value={this.state.email} onChange={(event) => this.setState({email: event.nativeEvent.target.value})} />
                <input type="password" value={this.state.password} onChange={(event) => this.setState({password: event.nativeEvent.target.value})} />
                <button onClick={this.login}>Login</button>
                <button onClick={this.reset}>Reset</button>
            </div>
        );
    }
}

const login = gql `
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password){
      token
  }
}
`;

export default graphql(login, { name: 'login' })(Login);
