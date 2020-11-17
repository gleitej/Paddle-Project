import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  getPendingApplications,
  getApprovedApplications,
} from '../../actions/masterAdmin';
import Application from './Application';
import ApprovedUsers from './ApprovedUsers';
import Spinner from '../layout/Spinner';

function MasterAdmin({
  getPendingApplications,
  getApprovedApplications,
  isAuthenticated,
  masterAdmin: {
    pendingApplications,
    approvedApplications,
    masterAdminLoading,
  },
  userRole: { role },
}) {
  useEffect(() => {
    getPendingApplications();
    getApprovedApplications();
  }, [getPendingApplications, getApprovedApplications]);
  if (!isAuthenticated && role !== 'masterAdmin') {
    return <Redirect to='/' />;
  }
  return (
    <Fragment>
      {masterAdminLoading ? (
        <Spinner />
      ) : (
        <Fragment>
          {' '}
          <h1 style={{ margin: '30px' }} className='text-center'>
            Master Admin Dashboard
          </h1>
          <div className='container'>
            <div className='row justify-content-center'>
              <div className='col-md-6 col-12'>
                <h3 style={{ margin: '20px' }}>Pending Applications</h3>
                {pendingApplications.map((application, i) => (
                  <Application key={i} application={application} />
                ))}
              </div>
              <div className='col-md-6 col-12'>
                <h3 style={{ margin: '20px' }}>Approved Applications</h3>
                {approvedApplications.map((application, i) => (
                  <ApprovedUsers key={i} application={application} />
                ))}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

MasterAdmin.propTypes = {};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  userRole: state.userRole,
  masterAdmin: state.masterAdmin,
});

export default connect(mapStateToProps, {
  getPendingApplications,
  getApprovedApplications,
})(MasterAdmin);
