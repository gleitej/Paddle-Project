import React, { useState, useEffect, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profiles';
import { getRiver } from '../../actions/rivers';
import { getApplicationStatus } from '../../actions/userRole';
import CurrentProfile from './CurrentProfile';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import RiverItem from './RiverItem';

const Dashboard = ({
  getCurrentProfile,
  getRiver,
  getApplicationStatus,
  rivers: { userRivers },
  auth,
  auth: { isAuthenticated, authLoading, user },
  profiles: { profile, profileLoading },
  userRole: { role, applicationStatus },
}) => {
  useEffect(() => {
    getCurrentProfile();
    getRiver(user);
    getApplicationStatus(user);
  }, [getCurrentProfile, getApplicationStatus, getRiver, user]);

  const [showRivers, setShowRivers] = useState(false);

  if (!isAuthenticated && !profileLoading) {
    return <Redirect to='/' />;
  }

  if (isAuthenticated && role === 'masterAdmin') {
    return <Redirect to='/master-admin/dashboard' />;
  }

  return (
    <Fragment>
      {profileLoading &&
      auth === undefined &&
      !authLoading &&
      profileLoading === true ? (
        <Spinner />
      ) : (
        <div className='container mt-10 mb-10'>
          <div className='row justify-content-center'>
            <div className='col-12 text-center'>
              <h1>Dashboard</h1>
              <h2 className='mt-5'>
                Welcome {user && user.name.split(' ')[0]}
              </h2>
            </div>
          </div>
          <div className='row justify-content-center'>
            <div className='ml-10'>
              {!profileLoading ? (
                profile ? (
                  <Fragment>
                    <Link
                      type='button'
                      to='/update-profile'
                      className='btn btn-info my-1'
                    >
                      Edit Profile
                    </Link>
                    {user && user.isAdmin && (
                      <Link
                        type='button'
                        to='add-river-section'
                        className='btn btn-info my-1'
                      >
                        Add a river section
                      </Link>
                    )}
                  </Fragment>
                ) : (
                  <div className='text-center'>
                    <h4>Get started</h4>
                    <Link
                      type='button'
                      to='/create-profile'
                      className='btn btn-info my-1'
                    >
                      Create Profile
                    </Link>
                  </div>
                )
              ) : (
                <Spinner />
              )}
            </div>
          </div>

          <div className='row justify-content-center'>
            <div className='col-12 mt-5'>
              {profile && (
                <Fragment>
                  <h1 className='text-center'>Your Profile</h1>
                  <hr className='hr' />

                  {profile && <CurrentProfile profile={profile} />}
                </Fragment>
              )}
            </div>
            {user && role === 'admin' && (
              <Fragment>
                {profile && (
                  <Fragment>
                    <button
                      onClick={(e) => {
                        showRivers ? setShowRivers(false) : setShowRivers(true);
                      }}
                      className='btn btn-lg btn-success'
                    >
                      {showRivers
                        ? 'Hide your contribtutions'
                        : 'Show your contribtutions'}
                    </button>
                    {showRivers && (
                      <Fragment>
                        <div className='col-12 mt-5'>
                          <h1 className='text-center'>Your Contributions</h1>
                          <hr className='hr' />
                        </div>

                        {role === 'admin' && userRivers.length > 0 && (
                          <Link
                            type='button'
                            to='add-river-section'
                            className='col-12 btn btn-info my-1'
                          >
                            Add a river section
                          </Link>
                        )}
                        {userRivers.length > 0 ? (
                          userRivers.map((river, i) => (
                            <RiverItem key={i} river={river} />
                          ))
                        ) : (
                          <div className='row text-center'>
                            <h3 className='col-12'>
                              You have do not any contributions
                            </h3>
                            <div className='col-12'>
                              <h5>Get started now</h5>
                              <Link
                                type='button'
                                to='add-river-section'
                                className='btn btn-info my-1'
                              >
                                Add a river section
                              </Link>
                            </div>
                          </div>
                        )}
                      </Fragment>
                    )}
                  </Fragment>
                )}
              </Fragment>
            )}
            {profile &&
              role === 'user' &&
              applicationStatus === 'applicationNoSubmit' && (
                <div className='row justify-content'>
                  <div className='col-12'>
                    <hr className='hr' />
                    <h3 className='text-center mt-10'>
                      Would <span className='text-info'> you </span> like to
                      contribute to{' '}
                      <span className='text-info'>
                        <br />
                        Paddle Project's
                      </span>{' '}
                      database of<span className='text-info'> rivers</span> ?
                      <br /> Apply to become an{' '}
                      <span className='text-info'> Admin</span>
                    </h3>
                  </div>
                  <div className='col text-center'>
                    <Link
                      to='/admin/application'
                      className='btn bt-large btn-primary'
                    >
                      Apply
                    </Link>
                  </div>
                </div>
              )}

            {profile &&
              role === 'user' &&
              applicationStatus === 'applicationPending' && (
                <h3 className='text-center'>
                  Your application has been submitted <br /> and is in the
                  processe of being reviewed. <br /> Thank you.
                </h3>
              )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profiles: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profiles: state.profiles,
  userRole: state.userRole,
  rivers: state.rivers,
  auth: state.auth,
});
export default connect(mapStateToProps, {
  getCurrentProfile,
  getRiver,
  getApplicationStatus,
})(Dashboard);
