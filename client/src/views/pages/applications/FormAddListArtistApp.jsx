import React, { Component } from 'react';

class FormAddListArtistApp extends Component {

    state = {
        form: {
            artist : this.props.artists[0]._id
        },
    }

    formChange = (value) => {
        this.props.onInputUser(value);
    }

    componentDidMount(){
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
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Pilih Artist</label>
                    <select name="artist" type="text" className="form-control" id="name" placeholder="Input Keterangan Godev" onChange={this.handleFormChange} defaultValue ={this.props.artists[0]._id} >

                        {
                            this.props.artists.map((artist, index) => (
                                <option key={index} value={artist._id}>{artist.name}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
        );
    }
}

export default FormAddListArtistApp;