import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const MasteradminRoute = ({
  component: Component,
  userRole: { role },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      role === 'masterAdmin' ? (
        <Component {...props} />
      ) : role === 'pending' ? (
        <Redirect to='/confirm-email' />
      ) : (
        <Redirect to='/' />
      )
    }
  />
);

MasteradminRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  userRole: state.userRole,
});

export default connect(mapStateToProps)(MasteradminRoute);
