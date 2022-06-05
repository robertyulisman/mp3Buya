import React, { Component } from 'react';

class FormSettingAds extends Component {

    state = {
        form: [],
    }

    formChange = (value) => {
        this.props.onInputUser(value);
    }

    componentDidMount() {
        this.formChange(this.state.form);
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
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Nama Aplikasi</label>
                    <input name="name" type="text" className="form-control" id="name" placeholder="Input Nama Aplikasi" onChange={this.handleFormChange} defaultValue={this.props.data.name} />
                </div>
            </div>
        );
    }
}

export default FormSettingAds;