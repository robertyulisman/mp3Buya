import React, { Component } from 'react';

class FormGodev extends Component {

    state = {
        form: {
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
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Nama Godev</label>
                    <input name="name" type="text" className="form-control" id="name" placeholder="Input Nama" onChange={this.handleFormChange} defaultValue={this.props.data.name} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Email Godev</label>
                    <input name="email" type="text" className="form-control" id="email" placeholder="Input Email Godev" onChange={this.handleFormChange} defaultValue={this.props.data.email} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Keterangan</label>
                    <input name="ket" type="text" className="form-control" id="ket" placeholder="Input Keterangan Godev" onChange={this.handleFormChange} defaultValue={this.props.data.ket} />
                </div>
            </div>
        );
    }
}

export default FormGodev;