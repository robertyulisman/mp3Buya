import React, { Component } from 'react';
import API from '../../../service/API';
import Select from 'react-select';
// react plugin that creates text editor
import ReactQuill from "react-quill";


class FormMusic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            form: props.data ? props.data : [],
            formErr: [],
            reactQuillText: (props.data &&  props.data.lyric) ? props.data.lyric : ""
        }
        this.handleFormChange = this.handleFormChange.bind(this);
    }


    formChange = (value) => {
        this.props.onInputUser(value);
    }

    handleFormChange = (event) => {
        let tempForm = { ...this.state.form };
        tempForm[event.target.name] = event.target.value;
        this.setState({
            ...this.state,
            form: tempForm,
            formErr: [],
        }, () => {
            this.formChange(this.state.form);
        })
    }

    handleReactQuillChange = value => {
        let tempForm = { ...this.state.form };
        tempForm['lyric'] = value
        this.setState({
            ...this.state,
            form: tempForm,
            reactQuillText: value
        }, () => {
            this.formChange(this.state.form);
            // console.log("form : ", this.state.form)
        });
    };

    onCheckUrlDownload = (showLoadingModal, dataResult) => {
        this.props.onCheckUrlDownload(showLoadingModal, dataResult);
    }

    handleCheckUrl = () => {
        var form = this.state.form;
        if (form.urlDownload === undefined || form.urlDownload === "") {
            let tempFormErr = { ...this.state.formErr };
            tempFormErr['url'] = "url Download tidak boleh kosong"
            this.sendMessageErr('idYT tidak boleh kosong')
            // return this.setState({
            //     ...this.state,
            //     formErr: tempFormErr,
            // }, () => {
            //     // console.log(this.state.formErr)
            // })
        }
        this.onCheckUrlDownload(true, this.state.form);
        this.scrapeYt()
    }

    sendMessageErr = (msg) => {
        this.props.msgErr({
            msg: msg
        })
    }

    scrapeYt = () => {
        API.scrapeSingleYt(this.state.form.urlDownload)
            .then((r) => {
                this.setState({
                    ...this.state,
                    form: {
                        ...this.state.form,
                        title: r.title,
                        image: r.thumbnails.maxres
                            ? r.thumbnails.maxres.url : r.thumbnails.standard
                                ? r.thumbnails.standard.url : r.thumbnails.high
                                    ? r.thumbnails.high.url : r.thumbnails.medium
                                        ? r.thumbnails.medium.url : r.thumbnails.default.url,
                        url: this.state.form.urlDownload,
                        urlDownload: this.state.form.urlDownload,
                        duration: r.duration
                    }
                }, () => {
                    this.onCheckUrlDownload(false, this.state.form);
                })
                // console.log(r);
            })
            .catch((err) => {
                this.onCheckUrlDownload(false, err);
                this.sendMessageErr(err.message);
                console.log("error : " + err.message);
            })
    }

    getDefaultValue = (list_data, dataId) => {

        if (!list_data || !(dataId && dataId._id))
            return
        return list_data[list_data.findIndex(data => data.value === dataId._id)];
    }

    handleFormSelect = (value) => {
        if (!value) return
        let tempForm = { ...this.state.form };
        if (value.length > 0)
            tempForm[value[0].name] = value.map((desa) => desa.value);
        else
            tempForm[value.name] = value.value;
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
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Title</label>
                    <input name="title" type="text" className="form-control" id="nama" placeholder="Input Tittle"
                        onChange={this.handleFormChange}
                        // defaultValue={this.props.data.title} 
                        value={this.state.form.title}
                    />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Artist</label>
                    <Select options={this.props.list_artist} onChange={this.handleFormSelect} defaultValue={this.getDefaultValue(this.props.list_artist, this.props.data.artist)} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Lirik</label>
                    {/* <textarea name="lyric" type="text" className="form-control" id="nama" placeholder="Input lirik"
                        onChange={this.handleFormChange}
                        // defaultValue={this.props.data.title} 
                        value={this.state.form.lyric}
                    /> */}
                    <ReactQuill
                        value={this.state.reactQuillText}
                        onChange={this.handleReactQuillChange}
                        theme="snow"
                        placeholder="input lyric"
                        modules={{
                            toolbar: [
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' },
                                { 'indent': '-1' }, { 'indent': '+1' }],
                                ['clean']
                            ]
                        }}
                    />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Duration</label>
                    <input name="duration" type="text" className="form-control" id="duration" placeholder="Input Duration" onChange={this.handleFormChange}
                        value={this.state.form.duration}
                    />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Url Image</label>
                    <div className="row">
                        <div className="col">
                            <input name="image" type="text" className="form-control" id="nama" placeholder="Input Url Image" onChange={this.handleFormChange} value={this.state.form.image} />
                        </div>
                        <div className="col-auto">
                            <img className="card-img" style={{ width: 168, height: 94 }} src={this.props.data.image} alt="Thumbnail Audio" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">ID Youtube</label>
                    <div className="row">
                        <div className="col">
                            <input name="urlDownload" type="text" className="form-control" id="nama" placeholder="Input id youtube" onChange={this.handleFormChange} defaultValue={this.props.data.urlDownload} />
                            {
                                this.state.formErr &&
                                <small style={{ color: "red" }}>{this.state.formErr.urlDownload}</small>
                            }
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-success" onClick={this.handleCheckUrl} >Check ID</button>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default FormMusic;