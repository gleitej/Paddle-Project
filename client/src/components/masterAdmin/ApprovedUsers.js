import React from 'react';
import { connect } from 'react-redux';
import {
  changeStatus,
  getPendingApplications,
  getApprovedApplications,
} from '../../actions/masterAdmin';

function ApprovedUsers({
  changeStatus,
  getPendingApplications,
  getApprovedApplications,
  application,
  adminRole,
  userRole,
  application: {
    status,
    why,
    about,
    experience,
    favoriteRiver,
    user,
    user: { role, name },
  },
}) {
  return (
    <div class='card w-75 shadow-lg p-3 mb-5 bg-white rounded'>
      <div class='card-body'>
        <h5 class='card-title'>
          <strong>Name: </strong> <br />
          {name}
        </h5>
        <h5 class='card-title'>
          <strong>Application Status </strong>
          <br /> {status}
        </h5>
        <p class='card-text'>
          <strong>Why </strong>
          {why}
        </p>
        <p class='card-text'>
          <strong>About </strong>
          {about}
        </p>
        <p class='card-text'>
          <strong>Experience </strong>
          {experience}
        </p>
        <p class='card-text'>
          <strong>Favorite River </strong>
          {favoriteRiver}
        </p>
        <p class='card-text'>
          <strong>Current User Role </strong>
          {role}
        </p>

        <button
          onClick={(e) => {
            e.preventDefault();
            changeStatus('user', user._id);
          }}
          href='#'
          className='btn btn-danger'
        >
          Revert to pending
        </button>
      </div>
    </div>
  );
}

ApprovedUsers.propTypes = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  changeStatus,
  getPendingApplications,
  getApprovedApplications,
})(ApprovedUsers);
