import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import { PropTypes } from 'prop-types';

function Navbar({ auth: { isAuthenticated, loading }, logout }) {
  const dashboard = (
    <li>
      <Link className='nav-link' to='/dashboard'>
        Dashboard
      </Link>
    </li>
  );

  const loginRegisterAuth = (
    <Fragment>
      <li className='nav-item'>
        <Link className='nav-link' to='/login'>
          Login
        </Link>
      </li>
      <li className='nav-item'>
        <Link className='nav-link' to='/register'>
          Register
        </Link>
      </li>
    </Fragment>
  );

  const logoutAuth = (
    <li className='nav-item'>
      <div className='nav-link' onClick={logout}>
        Logout
      </div>
    </li>
  );

  return (
    <nav className='navbar navbar-expand-lg sticky-top navbar-dark bg-dark opac'>
      <Link className='navbar-brand' to='/rivers'>
        <img
          alt='icon'
          src={require('../../assets/iconNav.svg')}
          height='40px'
          width='40px'
        />
      </Link>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarText'
        aria-controls='navbarText'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'></span>
      </button>
      <div className='collapse navbar-collapse' id='navbarText'>
        <ul className='navbar-nav ml-auto'>
          <li className='nav-item'>
            <Link className='nav-link' to='/posts'>
              Form
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/rivers'>
              Rivers
            </Link>
          </li>

          <li className='nav-item'>
            <Link className='nav-link' to='/about'>
              About
            </Link>
          </li>
          {!loading && (
            <Fragment>{isAuthenticated ? dashboard : null} </Fragment>
          )}
        </ul>

        {/* auth */}
        <ul className='navbar-nav ml-auto'>
          {!loading && (
            <Fragment>
              {isAuthenticated ? logoutAuth : loginRegisterAuth}
            </Fragment>
          )}
        </ul>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
