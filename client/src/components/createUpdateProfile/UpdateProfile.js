import React, { useEffect, useState, Fragment } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import FileUpload from '../singleFileUpload/FileUpload';
import { connect } from 'react-redux';
import Alert from '../../components/layout/Alert';
import Spinner from '../layout/Spinner';
import { getCurrentProfile, createUpdateProfile } from '../../actions/profiles';
import PropTypes from 'prop-types';

const UpdateProfile = ({
  profiles: { profileLoading, profile },
  getCurrentProfile,
  createUpdateProfile,
  isAuthenticated,
  history,
}) => {
  const [formData, setFormData] = useState({
    craft: '',
    bio: '',
    level: '',
    state: '',
    // photo: '',
    // name: ''
  });

  useEffect(() => {
    getCurrentProfile();
    setFormData({
      craft: profileLoading || !profile.craft ? '' : profile.craft,
      bio: profileLoading || !profile.bio ? '' : profile.bio,
      level: profileLoading || !profile.level ? '' : profile.level,
      state: profileLoading || !profile.state ? '' : profile.state,
      // name: profileLoading || !profile.user.name ? '' : profile.user.name
    });
  }, [
    profileLoading,
    getCurrentProfile,
    profile.bio,
    profile.craft,
    profile.level,
    profile.state,
  ]);

  const { craft, bio, level, state, name } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createUpdateProfile(formData, history, true);
  };

  if (!isAuthenticated && !profileLoading) {
    return <Redirect to='/' />;
  }
  return (
    <Fragment>
      {profileLoading ? (
        <Spinner />
      ) : (
        <div className='mb-10'>
          <div className='container '>
            <div className='row mt-10 post'>
              <div className='col align-self-center'>
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
                <h2>{name}</h2>
              </div>
              <div className='col align-self-center'>
                <div className='custom-4'>
                  <FileUpload />
                </div>
              </div>
            </div>
          </div>
          <div className='mt-10'>
            <form onSubmit={(e) => onSubmit(e)}>
              <div className='form-group'>
                <label>What craft do you paddle?</label>
                <input
                  type='text'
                  placeholder='craft'
                  name='craft'
                  value={craft}
                  onChange={(e) => onChange(e)}
                  className='form-control'
                  id='exampleFormControlInput1'
                  required
                />
              </div>
              <div className='form-group'>
                <label>Bio</label>
                <textarea
                  onChange={(e) => onChange(e)}
                  name='bio'
                  value={bio}
                  className='form-control'
                  id='exampleFormControlTextarea1'
                  rows='3'
                  required
                ></textarea>
              </div>
              <div className='form-group'>
                <label>What level boater are you?</label>
                <select
                  onChange={(e) => onChange(e)}
                  name='level'
                  value={level}
                  className='form-control'
                  required
                  id='exampleFormControlSelect1'
                >
                  <option>1</option>
                  <option>2 +</option>
                  <option>2</option>
                  <option>3</option>
                  <option>3 +</option>
                  <option>4</option>
                  <option>4 +</option>
                  <option>5</option>
                  <option>5 +</option>
                </select>
              </div>
              <div className='form-group'>
                <label>What State do you live in?</label>
                <select
                  onChange={(e) => onChange(e)}
                  name='state'
                  value={state}
                  className='form-control'
                  id='exampleFormControlSelect1'
                >
                  <option>Alabama</option>
                  <option>Alaska</option>
                  <option>Arizona</option>
                  <option>Arkansas</option>
                  <option>California</option>
                  <option>Colorado</option>
                  <option>Connecticut</option>
                  <option>Delaware</option>
                  <option>District Of Columbia</option>
                  <option>Florida</option>
                  <option>Georgia</option>
                  <option>Hawaii</option>
                  <option>Idaho</option>
                  <option>Illinois</option>
                  <option>Indiana</option>
                  <option>Iowa</option>
                  <option>Kansas</option>
                  <option>Kentucky</option>
                  <option>Louisiana</option>
                  <option>Maine</option>
                  <option>Maryland</option>
                  <option>Massachusetts</option>
                  <option>Michigan</option>
                  <option>Minnesota</option>
                  <option>Mississippi</option>
                  <option>Missouri</option>
                  <option>Montana</option>
                  <option>Nebraska</option>
                  <option>Nevada</option>
                  <option>New Hampshire</option>
                  <option>New Jersey</option>
                  <option>New Mexico</option>
                  <option>New York</option>
                  <option>North Carolina</option>
                  <option>North Dakota</option>
                  <option>Ohio</option>
                  <option>Oklahoma</option>
                  <option>Oregon</option>
                  <option>Pennsylvania</option>
                  <option>Rhode Island</option>
                  <option>South Carolina</option>
                  <option>South Dakota</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Utah</option>
                  <option>Vermont</option>
                  <option>Virginia</option>
                  <option>Washington</option>
                  <option>West Virginia</option>
                  <option>Wisconsin</option>
                  <option>Wyoming</option>
                </select>
              </div>
              <Alert />
              <Link className='btn btn-info my-1' to='/dashboard'>
                Back
              </Link>
              <button className='btn btn-submit btn-success'>Save</button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
};

UpdateProfile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  createUpdateProfile: PropTypes.func.isRequired,
  profiles: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profiles: state.profiles,
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, {
  getCurrentProfile,
  createUpdateProfile,
})(withRouter(UpdateProfile));
