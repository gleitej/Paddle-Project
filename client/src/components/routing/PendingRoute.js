import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PendingRoute = ({
  component: Component,
  userRole: { role },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      role === 'pending' ? (
        <Component {...props} />
      ) : (
        <Redirect to='/dashboard' />
      )
    }
  />
);

PendingRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  userRole: state.userRole,
});

export default connect(mapStateToProps)(PendingRoute);
