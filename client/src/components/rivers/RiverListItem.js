import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import RiverSectionModal from './RiverSectionModal';

function RiverListItem({ river }) {
  const [modalShow, setModalShow] = useState(false);

  return (
    <Fragment>
      <div key={river._id}>
        {/* <div onClick={() => setModalShow(true)}> */}
        <Link to={`/rivers/${river._id}`}>
          {river.river} - {river.section}{' '}
          <i
            className='pr-6 fa fa-thumbs-up'
            aria-hidden='true'
            style={{ fontWeight: '10' }}
          ></i>
          <span className='pl-.3 pr-3'>{river.upVote.length}</span>
          <i
            className='fa fa-thumbs-down'
            aria-hidden='true'
            style={{ fontWeight: '10' }}
          ></i>
          <span className='pl.3 pr-5'>{river.downVote.length}</span>
        </Link>
        {/* </div> */}
        <RiverSectionModal
          river={river}
          show={modalShow}
          onHide={() => setModalShow(false)}
          key={river._id}
        />
      </div>
    </Fragment>
  );
}

RiverListItem.propTypes = {};

export default RiverListItem;
