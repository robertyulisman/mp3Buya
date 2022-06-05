import React, { useState, useEffect } from 'react'
import { Button, Modal, CardHeader, ModalBody, CardFooter } from 'reactstrap';
import LoadingEllipsis from '../Loading/LoadingEllipsis/LoadingEllipsis';

export default function ReactStrapModal(props) {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useEffect(() => {
        if (props.show)
            handleShow()
        else
            handleClose()
        return () => {

        }
    })

    return (
        <div>
            <Modal isOpen={show} toggle={props.close} size={props.size ? props.size : ""} >
                <CardHeader ><b>{props.title}</b></CardHeader>
                <ModalBody>
                    {
                        props.children
                    }
                    {
                        props.content && <p>{props.content}</p>
                    }
                </ModalBody>
                <CardFooter>
                    {
                        props.showLoading &&
                        <div className="float-left" style={{ marginTop: -10 }} >
                            <span>Loading</span>
                            <LoadingEllipsis />
                        </div>
                    }
                    <div className="float-right">
                        <Button color="secondary" onClick={props.close}>Cancel</Button>
                        {
                            props.positiveButton &&
                            <Button color="primary" onClick={props.positiveButton}> {props.txtPositiveButton}</Button>
                        }
                    </div>
                </CardFooter>
            </Modal>
        </div>
    )
}
