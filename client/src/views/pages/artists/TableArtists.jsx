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
import FormArtist from './FormArtist';
import SweetAlert from 'react-bootstrap-sweetalert';
import LoadingEllipsis from '../../../components/widgets/Loading/LoadingEllipsis/LoadingEllipsis';
import { GlobalConsumer } from '../../../context/Context';
import ActionType from '../../../context/GlobalActionContentx';
// core components

class TableArtists extends Component {

    TYPE_MODAL = {
        ADD: "Add",
        EDIT: "Edit",
        DELETE: "Delete",
    }

    state = {
        showModal: false,
        typeModal: this.TYPE_MODAL.ADD,
        isShowLoadingTable: true,
        showLoadingModal: false,
        artists: [],
        form: [],
        dataEdt: [],
        alertError: null,
        alertSuccess: null,
        alertConfirm: null,
        showLoadingAlert: false,
    };

    columns = [
        {
            dataField: "_id",
            text: "NO",
            sort: true,
            hidden : true,
        },
        {
            dataField: "no",
            text: "NO",
            sort: true,
        },
        {
            dataField: "name",
            text: "Nama",
            sort: true,
            formatter: (rowContent, row, index) => {
                return (
                    <>
                    <img className="avatar rounded-circle mr-3" src={`${API.BASE_URL}${row.image}`} alt="avatar" />
                    <b>{rowContent}</b>
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
            dataField: "updatedAt",
            text: "Update At",
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
                            Edit Artist
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
                            Delete Artist
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
            dataEdt : [],
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

    handleOnInputForm = (value) => {
        let tempForm = { value };
        this.setState({
            ...this.state,
            form: tempForm,
            onSubmit: false,
        })
        console.log(value);
    }

    hideModal = () => {
        this.setState({
            ...this.state,
            showModal: false
        })
    }

    componentDidMount() {
        this.loadartists();
        document.title = "Manage Artist"
    }

    //methode API
    loadartists = () => {
        API.getArtists()
            .then((r) => {
                var result = [];
                result = r.map((value, index)=>{
                    var item = {
                        ...value,
                        no : index+=1
                    }
                    return item;
                })
                this.setState({
                    ...this.state,
                    artists: result,
                    isShowLoadingTable: false,
                })
                this.props.dispatch({ action: ActionType.SET_ARTIST, data: r })
            })
            .catch((err) => console.log(err));
    }

    addArtist = () => {
        var formState = this.state.form.value;
        const formData = new FormData();
        formData.append('name', formState.name)
        formData.append('image', formState.image)
        API.addArtist(formData)
            .then((r) => {
                this.callBackApi(true, `Berhasil menambahkan artist ${this.state.form.value.name}`);
            })
            .catch((err) => {
                this.callBackApi(false, err.message)
            })
    }

    editArtist = () => {
        var data = this.state.dataEdt;
        var formState = this.state.form.value;
        const formData = new FormData();
        formData.append('name', formState.name)
        formData.append('image', formState.image)
        API.updateArtist(data._id, formData)
            .then((r) => {
                this.callBackApi(true, `Berhasil mengedit artist ${this.state.dataEdt.name}`);
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
                    this.addArtist();
                    break;
                case this.TYPE_MODAL.EDIT:
                    this.editArtist();
                    break;
                default:
                    break;
            }
        })
    }

    deleteArtist = () => {
        this.setState({
            ...this.state,
            showLoadingAlert: true
        })
        var dataDelete = this.state.alertConfirm;
        API.deleteArtist(this.state.alertConfirm._id)
            .then((r) => {
                this.setState({
                    ...this.state,
                    alertConfirm: null,
                    showLoadingAlert: false,
                }, () => {
                    this.callBackApi(true, `Berhasil menghapus artist ${dataDelete.name}`);
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
                this.loadartists();
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

    hideAlert = () => {
        this.setState({
            ...this.state,
            alertError: null,
            alertSuccess: null,
            alertConfirm: null,
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
                                            <h3 className=" mb-0">Manage Artists</h3>
                                        </div>
                                        <div className="col-auto">
                                            <button className="float-sm-right btn btn-block btn-primary" onClick={this.showModalAdd} ><i className="fas fa-user-plus"></i> Tambah Artist</button>
                                        </div>
                                    </div>

                                </CardHeader>
                                {/* <TableUserComp data={this.state.artists} /> */}
                                <ReactBootstrapTable dataField={"no"} data={this.state.artists} columns={this.columns} />
                                {
                                    this.state.isShowLoadingTable &&
                                    <LoadingTable />
                                }
                            </Card>
                        </div>
                    </Row>
                </Container>
                <ReactStrapModal showLoading={this.state.showLoadingModal} title={`${this.state.typeModal} Artist`} show={this.state.showModal} close={this.hideModal} txtPositiveButton={this.state.typeModal} positiveButton={this.handlePositiveModal}>
                    <FormArtist onSubmit={this.state.onSubmit} onInputUser={(value) => this.handleOnInputForm(value)} data={this.state.dataEdt} />
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
                        {
                            this.state.alertSuccess
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
                        onConfirm={this.deleteArtist}
                        onCancel={this.hideAlert}
                        focusCancelBtn>
                        {
                            `Apakah anda yakin ingin menghapus artist ${this.state.alertConfirm.name} ini ?`
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

export default GlobalConsumer(TableArtists);