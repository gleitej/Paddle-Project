import React from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

function RiverModal(props) {
  return (
    <Modal
      {...props}
      dialogClassName='modal-90w'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-center'>
          <Row className='justify-content-md-center'>
            <Col md='auto'>{props.river.river}</Col>
          </Row>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className='show-grid'>
            <Col xs={12} md={4}>
              <Link
                className='my-1 btn btn-block btn-outline-warning btn-lg'
                to={`/update-photos/${props.river._id}`}
              >
                Photos
              </Link>
            </Col>
            <Col xs={12} md={4}>
              <Link
                className='my-1 btn btn-block btn-outline-info btn-lg'
                to={`/update-river/${props.river._id}`}
              >
                Info
              </Link>
            </Col>
            <Col xs={12} md={4}>
              <Link
                className='my-1 btn btn-block btn-outline-success btn-lg'
                to={`/edit-map/${props.river._id}`}
              >
                Maps
              </Link>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

export default RiverModal;
