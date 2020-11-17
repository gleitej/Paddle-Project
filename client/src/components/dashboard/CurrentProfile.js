import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';

function CurrentProfile({ profile: { craft, bio, level, state, user } }) {
  return (
    <Fragment>
      {!user ? (
        <Spinner />
      ) : (
        <div
          className='container mb-10 shadow-lg p-3 mb-5 bg-white round-30'
          style={{ width: '50vw' }}
        >
          <div className='row  '>
            <div className='col-12 '>
              <img
                className='round-img mx-auto d-block'
                width='150vw'
                height='150vw'
                src={
                  user && user.photo
                    ? user.photo
                    : 'https://paddle-project.s3.us-east-2.amazonaws.com/male-profile-image-placeholder.png'
                }
                alt=''
              />
              <h3 className='text-center'>{user && user.name}</h3>
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
      )}
    </Fragment>
  );
}

CurrentProfile.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default CurrentProfile;
