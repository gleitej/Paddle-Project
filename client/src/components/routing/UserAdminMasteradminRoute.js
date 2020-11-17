import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const UserAdminMasteradminRoute = ({
  component: Component,
  userRole: { role },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      role === 'user' || role === 'admin' || role === 'masterAdmin' ? (
        <Component {...props} />
      ) : role === 'pending' ? (
        <Redirect to='/confirm-email' />
      ) : (
        <Redirect to='/' />
      )
    }
  />
);

UserAdminMasteradminRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  userRole: state.userRole,
});

export default connect(mapStateToProps)(UserAdminMasteradminRoute);
