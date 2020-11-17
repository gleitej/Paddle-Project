import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { register } from '../../actions/auth';
import { setAlert } from '../../actions/alert';
import { reCAPTCHKey } from '../../keys';
import ReCAPTCHA from 'react-google-recaptcha';
import PropTypes from 'prop-types';

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const recaptchaRef = React.useRef();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      recaptchaRef.current.execute();

      register({ name, email, password });
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <div className=' custom-1'>
      <h1 className='row justify-content-center'>Register</h1>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <ReCAPTCHA
            ref={recaptchaRef}
            size='invisible'
            sitekey={reCAPTCHKey}
          />
          <input
            onChange={(e) => onChange(e)}
            type='text'
            name='name'
            className='form-control'
            placeholder='Full Name'
            value={name}
            required
          />
        </div>
        <div className='form-group'>
          <input
            onChange={(e) => onChange(e)}
            type='text'
            name='email'
            className='form-control'
            placeholder='Email'
            value={email}
            required
          />
        </div>
        <div className='form-group'>
          <input
            onChange={(e) => onChange(e)}
            type='password'
            name='password'
            className='form-control'
            value={password}
            placeholder='Password'
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            name='password2'
            className='form-control'
            placeholder='Password'
            onChange={(e) => onChange(e)}
            value={password2}
            required
          />
        </div>
        <div className='row justify-content-center custom-2'>
          <input
            type='submit'
            className='btn btn-success btn-w'
            value='Register'
          />
        </div>
        <div className='row justify-content-center'>
          Have an account?{' .'} <Link to='/login'> login</Link>
        </div>
      </form>
    </div>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
