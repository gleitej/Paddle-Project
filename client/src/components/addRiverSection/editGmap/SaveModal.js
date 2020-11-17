import React from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function SaveModal(props) {
  return (
    <Modal
      {...props}
      size='md'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>
          Your map has been saved
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Thanks</h4>
        <p>
          Paddle project thanks you for your contribution. Don't forget you can
          edit your contribution at anytime in your dashboard
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='success' onClick={props.onHide}>
          Keep Editing
        </Button>
        <Link
          className='btn btn-primary'
          to='/dashboard'
          onClick={props.onHide}
        >
          Dashboard
        </Link>
      </Modal.Footer>
    </Modal>
  );
}

export default SaveModal;
