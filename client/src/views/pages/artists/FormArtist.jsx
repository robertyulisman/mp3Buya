import React, { Component } from 'react';

class FormArtist extends Component {

    state = {
        form: this.props.data ? this.props.data : {},
        file: null
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
            console.log("form : ", this.state.form)
            this.formChange(this.state.form);
        })
    }

    onChangeImage = (event) => {
        let tempForm = { ...this.state.form };
        tempForm[event.target.name] = event.target.files[0];
        this.setState({
            ...this.state,
            form : tempForm,
        }, () =>  {
            console.log("form : ", this.state.form)
            this.formChange(this.state.form);
        });
    }

    render() {
        return (
            <div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Nama Artist</label>
                    <input name="name" type="text" className="form-control" id="name" placeholder="Input Nama Artist" onChange={this.handleFormChange} defaultValue={this.props.data.name} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Image</label>
                    <div className="custom-file">
                        <input
                            className="custom-file-input"
                            id="customFileLang"
                            lang="en"
                            type="file"
                            name="image"
                            onChange={this.onChangeImage}
                        />
                        <label className="custom-file-label" htmlFor="customFileLang">
                            Select file
            </label>
                    </div>
                </div>
            </div>
        );
    }
}

export default FormArtist;