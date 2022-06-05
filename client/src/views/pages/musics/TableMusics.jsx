import React, { Component } from 'react';
// reactstrap components
import {
    Card,
    CardHeader,
    Container,
    Row,
    UncontrolledTooltip,
} from "reactstrap";
import API from '../../../service/API';
import LoadingTable from '../../../components/widgets/Loading/LoadingTable/LoadingTable';
import ReactStrapModal from '../../../components/widgets/ReactStrapModal/ReactStrapModal';
import FormMusic from './FormMusic';
import SweetAlert from 'react-bootstrap-sweetalert';
import LoadingEllipsis from '../../../components/widgets/Loading/LoadingEllipsis/LoadingEllipsis';
import { GlobalConsumer } from '../../../context/Context';
import Select from 'react-select';
import parse from 'html-react-parser';
import HeaderBase from '../../../components/layouts/Headers/HeaderBase';
import FormMusicPlaylist from './FormMusicPlaylist';
import ReactBootstrapTableSelectRow from '../../../components/widgets/ReactBootstrapTable/ReactBootstrapTableSelectRow';

class TableMusics extends Component {

    TYPE_MODAL = {
        ADD: "Add",
        EDIT: "Edit",
        DELETE: "Delete",
    }

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            typeModal: this.TYPE_MODAL.ADD,
            isShowLoadingTable: true,
            showLoadingModal: false,
            musics: [],
            form: [],
            dataEdt: [],
            alertError: null,
            alertSuccess: null,
            alertConfirm: null,
            alertConfirmDeleteSelected: null,
            showLoadingAlert: false,
            id_artist_selected: "all",
            list_artist: [],
            list_artist_form: [],
            onCheckUrlDownload: false,
            showLoadingModalPlaylist: false,
            showModalPlaylist: false,
            showBtnSelectedDelete: false,
        };
    }

    columns = [
        {
            dataField: "_id",
            text: "ID",
            sort: true,
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
                console.log('ini data semua', row)
                return (
                    <>
                        <img className="avatar rounded-circle mr-3"
                            src={row.image}

                            alt="avatar" />
                        <a href={row.url} target="_blank" title={rowContent} rel="noopener noreferrer">{rowContent}</a>
                    </>
                )
            }
        },
        {
            dataField: "artist.name",
            text: "Artist",
            sort: true,
        },
        {
            dataField: "duration",
            text: "Duration",
            sort: true,
        },
        {
            dataField: "lyric",
            text: "Lyric",
            sort: true,
            formatter: (rowContent, row) => {
                return (
                    <>
                        <b>{rowContent ? "Ada" : "Tidak Ada"}</b>
                    </>
                )
            }
        },
        {
            dataField: "views",
            text: "Views",
            sort: true
        },
        {
            dataField: "last_view",
            text: "Last View",
            sort: true,
            formatter: (rowContent, row) => {
                return (
                    new Date(parseInt(rowContent)).toLocaleString()
                )
            }
        },
        {
            dataField: 'action',
            text: 'Action',
            formatter: (rowContent, row) => {
                return (
                    <>
                        <a
                            className="table-action table-action-delete"
                            href="#edit"
                            id="edit"
                            onClick={(e) => {
                                e.preventDefault()
                                this.showModalEdit(row)
                            }}
                        >
                            <i className="fas fa-user-edit" />
                        </a>
                        <UncontrolledTooltip delay={0} target="edit">
                            Edit Audio
                        </UncontrolledTooltip>
                        <a
                            className="table-action table-action-delete"
                            href="#delete"
                            id="delete"
                            onClick={(e) => {
                                e.preventDefault()
                                this.showAlertDelete(row)

                            }}
                        >
                            <i className="fas fa-trash" />
                        </a>
                        <UncontrolledTooltip delay={0} target="delete">
                            Delete Audio
                        </UncontrolledTooltip>
                    </>
                )
            }
        }
    ]


    showModalAdd = () => {
        this.setState({
            ...this.state,
            form: [],
            dataEdt: [],
            showModal: true,
            typeModal: this.TYPE_MODAL.ADD,
            showLoadingModal: false
        })
    }

    showModalAddPlaylist = () => {
        this.setState({
            ...this.state,
            showLoadingModalPlaylist: false,
            showModalPlaylist: true
        })
    }

    showModalEdit = (data) => {
        this.setState({
            ...this.state,
            form: [],
            dataEdt: data,
            showModal: true,
            typeModal: this.TYPE_MODAL.EDIT,
            showLoadingModal: false,
        })
    }

    handleOnInputForm = (value) => {
        let tempForm = { value };
        this.setState({
            ...this.state,
            form: tempForm,
            onSubmit: false,
        })
        console.log(value);
    }

    handleOnCheckUrlDownload = (showLoadingModal, dataResult) => {
        this.setState({
            ...this.state,
            showLoadingModal: showLoadingModal,
            dataEdt: dataResult,
            form: {
                value: dataResult,
            },
        }, () => {
            console.log("handleOnCheckUrlDownload", this.state)
        })

    }

    hideModal = () => {
        this.setState({
            ...this.state,
            showModal: false,
            showModalPlaylist: false
        })
    }

    //methode API
    initData = () => {
        API.initDataMusic()
            .then((r) => {
                var list_artist = [...r.artists]
                list_artist.push({ value: "all", label: "All" })
                this.setState({
                    ...this.state,
                    musics: r.musics,
                    list_artist: list_artist,
                    list_artist_form: r.artists,
                    isShowLoadingTable: false,
                })
            })
            .catch((err) => {
                var strErr = err.message ? err.message : err;
                this.callBackApi(false, strErr)
                console.log(err)
            });
    }

    addMusic = () => {
        API.addMusic(this.state.form.value)
            .then((r) => {
                this.callBackApi(true, `Berhasil menambahkan audio ${this.state.form.value.title}`);
            })
            .catch((err) => {
                this.callBackApi(false, err.message)
            })
    }

    editMusic = () => {
        API.updateMusic(this.state.dataEdt._id, this.state.form.value)
            .then((r) => {
                this.callBackApi(true, `Berhasil mengedit audio ${this.state.dataEdt.title}`);
            })
            .catch((err) => {
                this.callBackApi(false, err.message)
            })

    }

    handlePositiveModal = () => {
        this.setState({
            ...this.state,
            showLoadingModal: true
        }, () => {
            switch (this.state.typeModal) {
                case this.TYPE_MODAL.ADD:
                    this.addMusic();
                    break;
                case this.TYPE_MODAL.EDIT:
                    this.editMusic();
                    break;
                default:
                    break;
            }
        })
    }

    deleteMusic = () => {
        this.setState({
            ...this.state,
            showLoadingAlert: true
        })
        var dataDelete = this.state.alertConfirm;
        API.deleteMusic(this.state.alertConfirm._id)
            .then((r) => {
                this.setState({
                    ...this.state,
                    alertConfirm: null,
                    showLoadingAlert: false,
                }, () => {
                    this.callBackApi(true, `Berhasil menghapus godev ${dataDelete.title}`);
                })

            })
            .catch((err) => {
                this.callBackApi(false, err.message)
            })

    }

    callBackApi = (isSuccess, message) => {
        if (isSuccess) {
            this.setState({
                ...this.state,
                showModal: false,
                showLoadingModal: false,
                alertSuccess: message,
            }, () => {
                if (this.state.id_artist_selected && this.state.id_artist_selected !== "all")
                    this.getMusicByArtist(this.state.id_artist_selected);
                else
                    this.loadMusic();
            })
        }
        else {
            this.setState({
                ...this.state,
                showLoadingModal: false,
                isShowLoadingTable: false,
                alertError: message
            })
        }
    }

    showAlertDelete = (data) => {
        this.setState({
            ...this.state,
            typeModal: this.TYPE_MODAL.DELETE,
            alertConfirm: data
        })
    }

    hideAlert = () => {
        this.setState({
            ...this.state,
            alertError: null,
            alertSuccess: null,
            alertConfirm: null,
            alertConfirmDeleteSelected: null
        })
    }

    handleChangeFilter = (event) => {
        console.log("eveee", event)
        this.setState({
            ...this.state,
            musics: [],
            id_artist_selected: event.value,
            isShowLoadingTable: true,
        })
        if (event.value && event.value !== "all")
            this.getMusicByArtist(event.value);
        else
            this.loadMusic()
    }

    loadMusic = () => {
        API.getMusics().then((r) => {
            this.setState({
                ...this.state,
                musics: r,
                isShowLoadingTable: false,
            }) 
        }).catch((err) => this.callBackApi(err.message))
    }

    getMusicByArtist = (id_artist) => {
        API.getMusicsByArtist(id_artist).then((r) => {
            this.setState({
                ...this.state,
                musics: r,
                isShowLoadingTable: false,
            })
        }).catch((err) => this.callBackApi(err.message))
    }

    tempMusicSelected = [];

    handleShowBtnSelectedDelet() {
        this.setState({
            ...this.state,
            showBtnSelectedDelete: this.tempMusicSelected.length > 0
        })
    }

    handleOnSelectAll = (isSelect, rows) => {
        if (isSelect) {
            this.tempMusicSelected = rows
        } else {
            this.tempMusicSelected = []
        }
        this.handleShowBtnSelectedDelet()
    }

    handleOnSelect = (row, isSelect) => {
        if (isSelect && !this.tempMusicSelected.includes(row))
            this.tempMusicSelected.push(row)
        else if (!isSelect && this.tempMusicSelected.includes(row)) {
            const index = this.tempMusicSelected.indexOf(row)
            this.tempMusicSelected.splice(index, 1)
        }
        this.handleShowBtnSelectedDelet()
    }

    showModalDeleteMusicSelected = () => {
        this.setState({
            ...this.state,
            alertConfirmDeleteSelected: true
        })
    }

    componentDidMount() {
        this.initData()
        document.title = "Manage Audio"
    }

    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    deleteItemMusic = (idMusic) => {
        return new Promise((resolve, reject) => {
            API.deleteMusic(idMusic).then((r) => {
                resolve(r)
            }).catch((err) => resolve(err))
        })

    }

    deleteSelectedMusic = async () => {
        this.setState({
            ...this.state,
            showLoadingAlert: true
        })
        this.asyncForEach(this.tempMusicSelected, async (music) => {
            await this.deleteItemMusic(music._id)
        }).then(() => {
            this.setState({
                ...this.state,
                alertConfirmDeleteSelected: false,
                showLoadingAlert: false,
                showBtnSelectedDelete: false
            }, () => {
                this.callBackApi(true, `Success menghapus ${this.tempMusicSelected.length} music`)
                this.tempMusicSelected = []
            })

        })
    }


    render() {
        return (
            <>
                <HeaderBase />
                {/* Page content */}
                <Container className="mt--7" fluid>
                    {/* Table */}
                    <Row>
                        <div className=" col">
                            <Card className=" shadow">
                                <CardHeader className=" bg-transparent">
                                    <div className="row">
                                        <div className="col">
                                            <h3 className=" mb-0">Gudang Audio</h3>
                                        </div>
                                        <div className="col-auto">
                                            <button className="float-sm-right btn btn-block btn-primary" onClick={this.showModalAdd} ><i className="fas fa-plus"></i> Tambah Audio</button>
                                        </div>
                                        <div className="col-auto">
                                            <button className="float-sm-right btn btn-block btn-warning" onClick={this.showModalAddPlaylist} ><i className="fas fa-plus"></i> Tambah Audio By Playlist</button>
                                        </div>
                                    </div>

                                </CardHeader>
                                <ReactBootstrapTableSelectRow handleOnSelectAll={this.handleOnSelectAll} handleOnSelect={this.handleOnSelect} dataField="no" isResponsive={true} data={this.state.musics} columns={this.columns} >
                                    {
                                        this.state.list_artist.length > 0 &&
                                        <>
                                            <div className="row">
                                                <div className="col-auto">
                                                    <label>
                                                        Filter by Artist:
                                                    </label>
                                                </div>
                                                <div className="col-4">
                                                    <Select
                                                        options={this.state.list_artist}
                                                        defaultValue={this.state.list_artist[this.state.list_artist.length - 1]}
                                                        onChange={this.handleChangeFilter}
                                                    />
                                                </div>
                                                {
                                                    this.state.showBtnSelectedDelete &&
                                                    <div className="col">
                                                        <button className="btn btn-danger" onClick={this.showModalDeleteMusicSelected} >Delete Selected Item</button>
                                                    </div>
                                                }
                                            </div>
                                        </>
                                    }

                                </ReactBootstrapTableSelectRow>
                                {
                                    this.state.isShowLoadingTable &&
                                    <LoadingTable />
                                }
                            </Card>
                        </div>
                    </Row>
                </Container>
                <ReactStrapModal showLoading={this.state.showLoadingModal} title={`${this.state.typeModal} Audio`} show={this.state.showModal} close={this.hideModal} txtPositiveButton={this.state.typeModal} positiveButton={this.handlePositiveModal}>
                    <FormMusic msgErr={(value) => this.setState({
                        ...this.state,
                        alertError: value.msg
                    })} list_artist={this.state.list_artist_form} onSubmit={this.state.onSubmit} onCheckUrlDownload={(showLoadingModal, dataResult) => this.handleOnCheckUrlDownload(showLoadingModal, dataResult)} onInputUser={(value) => this.handleOnInputForm(value)} data={this.state.dataEdt} />
                </ReactStrapModal>
                <ReactStrapModal title={"Tambah Audio By Playlist"} size={"xl"} showLoading={this.state.showLoadingModalPlaylist} show={this.state.showModalPlaylist} close={this.hideModal} >
                    <FormMusicPlaylist list_artist={this.state.list_artist_form} msgErr={(value) => this.setState({
                        ...this.state,
                        alertError: value.msg
                    })} showLoadingTable={(value) => this.setState({
                        ...this.state,
                        showLoadingModalPlaylist: value.isShowLoading
                    })} />
                </ReactStrapModal>
                {
                    this.state.alertError &&
                    <SweetAlert danger title="Error" onConfirm={this.hideAlert} >
                        {
                            parse(this.state.alertError)
                        }
                    </SweetAlert>
                }
                {
                    this.state.alertSuccess &&
                    <SweetAlert success title="Success" onConfirm={this.hideAlert} >
                        {
                            parse(this.state.alertSuccess)
                        }
                    </SweetAlert>
                }
                {
                    this.state.alertConfirm &&
                    <SweetAlert
                        warning
                        showCancel
                        confirmBtnText="Ya, Hapus"
                        confirmBtnBsStyle="danger"
                        title="Konfirmasi"
                        onConfirm={this.deleteMusic}
                        onCancel={this.hideAlert}
                        focusCancelBtn>
                        {
                            parse(`Apakah anda yakin ingin menghapus Audio <b>${this.state.alertConfirm.title}</b> ini ?`)
                        }
                        {
                            this.state.showLoadingAlert &&
                            <LoadingEllipsis />
                        }

                    </SweetAlert>
                }
                {
                    this.state.alertConfirmDeleteSelected &&
                    <SweetAlert
                        warning
                        showCancel
                        confirmBtnText="Ya, Hapus"
                        confirmBtnBsStyle="danger"
                        title="Konfirmasi"
                        onConfirm={this.deleteSelectedMusic}
                        onCancel={this.hideAlert}
                        focusCancelBtn>
                        {
                            parse(`Apakah anda yakin ingin menghapus <b> ${this.tempMusicSelected.length} Audio terpilih ini</b> ?`)
                        }
                        {
                            this.state.showLoadingAlert &&
                            <LoadingEllipsis />
                        }

                    </SweetAlert>
                }
            </>
        );
    }
}

export default GlobalConsumer(TableMusics);