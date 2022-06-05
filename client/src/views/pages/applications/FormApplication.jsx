import React, { Component } from 'react';
import Select from 'react-select'
import ReactQuill from "react-quill";

class FormApplication extends Component {

    constructor(props) {
        super(props);
        this.state = {
            form: {
            },
            reactQuillText: (props.data &&  props.data.privacyPolicyApp) ? props.data.privacyPolicyApp : ""
        }
        this.handleFormChange = this.handleFormChange.bind(this);
    }

    
    formChange = (value) => {
        this.props.onInputUser(value);
    }

    handleReactQuillChange = value => {
        let tempForm = { ...this.state.form };
        tempForm['privacyPolicyApp'] = value
        this.setState({
            ...this.state,
            form: tempForm,
            reactQuillText: value
        }, () => {
            this.formChange(this.state.form);
            // console.log("form : ", this.state.form)
        });
    };

    optionsAds = [
        { name:'modeAds', value: 1, label: 'Admob' },
        { name:'modeAds', value: 2, label: 'FAN' },
        { name:'modeAds', value: 3, label: 'UnityAds' },
        { name:'modeAds', value: 4, label: 'Mopub' },
        { name:'modeAds', value: 5, label: 'Startapp' },
        { name:'modeAds', value: 6, label: 'AppLovin' }
      ]

    handleFormChange = (event) => {
        let tempForm = { ...this.state.form };
        var list_checked = ['isShowAds', 'isTestAds', 'isOnRedirect', 'isShowImageAudio']
        tempForm[event.target.name] = list_checked.includes(event.target.name) ? event.target.checked : event.target.value;
        this.setState({
            ...this.state,
            form: tempForm
        }, () => {
            this.formChange(this.state.form);
        })
    }

