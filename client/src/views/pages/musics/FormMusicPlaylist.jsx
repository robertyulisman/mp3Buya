import React, { Component } from 'react';
import Select from 'react-select';
import API from '../../../service/API';
import ReactBootstrapTableSelectRow from '../../../components/widgets/ReactBootstrapTable/ReactBootstrapTableSelectRow';
import LoadingTable from '../../../components/widgets/Loading/LoadingTable/LoadingTable';
import SweetAlert from 'react-bootstrap-sweetalert';
import parse from 'html-react-parser';
import LoadingEllipsis from '../../../components/widgets/Loading/LoadingEllipsis/LoadingEllipsis';

class FormMusicPlaylist extends Component {

    state = {
        form: [],
        list_music: [],
        showBtnDownload : false,
        alertError : null,
    }

    columns = [
        {
            dataField: "videoId",
            text: "ID",
            sort: false,
            hidden: true,
        },
        {
            dataField: "no",
            text: "NO",
            sort: true,
        },
        {
            dataField: "title",
            text: "Title",
            sort: true,
            formatter: (rowContent, row) => {
                return (
                    <>
                        <img className="card-img" style={{ width: 108, height: 70, marginRight: 10 }} src={row.image} alt="avatar" />
                        <a style={{ fontSize: "30" }} href={`https://www.youtube.com/watch?v=${row.videoId}`} target="_blank" title={rowContent} rel="noopener noreferrer">{rowContent}</a>
                        {
                            row.isShowLoadingDownload &&  <LoadingEllipsis />
                        }
                       
                    </>
                )
            }
        },
        {
            dataField: "duration",
            text: "Duration",
            sort: true,
        },
        {
            dataField: "status",
            text: "Status",
            sort: true,
            formatter: (rowContent, row) => {
                return (
                    <> 
                    <span className="badge-dot mr-4 badge badge-" >
                    {
                          rowContent === "sukses"  ? <i className="bg-info"></i>:<i className="bg-danger"></i>
                          
                      } 
                      <span className="status" >{rowContent}</span>
                    </span>
                     
                    </>
                )
            }
        },
    ]

    handleFormChange = (event) => {
        let tempForm = { ...this.state.form };
        tempForm[event.target.name] = event.target.value;
        this.setState({
            ...this.state,
            form: tempForm,
        })
    }

    sendMessageErr = (msg) => {
        this.props.msgErr({
            msg: msg
        })
    }

    showLoadingTable = (isShowLoading) => {
        this.props.showLoadingTable({
            isShowLoading: isShowLoading
        })
    }

    getPlaylist = () => {
        var idPlaylist = this.state.form.idPlaylistYT
        if (!idPlaylist) {
            this.sendMessageErr("idPlaylist tidak boleh null")
            return
        }
        this.setState({
            ...this.state,
            list_music: [],
            showBtnDownload : false
        })
        this.showLoadingTable(true)
        API.scrapePlaylistYt(idPlaylist).then((r) => {
            this.setState({
                ...this.state,
                list_music: r.map((value, index) => {
                    var no = index += 1
                    var item = {
                        ...value,
                        _id: no,
                        no: no,
                        status: "menuggu",
                        image : value.thumbnail,
                        isShowLoadingDownload : false,
                        urlDownload : `https://www.youtube.com/watch?v=${value.videoId}`,
                        artist : this.state.form.artist
                    }
                    return item
                }),
                showBtnDownload : r.length > 0 
            }, () => this.showLoadingTable(false))
        }).catch((err) => {
            console.log(err)
            this.sendMessageErr("id playlist tidak valid")
            this.showLoadingTable(false)
        })
    }

    deleteSelectedItem = () => {
        var list_music = this.state.list_music;
        list_music = list_music.filter((value, index) => {
            return this.tempMusicSelected.indexOf(value) === -1
        })
        this.setState({
            ...this.state,
            list_music: list_music
        })
        console.log("list_music", list_music)
    }

    tempMusicSelected = []

    handleOnSelect = (row, isSelect) => {
        if (isSelect && !this.tempMusicSelected.includes(row))
            this.tempMusicSelected.push(row)
        else if (!isSelect && this.tempMusicSelected.includes(row)) {
            const index = this.tempMusicSelected.indexOf(row)
            this.tempMusicSelected.splice(index, 1)
        }
        this.handleCheckBtnDownload()
    }

