import React from 'react';
import { connect } from 'react-redux';
import {
  changeStatus,
  getPendingApplications,
  getApprovedApplications,
} from '../../actions/masterAdmin';

function Application({
  changeStatus,
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
            changeStatus('admin', user._id);
          }}
          className='btn btn-success '
        >
          Approve
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            changeStatus('user', user._id);
          }}
          className='btn btn-danger ml-2'
        >
          Deny
        </button>
      </div>
    </div>
  );
}

Application.propTypes = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  changeStatus,
  getPendingApplications,
  getApprovedApplications,
})(Application);
