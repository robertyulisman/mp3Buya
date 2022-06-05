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
import FormUsers from './FormUsers';
import SweetAlert from 'react-bootstrap-sweetalert';
import LoadingEllipsis from '../../../components/widgets/Loading/LoadingEllipsis/LoadingEllipsis';
// core components

class TableUsers extends Component {

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
        users: [],
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
            hidden:true
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
                        <img className="avatar rounded-circle mr-3" src={`${API.BASE_URL}${row.image}`} alt="avatar" />
                        <b>{row.name}</b>
                        
                    </>
                )
            }
        },
        {
            dataField: "userName",
            text: "User Name",
            sort: true
        },
        {
            dataField: "level",
            text: "Level",
            sort: true
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
                            Edit User
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
                            Delete User
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

    handleOnInputFormUser = (value) => {
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
        this.loadUsers();
        document.title = "Manage User"
    }

    //methode API
    loadUsers = () => {
        API.getUsers()
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
                    users: result,
                    isShowLoadingTable: false,
                })
            })
            .catch((err) => console.log(err));
    }

    addUser = () => {
        API.addUser(this.state.form.value)
            .then((r) => {
                this.callBackApi(true, `Berhasil menambahkan user ${this.state.form.value.name}`);
            })
            .catch((err) => {
                this.callBackApi(false, err.message)
            })
    }

    editUser = () => {
        var data = this.state.dataEdt;
        API.updateUser(data._id, this.state.form.value)
            .then((r) => {
                this.callBackApi(true, `Berhasil mengedit user ${this.state.dataEdt.name}`);
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
                    this.addUser();
                    break;
                case this.TYPE_MODAL.EDIT:
                    this.editUser();
                    break;
                default:
                    break;
            }
        })
    }

    deleteUser = () => {
        this.setState({
            ...this.state,
            showLoadingAlert: true
        })
        var dataDelete = this.state.alertConfirm;
        API.deleteUser(this.state.alertConfirm._id)
            .then((r) => {
                this.setState({
                    ...this.state,
                    alertConfirm: null,
                    showLoadingAlert: false,
                }, () => {
                    this.callBackApi(true, `Berhasil menghapus user ${dataDelete.name}`);
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
                this.loadUsers();
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
                                            <h3 className=" mb-0">Manage Users</h3>
                                        </div>
                                        <div className="col-auto">
                                            <button className="float-sm-right btn btn-block btn-primary" onClick={this.showModalAdd} ><i className="fas fa-user-plus"></i> Tambah User</button>
                                        </div>
                                    </div>

                                </CardHeader>
                                {/* <TableUserComp data={this.state.users} /> */}
                                <ReactBootstrapTable dataField={"no"} data={this.state.users} columns={this.columns} />
                                {
                                    this.state.isShowLoadingTable &&
                                    <LoadingTable />
                                }
                            </Card>
                        </div>
                    </Row>
                </Container>
                <ReactStrapModal showLoading={this.state.showLoadingModal} title={`${this.state.typeModal} User`} show={this.state.showModal} close={this.hideModal} txtPositiveButton={this.state.typeModal} positiveButton={this.handlePositiveModal}>
                    <FormUsers onSubmit={this.state.onSubmit} onInputUser={(value) => this.handleOnInputFormUser(value)} data={this.state.dataEdt} />
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
                        onConfirm={this.deleteUser}
                        onCancel={this.hideAlert}
                        focusCancelBtn>
                        {
                            `Apakah anda yakin ingin menghapus user ${this.state.alertConfirm.name} ini ?`
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

export default TableUsers;