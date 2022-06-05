import React, { Component } from 'react';
import HeaderBase from '../../../components/layouts/Headers/HeaderBase';
import {
    Card,
    CardHeader,
    Container,
    Row,
} from "reactstrap";

class PageSettingAds extends Component {

    render() {
        return (
            <div>
                <HeaderBase />
                <Container className="mt--7" fluid>
                    {/* Table */}
                    <Row>
                        <div className=" col">
                            <Card className=" shadow">
                                <CardHeader className=" bg-transparent">
                                    <div className="align-items-center row">
                                        <div className="col-auto">
                                            <a href="#back" onClick={
                                                (e) => {
                                                    e.preventDefault()
                                                    this.props.history.goBack()
                                                }
                                            } >
                                                <i className="fas fa-arrow-left" />
                                            </a>
                                        </div>
                                        <div className="col">
                                            <h3 className="mb-0" >Setting Ads</h3>
                                        </div>
                                        <div className="col-auto">
                                            <button className="float-sm-right btn btn-block btn-primary" onClick={this.showModalAdd} ><i className="fas fa-plus"></i> Tambah Music</button>
                                        </div>
                                    </div>

                                </CardHeader>
                            </Card>
                        </div>
                    </Row>
                </Container>
                
               
            </div>
        );
    }
}

export default PageSettingAds;