    handleFormSelect = (value) => {
        if(!value) return
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

    getDefaultValue = (list_data, id) => {

        if (!list_data || !id)
            return
        return list_data[list_data.findIndex(data => data.value === id)];
    }

    getDefaultValueSelectMulti = (list_data, list_dataEdt) =>{
        var result = [];
        if(!list_data|| !list_dataEdt)
            return result
        list_dataEdt.map((value)=>{
            var index = list_data.findIndex(data=> data.value === value._id)
            return result.push(list_data[index]);
        })
        return result;
    }

    render() {
        return (
            <div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Nama Aplikasi</label>
                    <input name="name" type="text" className="form-control" placeholder="Input Nama Aplikasi" onChange={this.handleFormChange} defaultValue={this.props.data.name} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">PackageName</label>
                    <input name="packageName" type="text" className="form-control" placeholder="Input PackageName com.namaAplikasi.namaGodev" onChange={this.handleFormChange} defaultValue={this.props.data.packageName} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Godev</label>
                    <Select options={this.props.godevs} onChange={this.handleFormSelect} defaultValue={this.getDefaultValue(this.props.godevs,  this.props.data.godev ? this.props.data.godev._id : null)} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Artist</label>
                    <Select options={this.props.artists} isMulti={true} onChange={this.handleFormSelect} defaultValue={this.getDefaultValueSelectMulti(this.props.artists, this.props.data.list_artist)} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Keterangan</label>
                    <input name="ket" type="text" className="form-control" placeholder="Input Keterangan Godev" onChange={this.handleFormChange} defaultValue={this.props.data.ket} />
                </div>
                <div className="form-group">
                    <div className="align-items-center row">
                        <div className="col">
                            <label className="form-control-label" htmlFor="exampleInputEmail1">Iklan Test</label>
                        </div>
                        <div className="col-2">
                            <label className="custom-toggle mr-1">
                                <input name="isTestAds" defaultChecked={this.props.data.isTestAds !== undefined ? this.props.data.isTestAds : true} type="checkbox" onChange={this.handleFormChange} />
                                <span
                                    className="custom-toggle-slider rounded-circle"
                                    data-label-off="No"
                                    data-label-on="Yes"
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="align-items-center row">
                        <div className="col">
                            <label className="form-control-label" htmlFor="exampleInputEmail1">Tampilkan Iklan ?</label>
                        </div>
                        <div className="col-2">
                            <label className="custom-toggle mr-1">
                                <input name="isShowAds" defaultChecked={this.props.data.isShowAds !== undefined ? this.props.data.isShowAds : true} type="checkbox" onChange={this.handleFormChange} />
                                <span
                                    className="custom-toggle-slider rounded-circle"
                                    data-label-off="No"
                                    data-label-on="Yes"
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="align-items-center row">
                        <div className="col">
                            <label className="form-control-label" htmlFor="exampleInputEmail1">Tampilkan Gambar Audio ?</label>
                        </div>
                        <div className="col-2">
                            <label className="custom-toggle mr-1">
                                <input name="isShowImageAudio" defaultChecked={this.props.data.isShowImageAudio !== undefined ? this.props.data.isShowImageAudio : true} type="checkbox" onChange={this.handleFormChange} />
                                <span
                                    className="custom-toggle-slider rounded-circle"
                                    data-label-off="No"
                                    data-label-on="Yes"
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Iklan Terpilih</label>
                    <Select options={this.optionsAds} onChange={this.handleFormSelect} defaultValue={this.getDefaultValue(this.optionsAds,  this.props.data.modeAds)} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Test Device ID</label>
                    <input name="testDeviceID" type="text" className="form-control" placeholder="testDeviceID " onChange={this.handleFormChange} defaultValue={this.props.data.testDeviceID} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Id Banner Admob</label>
                    <input name="idBannerAdmob" type="text" className="form-control" placeholder="Input Id Banner Admob" onChange={this.handleFormChange} defaultValue={this.props.data.idBannerAdmob} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Id Inter Admob</label>
                    <input name="idIntAdmob" type="text" className="form-control" placeholder="Input Id Inter Admob" onChange={this.handleFormChange} defaultValue={this.props.data.idIntAdmob} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Id Native Admob</label>
                    <input name="idNativeAdmob" type="text" className="form-control" placeholder="Input Id Native Admob" onChange={this.handleFormChange} defaultValue={this.props.data.idNativeAdmob} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Id Reward Admob</label>
                    <input name="idRewardAdmob" type="text" className="form-control" placeholder="Input Id Reward Admob" onChange={this.handleFormChange} defaultValue={this.props.data.idRewardAdmob} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Id OpenApp Admob</label>
                    <input name="openIdAdmob" type="text" className="form-control" placeholder="Input Id OpenApp Admob" onChange={this.handleFormChange} defaultValue={this.props.data.openIdAdmob} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Unity GameID</label>
                    <input name="unityGameID" type="text" className="form-control" placeholder="Input Unity Game ID" onChange={this.handleFormChange} defaultValue={this.props.data.unityGameID} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Unity Banner</label>
                    <input name="unityBanner" type="text" className="form-control" placeholder="banner" onChange={this.handleFormChange} defaultValue={this.props.data.unityBanner} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Unity Inter</label>
                    <input name="unityInter" type="text" className="form-control" placeholder="video" onChange={this.handleFormChange} defaultValue={this.props.data.unityInter} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Fan Banner</label>
                    <input name="fanBanner" type="text" className="form-control" placeholder="Input Fan Banner" onChange={this.handleFormChange} defaultValue={this.props.data.fanBanner} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Fan Inter</label>
                    <input name="fanInter" type="text" className="form-control" placeholder="Input Fan Inter" onChange={this.handleFormChange} defaultValue={this.props.data.fanInter} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Mopub Banner</label>
                    <input name="mopubBanner" type="text" className="form-control" placeholder="Input Mopub Banner" onChange={this.handleFormChange} defaultValue={this.props.data.mopubBanner} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Mopub Inter</label>
                    <input name="mopubInter" type="text" className="form-control" placeholder="Input MopubInter" onChange={this.handleFormChange} defaultValue={this.props.data.mopubInter} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">StartappID</label>
                    <input name="startAppId" type="text" className="form-control" placeholder="input startAppID" onChange={this.handleFormChange} defaultValue={this.props.data.startAppId} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Sdk Key AppLovin Inter</label>
                    <input name="sdkKeyAppLovin" type="text" className="form-control" placeholder="input sdkKeyAppLovin" onChange={this.handleFormChange} defaultValue={this.props.data.sdkKeyAppLovin} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">AppLovin Inter</label>
                    <input name="appLovinInter" type="text" className="form-control" placeholder="input appLovinInter" onChange={this.handleFormChange} defaultValue={this.props.data.appLovinInter} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">AppLovin Banner</label>
                    <input name="appLovinBanner" type="text" className="form-control" placeholder="input appLovinBanner" onChange={this.handleFormChange} defaultValue={this.props.data.appLovinBanner} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Interval Interstitial</label>
                    <input name="intervalInt" type="number" className="form-control" placeholder="Input Id Intertitial Ads" onChange={this.handleFormChange} defaultValue={this.props.data.intervalInt} />
                </div>
                <div className="form-group">
                    <div className="align-items-center row">
                        <div className="col">
                            <label className="form-control-label" htmlFor="exampleInputEmail1">Alihkan App</label>
                        </div>
                        <div className="col-2">
                            <label className="custom-toggle mr-1">
                                <input name="isOnRedirect" defaultChecked={this.props.data.isOnRedirect} type="checkbox" onChange={this.handleFormChange} />
                                <span
                                    className="custom-toggle-slider rounded-circle"
                                    data-label-off="No"
                                    data-label-on="Yes"
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Url Alihkan</label>
                    <input name="urlRedirect" type="text" className="form-control" placeholder="Input Url Alihkan App" onChange={this.handleFormChange} defaultValue={this.props.data.urlRedirect} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Url More App</label>
                    <input name="urlMoreApp" type="text" className="form-control" placeholder="Input Url MoreApp" onChange={this.handleFormChange} defaultValue={this.props.data.urlMoreApp} />
                </div>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Privacy Policy App</label>
                    <ReactQuill
                        value={this.state.reactQuillText}
                        onChange={this.handleReactQuillChange}
                        theme="snow"
                        placeholder="input privacy Policy"
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

                {/* <div className="form-group">
                    <label className="form-control-label" htmlFor="exampleInputEmail1">Pilih Artist</label>
                    <select name="artist" type="text" className="form-control" placeholder="Input Keterangan Godev" onChange={this.handleFormChange} value={this.props.data.list_artist !== undefined && this.props.data.list_artist.length > 0 ? this.props.data.list_artist[0]._id : this.props.artists[0]._id} >
                        {
                            this.props.artists.map((artist, index)=>(
                                <option key={index} value={artist._id}>{artist.name}</option>
                            ))
                        }
                    </select>
                </div> */}
            </div>
        );
    }
}

export default FormApplication;