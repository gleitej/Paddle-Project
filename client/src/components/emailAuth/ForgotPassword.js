import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reCAPTCHKey } from '../../keys';
import ReCAPTCHA from 'react-google-recaptcha';
import { sendPasswordResetLink } from '../../actions/auth';

function ForgotPassword({ sendPasswordResetLink, reset }) {
  const [reCAPTCHA, setReCAPTCHA] = useState(false);

  const [clicked, setClicked] = useState(true);

  const [formData, setFormData] = useState({
    email: '',
  });

  const { email } = formData;

  const change = (value) => {
    value === null ? setReCAPTCHA(false) : setReCAPTCHA(true);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (clicked && reCAPTCHA) {
      setClicked(false);
      await sendPasswordResetLink({ email });
    }
    reset && setReCAPTCHA(false);
  };

  return (
    <div className=' custom-1'>
      <h1 className='row justify-content-center'>Password reset</h1>

      <form
        onSubmit={(e) => {
          onSubmit(e);
        }}
      >
        <div className='p-4 row justify-content-center custom-2'>
          <ReCAPTCHA sitekey={reCAPTCHKey} onChange={change} />
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
        <div className='row justify-content-center custom-2'>
          {reset ? (
            <input
              type='submit'
              className='btn btn-success btn-w'
              value='Link sent'
              disabled
            />
          ) : (
            <input
              type='submit'
              className='btn btn-success btn-w'
              value='Send Link'
            />
          )}
        </div>

        <div className='row justify-content-center'>
          Don't have an account?{' .'} <Link to='/register'> Sign up</Link>
        </div>
      </form>
    </div>
  );
}

ForgotPassword.propTypes = {};
const mapStateToProps = (state) => ({
  reset: state.auth.reset,
});
export default connect(mapStateToProps, { sendPasswordResetLink })(
  ForgotPassword
);
