import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { resetPassword, checkTokenStatus } from '../../actions/auth';
import { setAlert } from '../../actions/alert';
import ReCAPTCHA from 'react-google-recaptcha';
import { reCAPTCHKey } from '../../keys';
import Spinner from '../layout/Spinner';

function ResetPassword({
  setAlert,
  resetPassword,
  checkTokenStatus,
  match,
  reset,
  tokenStatus,
}) {
  const token = match.params.token;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
  });

  const recaptchaRef = React.useRef();

  useEffect(() => {
    checkTokenStatus(token);
  }, [token, checkTokenStatus]);

  const { email, password, password2 } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      recaptchaRef.current.execute();
      resetPassword({ email, password, token });
    }
  };

  return (
    <Fragment>
      {tokenStatus === null ? (
        <Spinner />
      ) : (
        <div className='container w-50 '>
          <h1 className='p-5 row justify-content-center text-center'>
            Reset Password
          </h1>
          {reset && (
            <div className='alert alert-secondary text-center' role='alert'>
              Your password has been reset. Please{' '}
              <Link to='/login'>Login</Link>
            </div>
          )}
          {tokenStatus.valid ? (
            <form className='2- form' onSubmit={(e) => onSubmit(e)}>
              <div className='form-group'>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  size='invisible'
                  sitekey={reCAPTCHKey}
                />
                <input
                  onChange={(e) => onChange(e)}
                  type='text'
                  name='email'
                  className='form-control'
                  placeholder='Current Email'
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
                  placeholder='New Password'
                  required
                />
              </div>
              <div className='form-group'>
                <input
                  type='password'
                  name='password2'
                  className='form-control'
                  placeholder='New Password'
                  onChange={(e) => onChange(e)}
                  value={password2}
                  required
                />
              </div>

              <div className='row justify-content-center custom-2'>
                {reset ? (
                  <input
                    type='submit'
                    className='btn btn-success btn-w'
                    value='Reset'
                    disabled
                  />
                ) : (
                  <input
                    type='submit'
                    className='btn btn-success btn-w'
                    value='Reset'
                  />
                )}
              </div>
              <div className='row justify-content-center'>
                Have an account?{' .'} <Link to='/login'> login</Link>
              </div>
            </form>
          ) : (
            <div className='alert alert-secondary text-center' role='alert'>
              {tokenStatus.msg}
              <Link to='/forgot-password'> Request new link</Link>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
}

ResetPassword.propTypes = {};

const mapStateToProps = (state) => ({
  reset: state.auth.reset,
  tokenStatus: state.auth.tokenStatus,
});

export default connect(mapStateToProps, {
  setAlert,
  resetPassword,
  checkTokenStatus,
})(ResetPassword);
