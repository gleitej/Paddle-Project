import React, { Fragment, useEffect } from 'react';
import { getProfiles } from '../../actions/profiles';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PaddlerItem from './PaddlerItem';
import PropTypes from 'prop-types';

const Paddlers = ({ getProfiles, profiles: { profileLoading, profiles } }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  return (
    <Fragment>
      {profileLoading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='text-center mt-5'>Paddlers</h1>
          <hr className='hr' />

          <div className=' mt-5'>
            {profiles.length > 0 ? (
              profiles.map(profile => (
                <PaddlerItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};
Paddlers.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profiles: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profiles: state.profiles
});

export default connect(mapStateToProps, { getProfiles })(Paddlers);
