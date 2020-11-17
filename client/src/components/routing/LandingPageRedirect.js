import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const LandingPageRedirect = ({
  component: Component,
  userRole: { role },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      role === 'user' || role === 'admin' || role === 'masterAdmin' ? (
        <Redirect to='/dashboard' />
      ) : role === 'pending' ? (
        <Redirect to='/confirm-email' />
      ) : (
        <Component {...props} />
      )
    }
  />
);

LandingPageRedirect.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  userRole: state.userRole,
});

export default connect(mapStateToProps)(LandingPageRedirect);
