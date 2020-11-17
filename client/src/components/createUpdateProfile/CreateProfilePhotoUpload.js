import React, { useEffect, Fragment } from 'react';
import FileUpload from '../singleFileUpload/FileUpload';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profiles';

import PropTypes from 'prop-types';

const CreateProfilePhotoUpload = ({ profile }) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);
  return (
    <Fragment>
      <div className='container '>
        <h1 className='text-center'>Choose your profile picture</h1>

        <div className='row mt-10 post'>
          <div className='col-md-6'>
            {profile.user ? (
              <img
                width='200px'
                height='200px'
                className='round-img'
                src={
                  profile.user.photo
                    ? profile.user.photo
                    : 'https://paddle-project.s3.us-east-2.amazonaws.com/male-profile-image-placeholder.png'
                }
                alt=''
              />
            ) : (
              <Spinner />
            )}
            <h2>{profile.user.name}</h2>
          </div>
          <div className='col-md-6'>
            <div className='custom-4'>
              <FileUpload />
            </div>
            <Link className='btn btn-info my-1' to='/dashboard'>
              Next
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
CreateProfilePhotoUpload.propTypes = {
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profiles.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(
  CreateProfilePhotoUpload
);
