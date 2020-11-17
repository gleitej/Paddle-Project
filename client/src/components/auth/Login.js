import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { login } from '../../actions/auth';
import ReCAPTCHA from 'react-google-recaptcha';
import { reCAPTCHKey } from '../../keys';
import PropTypes from 'prop-types';

const Login = ({ login, isAuthenticated, userRole: { role } }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [attempts, setAttempts] = useState(0);
  const [notRobot, setNotRobot] = useState(true);
  const [check, setCheck] = useState(true);

  const recaptchaRef = React.useRef();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setAttempts(attempts + 1);
    if (check && attempts > 4) {
      setNotRobot(false);
      setCheck(false);
      const token = await recaptchaRef.current.executeAsync();
      console.log(token);
      token && setNotRobot(true);
    }
    notRobot && (await login({ email, password }));
  };

  // Redirect if logged in
  if (
    (isAuthenticated && role === 'pending') ||
    role === 'user' ||
    role === 'admin'
  ) {
    return <Redirect to='/dashboard' />;
  }

  if (isAuthenticated && role === 'masterAdmin') {
    return <Redirect to='/master-admin/dashboard' />;
  }

  return (
    <div className=' custom-1'>
      <h1 className='row justify-content-center'>Login</h1>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='p-4 row justify-content-center custom-2'>
          <ReCAPTCHA
            ref={recaptchaRef}
            size='invisible'
            sitekey={reCAPTCHKey}
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

        <div className='row justify-content-center custom-2'>
          <input
            type='submit'
            className='btn btn-success btn-w'
            value='Login'
          />
        </div>

        <div className='row justify-content-center'>
          Don't have an account?{' .'} <Link to='/register'> Sign up</Link>
        </div>
        <div className='row justify-content-center'>
          Forgot your password?{' .'}{' '}
          <Link to='/forgot-password'> Reset Password</Link>
        </div>
      </form>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  userRole: state.userRole,
});

export default connect(mapStateToProps, { login })(Login);
