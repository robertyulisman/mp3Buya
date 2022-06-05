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
import HeaderBase from '../../../components/layouts/Headers/HeaderBase';
import LoadingTable from '../../../components/widgets/Loading/LoadingTable/LoadingTable';
import ReactBootstrapTable from '../../../components/widgets/ReactBootstrapTable/ReactBootstrapTable';
import ReactStrapModal from '../../../components/widgets/ReactStrapModal/ReactStrapModal';
import FormApplication from './FormApplication';
import SweetAlert from 'react-bootstrap-sweetalert';
import LoadingEllipsis from '../../../components/widgets/Loading/LoadingEllipsis/LoadingEllipsis';
import FormAddListArtistApp from './FormAddListArtistApp';
import FormSettingAds from './FormSettingAds';
import { GlobalConsumer } from '../../../context/Context';
import Select from 'react-select';
// core components

class TableApplications extends Component {
    TYPE_MODAL = {
        ADD: "Add",
        EDIT: "Edit",
        DELETE: "Delete",
        ADD_ARTIST: "AddArtist",
        SETTING_ADS: "Setting Ads",
    }

    state = {
        showModal: false,
        typeModal: this.TYPE_MODAL.ADD,
        isShowLoadingTable: true,
        showLoadingModal: false,
        listGodev: [],
        dataGodevSelected: this.props.state.list_godev.length > 0 ? this.props.state.list_godev[0] : [],
        myApps: [],
        form: [],
        dataEdt: [],
        alertError: null,
        alertSuccess: null,
        alertConfirm: null,
        showLoadingAlert: false,
        lastIndexFilter: 0,
        listArtists: [],
        deleteArtist: null,
        list_godev_form: []
    };

    expandRow = {
        renderer: row => (
            <div>
                <span>{`Show Ads : ${row.isShowAds}`}</span>
                <span>{`isTestAds : ${row.isTestAds}`}</span>
            </div>
        ),
        showExpandColumn: true
    };

