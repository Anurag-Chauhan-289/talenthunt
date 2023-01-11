import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalView = ({ title, show, handleClose, imgUrl }) => {

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                {/* <Modal.Title>Modal title</Modal.Title> */}
            </Modal.Header>
            <Modal.Body>
                <img src={imgUrl} style={{ height: '100%', width: '100%' }} />
            </Modal.Body>
        </Modal>
    )
}

export default ModalView;