    handleCheckBtnDownload =() =>{
        if(this.tempMusicSelected.length===0)
        this.setState({
            ...this.state,
            showBtnDownload : false
        })
        console.log("lslsl", this.tempMusicSelected.length);
    }

    handleOnSelectAll = (isSelect, rows) => {
        if (isSelect) {
            this.tempMusicSelected = rows
        } else {
            this.tempMusicSelected = []
        }
    }

    handleFormSelect = (value) => {
        if (!value) return
        let tempForm = { ...this.state.form };
        tempForm[value.name] = value.value;
        var artist = value.value;
        this.setState({
            ...this.state,
            form: tempForm,
            list_music : this.state.list_music.map((value)=>{
                var item = {
                    ...value,
                    artist : artist
                }
                return item
            })
        },()=>{
            console.log("state", this.state)
        })
    }

    downloadLaguPerItem = (music) =>{
        return new Promise((resolve, reject) => {
            delete music._id 
            API.addMusic(music).then((result)=>{
                this.setState({
                    ...this.state,
                    list_music : this.state.list_music.map((value)=>{
                        var item = {
                            ...value,
                            status : value.urlDownload === result.urlDownload ? "sukses" : value.status,
                            isShowLoadingDownload : false,
                        }
                        return item
                    })
                })
                resolve(result)
            }).catch((err)=>{
                console.log("err", err)
                this.setState({
                    ...this.state,
                    list_music : this.state.list_music.map((value)=>{
                        var item = {
                            ...value,
                            status : value.urlDownload === music.urlDownload ? "Duplikat" : value.status,
                            isShowLoadingDownload : false,
                        }
                        return item
                    })
                })
                resolve(null);
            })
        })
        
       
    }

    handleDownloadAll = async() =>{
        if(!this.state.form.artist)
        {
            this.setState({
                ...this.state,
                alertError : "Silahkan pilih artist terlebih dahulu"
            })
            return
        }
        this.asyncForEach(this.state.list_music, async(music)=>{
            this.setState({
                ...this.state,
                list_music : this.state.list_music.map((value)=>{
                    var item = {
                        ...value,
                        isShowLoadingDownload : value.urlDownload === music.urlDownload
                    }
                    return item
                })
            })
            var result = await this.downloadLaguPerItem(music);
            console.log("result", result);
        })
    }

    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

    hideAlert = () =>{
        this.setState({
            ...this.state,
            alertError : null
        })
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-4">
                        <Select onChange={this.handleFormSelect} options={this.props.list_artist} />
                    </div>
                    <div className="col-4">
                        <input className="form-control" name="idPlaylistYT" type="text" onChange={this.handleFormChange} placeholder="input ID playlistYoutube" />
                    </div>
                    <div className="col-4">
                        <button className="btn btn-success" onClick={this.getPlaylist} >Check Url</button>
                    </div>
                </div>

                <ReactBootstrapTableSelectRow isCellEdit={true} handleOnSelectAll={this.handleOnSelectAll} handleOnSelect={this.handleOnSelect} dataField="no" isResponsive={true} data={this.state.list_music} columns={this.columns} >
                    {
                        <div style={{ float: "right" }} >
                            <div className="row">
                                {
                                    this.state.showBtnDownload &&
                                    <div className="col-auto">
                                    <button className="btn btn-primary" onClick={this.handleDownloadAll} >Download All Song</button>
                                    </div>
                                }
                                
                                <div className="col-auto">
                                    <button className="btn btn-danger" onClick={this.deleteSelectedItem} >Delete Selected Item</button>
                                </div>
                            </div>

                        </div>
                    }
                </ReactBootstrapTableSelectRow>
                {
                    this.state.isShowLoadingTable &&
                    <LoadingTable />
                }
                {
                    this.state.alertError &&
                    <SweetAlert danger title="Error" onConfirm={this.hideAlert} >
                        {
                            parse(this.state.alertError)
                        }
                    </SweetAlert>
                }

            </div>
        );
    }
}

export default FormMusicPlaylist;