    columns = [
        {
            dataField: "_id",
            text: "NO",
            sort: true,
            hidden: true,

        },
        {
            dataField: "no",
            text: "NO",
            sort: true,
        },
        {
            dataField: "name",
            text: "Name",
            sort: true,
            formatter: (rowContent, row) => {
                return (
                    <>
                        <b>{rowContent}</b>
                    </>
                )
            }
        },
        {
            dataField: "packageName",
            text: "PackageName",
            sort: true
        },
        {
            dataField: "godev.name",
            text: "Godev",
            sort: true
        },
        {
            dataField: "list_artist",
            text: "Artists",
            sort: true,
            formatter: (rowContent, row) => {
                return (
                    <>
                        {
                            rowContent.map((artist, index) => {
                                return (
                                    <>
                                        <button title={artist.name} key={index} className="btn-success btn btn-sm" >{`${artist.name}`}
                                            <a
                                                style={{ color: "#FFF" }}
                                                href="#edit"
                                                id="deleteArtist"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    this.showAlertDeleteArtist(row, artist);
                                                }}
                                            >
                                            </a>
                                        </button>
                                    </>
                                )
                            })
                        }
                    </>
                )
            }

        },
        {
            dataField: "modeAds",
            text: "ADS",
            sort: true,
            formatter: (rowContent, row) => {
                return (
                    <>
                        {rowContent === 1 ? "ADMOB" : 
                        rowContent === 2 ? "FAN" : 
                        rowContent ===3 ? "UNITY ADS" :
                        rowContent === 4 ? "MOPUB" : 
                        rowContent === 5 ? "STARTAPP" : "APPLOVIN"
                        }
                    </>
                )
            }
        },
        {
            dataField: "createdAt",
            text: "Create At",
            sort: true,
            formatter: (rowContent, row) => {
                return (
                    new Date(rowContent).toLocaleString()
                )
            }
        },
        {
            dataField: 'action',
            text: 'Action',
            formatter: (rowContent, row) => {
                return (
                    <>
                        {/* <a
                            className="table-action table-action-delete"
                            href="#settingAds"
                            id="settingAds"
                            onClick={(e) => {
                                e.preventDefault()
                                this.showAlertSettingAds()
                            }}
                        >
                            <i className="fas fa-dollar-sign" />
                        </a>
                        <UncontrolledTooltip delay={0} target="settingAds">
                            Setting Ads
                        </UncontrolledTooltip> */}
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
                            Edit Application
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
                            Delete Application
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

    showAlertSettingAds = () => {
        this.setState({
            ...this.state,
            typeModal: this.TYPE_MODAL.SETTING_ADS,
            showModal: true,
            showLoadingModal: false,
        })
    }

    showModalAddArtist = (data) => {
        this.setState({
            ...this.state,
            form: [],
            dataEdt: data,
            showModal: true,
            typeModal: this.TYPE_MODAL.ADD_ARTIST,
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

    handleChangeFilter = (event) => {
        // var index = event.target.value
        // var data = this.state.listGodev;
        // console.log(data[index]);
        console.log(event)
        if (event.value === "all") {
            this.loadApps();
        }
        else
            this.loadAppByGodev(event.value)

        // this.setState({
        //     ...this.state,
        //     myApps: [],
        //     isShowLoadingTable: true,
        //     dataGodevSelected: data[index],
        //     lastIndexFilter: index,
        // }, () => {
        //     this.loadApps()
        // })
    }

    loadAppByGodev = (body) => {
        API.getAppsByGodev(body)
            .then((r) => {
                this.setState({
                    ...this.state,
                    myApps: r,
                    isShowLoadingTable: false
                })
            })
            .catch((err) => {
                this.callBackApi(false, err.message)
            })
    }

    hideModal = () => {
        this.setState({
            ...this.state,
            showModal: false
        })
    }

    componentDidMount() {
        this.initData()
        document.title = "Manage Application";
    }

    initData = () => {
        API.initDataApp()
            .then((r) => {
                var list_godev = []
                list_godev = [...r.godevs];
                list_godev.push({ value: "all", label: "All" })
                var result = [];
                result = r.apps.map((value, index) => {
                    var item = {
                        ...value,
                        no: index += 1
                    }
                    return item;
                })
                this.setState({
                    ...this.state,
                    myApps: result,
                    listGodev: list_godev,
                    listArtists: r.artists,
                    list_godev_form: r.godevs,
                    isShowLoadingTable: false

                })
            })
            .catch((err) => this.callBackApi(false, err.message))
    }


    //methode API
    loadApps = () => {
        API.getAppsByUser()
            .then((r) => {
                var result = [];
                result = r.map((value, index) => {
                    var item = {
                        ...value,
                        no: index += 1
                    }
                    return item;
                })
                this.setState({
                    ...this.state,
                    myApps: result,
                    isShowLoadingTable: false
                })
            })
            .catch((err) => console.log(err));
    }

    addMyApp = () => {
        var dataBody = { ...this.state.form.value }
        dataBody.user = this.props.state.user._id
        API.addApp(dataBody)
            .then((r) => {
                this.callBackApi(true, `Berhasil menambahkan Application ${this.state.form.value.name}`);
            })
            .catch((err) => {
                this.callBackApi(false, err.message)
            })
    }

    editMyApp = () => {
        var data = this.state.dataEdt;
        API.updateApp(data._id, this.state.form.value)
            .then((r) => {
                this.callBackApi(true, `Berhasil mengedit Application ${this.state.dataEdt.name}`);
            })
            .catch((err) => {
                this.callBackApi(false, err.message)
            })

    }

    addListArtistApp = () => {
        API.addArtistToApp(this.state.dataEdt._id, this.state.form.value.artist)
            .then((r) => {
                this.callBackApi(true, `Berhasil menambahkan Application ${this.state.form.value.name}`);
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
                    this.addMyApp();
                    break;
                case this.TYPE_MODAL.EDIT:
                    this.editMyApp();
                    break;
                case this.TYPE_MODAL.ADD_ARTIST:
                    this.addListArtistApp();
                    break;
                default:
                    break;
            }
        })
    }

    deleteMyApp = () => {
        this.setState({
            ...this.state,
            showLoadingAlert: true
        })
        var dataDelete = this.state.alertConfirm;
        API.deleteApp(this.state.alertConfirm._id, this.state.dataGodevSelected._id)
            .then((r) => {
                this.setState({
                    ...this.state,
                    alertConfirm: null,
                    showLoadingAlert: false,
                }, () => {
                    this.callBackApi(true, `Berhasil menghapus Application ${dataDelete.name}`);
                })

            })
            .catch((err) => {
                this.callBackApi(false, err.message)
            })

    }

    deleteArtistFromApp = () => {
        this.setState({
            ...this.state,
            showLoadingAlert: true
        })
        var dataDelete = this.state.deleteArtist;
        API.deleteArtistFromApp(this.state.alertConfirm._id, this.state.deleteArtist._id)
            .then((r) => {
                this.setState({
                    ...this.state,
                    deleteArtist: null,
                    alertConfirm: null,
                    showLoadingAlert: false,
                }, () => {
                    this.callBackApi(true, `Berhasil menghapus Artist ${dataDelete.name}`);
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
                this.loadApps();
            })
        }
        else {
            this.setState({
                ...this.state,
                showLoadingModal: false,
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

    showAlertDeleteArtist = (dataApp, dataArtist) => {
        this.setState({
            ...this.state,
            typeModal: this.TYPE_MODAL.DELETE,
            alertConfirm: dataApp,
            deleteArtist: dataArtist
        })
    }

    hideAlert = () => {
        this.setState({
            ...this.state,
            alertError: null,
            alertSuccess: null,
            alertConfirm: null,
            deleteArtist: null,
        })
    }

    formModal = () => {
        const typeModal = this.state.typeModal;
        if (typeModal === this.TYPE_MODAL.SETTING_ADS)
            return <FormSettingAds />
        else if (typeModal === this.TYPE_MODAL.ADD_ARTIST)
            return <FormAddListArtistApp onInputUser={(value) => this.handleOnInputForm(value)} artists={this.state.listArtists} godevs={this.state.listGodev} />
        else {
            return <FormApplication onSubmit={this.state.onSubmit} onInputUser={(value) => this.handleOnInputForm(value)} data={this.state.dataEdt} artists={this.state.listArtists} godevs={this.state.list_godev_form} />
        }
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
                                            <h3 className=" mb-0">Manage Applications</h3>
                                        </div>
                                        <div className="col-auto">
                                            <button className="float-sm-right btn btn-block btn-primary" onClick={this.showModalAdd} ><i className="fas fa-plus"></i> Tambah Application</button>
                                        </div>
                                    </div>

                                </CardHeader>
                                <ReactBootstrapTable dataField={"no"} expandRow={this.expandRow} isResponsive={true} data={this.state.myApps} columns={this.columns}>
                                    {
                                        this.state.listGodev.length > 0 &&
                                        <>
                                            <div className="row">
                                                <div className="col-auto">
                                                    <label>
                                                        Filter by Godev:
                                                {/* <div className="float-right" style={{ marginLeft: 10 }} >
                                                    <select className="form-control-sm form-control" name="filter_godev" id="" onChange={this.handleChangeFilter} >
                                                        {
                                                            this.state.listGodev.map((godev, index) => (
                                                                <option key={index} value={index++}>{godev.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div> */}
                                                    </label>
                                                </div>
                                                <div className="col-4">
                                                    <Select
                                                        options={this.state.listGodev}
                                                        defaultValue={this.state.listGodev[this.state.listGodev.length - 1]}
                                                        onChange={this.handleChangeFilter}
                                                    />
                                                </div>
                                            </div>

                                        </>
                                    }
                                </ReactBootstrapTable>
                                {
                                    this.state.isShowLoadingTable &&
                                    <LoadingTable />
                                }
                            </Card>
                        </div>
                    </Row>
                </Container>
                <ReactStrapModal showLoading={this.state.showLoadingModal} title={`${this.state.typeModal} Application`} show={this.state.showModal} close={this.hideModal} txtPositiveButton={this.state.typeModal} positiveButton={this.handlePositiveModal}>
                    {
                        this.formModal()
                        // this.state.typeModal === this.TYPE_MODAL.ADD_ARTIST ?
                        //     <FormAddListArtistApp onInputUser={(value) => this.handleOnInputForm(value)} artists={this.state.listArtists} />
                        //     :
                        //     <FormApplication onSubmit={this.state.onSubmit} onInputUser={(value) => this.handleOnInputForm(value)} data={this.state.dataEdt} artists={this.state.listArtists} />
                    }
                </ReactStrapModal>
                {
                    this.state.alertError &&
                    <SweetAlert danger title="Error" onConfirm={this.hideAlert} >
                        {
                            this.state.alertError
                        }
                    </SweetAlert>
                }
                {
                    this.state.alertSuccess &&
                    <SweetAlert success title="Success" onConfirm={this.hideAlert} >
                        <span>{this.state.alertSuccess}</span>
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
                        onConfirm={this.deleteMyApp}
                        onCancel={this.hideAlert}
                        focusCancelBtn>
                        Apakah anda yakin ingin menghapus Applikasi <b>{this.state.alertConfirm.name}</b> ini ?
                        {
                            this.state.showLoadingAlert &&
                            <LoadingEllipsis />
                        }

                    </SweetAlert>
                }
                {
                    this.state.deleteArtist &&
                    <SweetAlert
                        warning
                        showCancel
                        confirmBtnText="Ya, Hapus"
                        confirmBtnBsStyle="danger"
                        title="Konfirmasi"
                        onConfirm={this.deleteArtistFromApp}
                        onCancel={this.hideAlert}
                        focusCancelBtn>
                        Apakah anda yakin ingin menghapus Artist <b>{this.state.deleteArtist.name}</b> dari app <b>{this.state.alertConfirm.name}</b> ini ?`
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

export default GlobalConsumer(TableApplications);