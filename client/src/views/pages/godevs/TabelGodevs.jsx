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
import FormGodev from './FormGodev';
import SweetAlert from 'react-bootstrap-sweetalert';
import LoadingEllipsis from '../../../components/widgets/Loading/LoadingEllipsis/LoadingEllipsis';
import { GlobalConsumer } from '../../../context/Context';
import ActionType from '../../../context/GlobalActionContentx';
// core components

class TabelGodevs extends Component {

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
        godevs: [],
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
            hidden : true
        },
        {
            dataField: "nomor",
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
            dataField: "email",
            text: "Email",
            sort: true
        },
        {
            dataField: "ket",
            text: "Keterangan",
            sort: true
        },
        {
            dataField: "list_app",
            text: "Total App",
            sort: true,
            formatter: (rowContent, row) => {
                return (
                   `${rowContent.length} Aplikasi`
                )
            }
        },
        {
            dataField: "createdAt",
            text: "Create At",
            sort: true,
            formatter: (rowContent) => new Date(rowContent).toLocaleString()
        },
        {
            dataField: "updatedAt",
            text: "Update At",
            sort: true,
            formatter: (rowContent) => new Date(rowContent).toLocaleString()
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
                            Edit Godev
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
                            Delete Godev
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

    handleOnInputForm = (value) => {
        let tempForm = { value };
        this.setState({
            ...this.state,
            form: tempForm,
            onSubmit: false,
        })
    }

    hideModal = () => {
        this.setState({
            ...this.state,
            showModal: false
        })
    }

    componentDidMount() {
        this.loadGodev();
        document.title = "Manage Godev"
    }

    //methode API
    loadGodev = () => {
        API.getGodevs()
            .then((r) => {
                var result = [];
                r.map((value, index)=>{
                    var item = {
                        ...value,
                        nomor : index+=1,
                    }
                    return result.push(item)
                })
                this.setState({
                    ...this.state,
                    godevs: result,
                    isShowLoadingTable: false,
                })
                this.props.dispatch({ action: ActionType.SET_GODEVS, data: r })
            })
            .catch((err) => console.log(err));
    }

    addGodev = () => {
        var dataBody = {...this.state.form.value};
        dataBody.user = this.props.state.user._id;
        API.addGodev(dataBody)
            .then((r) => {
                this.callBackApi(true, `Berhasil menambahkan godev ${this.state.form.value.name}`);
            })
            .catch((err) => {
                this.callBackApi(false, err.message)
            })
    }

    editGodev = () => {
        var data = this.state.dataEdt;
        API.updateGodev(data._id, this.state.form.value)
            .then((r) => {
                this.callBackApi(true, `Berhasil mengedit godev ${this.state.dataEdt.name}`);
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
                    this.addGodev();
                    break;
                case this.TYPE_MODAL.EDIT:
                    this.editGodev();
                    break;
                default:
                    break;
            }
        })
    }

    deleteGodev = () => {
        this.setState({
            ...this.state,
            showLoadingAlert: true
        })
        var dataDelete = this.state.alertConfirm;
        API.deleteGodev(this.state.alertConfirm._id)
            .then((r) => {
                this.setState({
                    ...this.state,
                    alertConfirm: null,
                    showLoadingAlert: false,
                }, () => {
                    this.callBackApi(true, `Berhasil menghapus godev ${dataDelete.name}`);
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
                this.loadGodev();
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
                                            <h3 className=" mb-0">Manage Godevs</h3>
                                        </div>
                                        <div className="col-auto">
                                            <button className="float-sm-right btn btn-block btn-primary" onClick={this.showModalAdd} ><i className="fas fa-plus"></i> Tambah Godev</button>
                                        </div>
                                    </div>

                                </CardHeader>
                                {/* <TableUserComp data={this.state.godevs} /> */}
                                <ReactBootstrapTable dataField={"nomor"} isResponsive={true} data={this.state.godevs} columns={this.columns} />
                                {
                                    this.state.isShowLoadingTable &&
                                    <LoadingTable />
                                }
                            </Card>
                        </div>
                    </Row>
                </Container>
                <ReactStrapModal showLoading={this.state.showLoadingModal} title={`${this.state.typeModal} Godev`} show={this.state.showModal} close={this.hideModal} txtPositiveButton={this.state.typeModal} positiveButton={this.handlePositiveModal}>
                    <FormGodev onSubmit={this.state.onSubmit} onInputUser={(value) => this.handleOnInputForm(value)} data={this.state.dataEdt} />
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
                        onConfirm={this.deleteGodev}
                        onCancel={this.hideAlert}
                        focusCancelBtn>
                        {
                            `Apakah anda yakin ingin menghapus godev ${this.state.alertConfirm.name} ini ?`
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

export default GlobalConsumer(TabelGodevs);