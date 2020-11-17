import React from 'react';
import PropTypes from 'prop-types';

const PaddlerItem = ({
  profile: {
    user: { _id, name, photo },
    craft,
    bio,
    level,
    state
  }
}) => {
  return (
    <div className='container mb-10'>
      <div className='row post'>
        <div className='col-12'>
          <img
            className='round-img'
            width='100px'
            height='100px'
            src={
              photo
                ? photo
                : 'https://paddle-project.s3.us-east-2.amazonaws.com/male-profile-image-placeholder.png'
            }
            alt=''
          />
          <h4>{name}</h4>
        </div>

        <div className='col-12 paddlers text-center'>
          <div>
            <strong>Paddles: </strong>
            <div>{craft}</div>
          </div>
          <div>
            <strong>Level:</strong>
            <div>{level}</div>
          </div>
          <div>
            <strong>Lives in:</strong>
            <div>{state}</div>
          </div>
        </div>

        <div className='col-12 text-center'>
          <p className='mt-1'>
            <strong>Bio: </strong>
            {bio}
          </p>
        </div>
      </div>
    </div>
  );
};

PaddlerItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default PaddlerItem;
