/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col
} from "reactstrap";
import Loading from "../../components/widgets/Loading/Loading";
import API from "../../service/API";
import SweetAlert from 'react-bootstrap-sweetalert';
import Auth from "../../service/Auth";
import { GlobalConsumer } from "../../context/Context";
import ActionType from "../../context/GlobalActionContentx";

class Login extends React.Component {

  state = {
    showLoading: false,
    formInput: [],
    formErr: [],
    msgAllert: null,
  }

  componentDidMount() {
    document.title = "Login Dashboard Audio"
  }

  handleFormChange = (event) => {
    let tempForm = { ...this.state.formInput };
    tempForm[event.target.name] = event.target.value;
    this.setState({
      ...this.state,
      formInput: tempForm,
      formErr: [],

    }, () => {
      console.log(this.state);
    })
  }

  handleValidation = () => {
    let isValid = true;
    let form = { ...this.state.formInput };
    let tempFormErr = { ...this.state.formErr };
    if (form.userName === undefined || form.userName === "") {
      tempFormErr["userName"] = "username tidak boleh kosong";
      this.setState({
        ...this.state,
        formErr: tempFormErr,
      })
      isValid = false;
    }
    if (form.pass === undefined || form.pass === "") {
      tempFormErr["pass"] = "password tidak boleh kosong";
      this.setState({
        ...this.state,
        formErr: tempFormErr,
      })
      isValid = false;
    }
    return isValid;
  }

  hideAlert = () => {
    this.setState({
      ...this.state,
      msgAllert: null,
    })
  }

  handleBtnLogin = () => {
    if (this.handleValidation()) {

      this.setState({
        ...this.state,
        showLoading: true,
      }, () => {
        API.Login(this.state.formInput)
          .then((r) => {
            this.setState({
              ...this.state,
              showLoading: false
            }, () => {
              var user = {
                ...r,
                pass: this.state.formInput.pass,
              }

              if (this.state.formInput.rememberMe !== undefined && this.state.formInput.rememberMe === "on") {
                Auth.Login(user, true);
                this.props.history.push('/admin/godevs')
              }
              else {
                Auth.Login(user, false);
                this.props.dispatch({ action: ActionType.SET_USER, data: user });
                Auth.setAuthNoRemember(true);
              }
            })
          }).catch(err => {
            this.setState({
              ...this.state,
              msgAllert: err.message,
              showLoading: false
            })
          })
      })
    }
  }

  render() {
    return (
      <>
        {
          this.state.showLoading &&
          <Loading />
        }
        {
          this.state.msgAllert && <SweetAlert
            danger
            title="Error!"
            onConfirm={this.hideAlert}
          >
            {this.state.msgAllert}
          </SweetAlert>
        }

        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>Silahkan Login dengan Username dan Password anda.</small>
              </div>
              <Form role="form">
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-single-02" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input name="userName" placeholder="Username" type="text" autoComplete="new-email" onChange={this.handleFormChange} />
                  </InputGroup>
                  {
                    this.state.formErr.userName && <span style={{ color: "red" }} >{this.state.formErr.userName}</span>
                  }
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input name="pass" placeholder="Password" type="password" autoComplete="new-password" onChange={this.handleFormChange} />
                  </InputGroup>
                  {
                    this.state.formErr.pass && <span style={{ color: "red" }} >{this.state.formErr.pass}</span>
                  }
                </FormGroup>
                <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    name="rememberMe"
                    className="custom-control-input"
                    id=" customCheckLogin"
                    type="checkbox" onChange={this.handleFormChange}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor=" customCheckLogin"
                  >
                    <span className="text-muted">Remember me</span>
                  </label>
                </div>
                <div className="text-center">
                  <Button className="my-4" color="primary" type="button" onClick={this.handleBtnLogin} >
                    Sign in
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

export default GlobalConsumer(Login);
