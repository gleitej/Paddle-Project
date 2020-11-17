import React, { useEffect, Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { reCAPTCHKey } from '../../keys';

// actions
import { getKey } from '../../actions/auth';
import { confirmEmail } from '../../actions/userRole';

// components
import Spinner from '../layout/Spinner';

function ConfirmEmail({
  match,
  getKey,
  confirmEmail,
  auth: { authLoading, key },
  userRole: { role },
}) {
  useEffect(() => {
    getKey(match.params.keyid);
  }, [getKey, match.params.keyid]);

  const [formData, setFormData] = useState(
    {
      email: '',
      password: '',
      userId: match.params.userid,
      keyId: match.params.keyid,
    },
    [getKey, match.params.keyid]
  );

  const recaptchaRef = React.useRef();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    recaptchaRef.current.execute();
    await confirmEmail(formData);
  };

  // redirect user when confirmed
  if (role === 'user' || role === 'admin') {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      {authLoading ? (
        <Spinner />
      ) : key === null || key.user !== match.params.userid ? (
        <div className='alert alert-secondary text-center' role='alert'>
          This Link not valid
          <Link to='/'> Return to Paddle Project</Link>
        </div>
      ) : (
        <Fragment>
          <div className=' custom-1'>
            <h1 className='row justify-content-center'>Confirm Email</h1>
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
              <div className='row justify-content-center custom-2'>
                <input
                  type='submit'
                  className='btn btn-success btn-w'
                  value='Confirm'
                />
              </div>
            </form>
          </div>
        </Fragment>
      )}{' '}
    </Fragment>
  );
}

ConfirmEmail.propTypes = {};

const mapStateToProps = (state) => ({
  profiles: state.profiles,
  userRole: state.userRole,
  rivers: state.rivers,
  auth: state.auth,
});

export default connect(mapStateToProps, { getKey, confirmEmail })(ConfirmEmail);
