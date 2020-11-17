import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AdminRoute = ({ component: Component, userRole: { role }, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      role === 'admin' ? <Component {...props} /> : <Redirect to='/' />
    }
  />
);

AdminRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  userRole: state.userRole,
});

export default connect(mapStateToProps)(AdminRoute);
