import React, { useState, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { createUpdateProfile } from '../../actions/profiles';
import PropTypes from 'prop-types';

const CreateProfile = ({
  isAuthenticated,
  authLoading,
  createUpdateProfile,
  history,
}) => {
  const [formData, setFormData] = useState({
    craft: '',
    bio: '',
    level: '',
    state: '',
    photo: '',
    name: '',
  });

  const { craft, bio, level, state } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createUpdateProfile(formData, history);
  };

  if (isAuthenticated) {
    return <Redirect to='/' />;
  }
  return (
    <Fragment>
      {authLoading ? (
        <Spinner />
      ) : (
        <div>
          <div className='mlr-20 mt-5 mb-10'>
            <form onSubmit={(e) => onSubmit(e)}>
              <div className='form-group'>
                <label>What craft do you paddle?</label>
                <input
                  onChange={(e) => onChange(e)}
                  type='text'
                  name='craft'
                  placeholder='craft'
                  value={craft}
                  required
                  className='form-control'
                />
              </div>
              <div className='form-group'>
                <label>Bio</label>
                <textarea
                  onChange={(e) => onChange(e)}
                  className='form-control'
                  name='bio'
                  value={bio}
                  rows='3'
                  required
                ></textarea>
              </div>
              <div className='form-group'>
                <label>What level boater are you?</label>
                <select
                  onChange={(e) => onChange(e)}
                  className='form-control'
                  required
                  id='exampleFormControlSelect1'
                  name='level'
                  value={level}
                >
                  <option>Choose one</option>
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
                  className='form-control'
                  required
                  name='state'
                  value={state}
                >
                  <option>Choose one</option>
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

CreateProfile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profiles: PropTypes.object.isRequired,
};

export default connect(null, { createUpdateProfile })(CreateProfile);
