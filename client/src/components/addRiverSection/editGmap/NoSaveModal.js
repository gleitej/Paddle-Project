import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function NoSaveModal(props) {
  return (
    <Modal
      {...props}
      size='md'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>
          Your map cannot be saved
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You must add either lines or markers</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='success' onClick={props.onHide}>
          Keep Editing
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NoSaveModal;
