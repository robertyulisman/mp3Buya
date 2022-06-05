import React, { Component } from 'react';


class FormUsers extends Component {

    state = {
        form: {
            level : "User"
        },
    }

    formChange = (value) => {
        this.props.onInputUser(value);
    }

    handleFormChange = (event) => {
        let tempForm = { ...this.state.form };
        tempForm[event.target.name] = event.target.value;
        this.setState({
            ...this.state,
            form: tempForm
        }, () => {
            this.formChange(this.state.form);
        })
    }

    render() {
        return (
            <div>
                <div>
                    <div className="form-group">
                        <label className="form-control-label" htmlFor="exampleInputEmail1">Nama</label>
                        <input name="name" type="text" className="form-control" id="nama" placeholder="Nama" onChange={this.handleFormChange} defaultValue={this.props.data.name} />
                    </div>
                    <div className="form-group">
                        <label className="form-control-label" htmlFor="exampleInputEmail1">Username</label>
                        <input name="userName" type="text" className="form-control" id="username" placeholder="Username" onChange={this.handleFormChange} defaultValue={this.props.data.userName} />
                    </div>
                    <div className="form-group">
                        <label className="form-control-label" htmlFor="exampleInputPassword1">Password</label>
                        <input name="pass" type="text" className="form-control" id="pass" placeholder="Password" onChange={this.handleFormChange} defaultValue={this.props.data.pass} />
                    </div>
                    <div className="form-group">
                        <label className="form-control-label" htmlFor="exampleInputPassword1">Level</label>
                        <select name="level" className="form-control" onChange={this.handleFormChange} defaultValue={this.props.data.level} >
                            <option value="SuperAdmin" >SuperAdmin</option>
                            <option value="Admin" >Admin</option>
                            <option value="User" >User</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-control-label" htmlFor="exampleInputPassword1">Image</label>
                        <div className="custom-file">
                            <input name="image" multiple className="custom-file-input" id="customFileLang" lang="en" type="file" onChange={this.handleFormChange} />
                            <label className="custom-file-label" htmlFor="customFileLang">Select file</label>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default FormUsers;
