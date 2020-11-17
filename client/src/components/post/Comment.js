import React, { Fragment } from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { deleteComment } from '../../actions/posts';
import PropTypes from 'prop-types';

function Comment({
  auth,
  postId,
  deleteComment,
  comment: { _id, text, name, photo, date, user },
}) {
  return (
    <Fragment>
      <div className=' mb-10 '>
        <div className=' row post bg-white p-1 my-1 shadow-lg p-3 mb-5 bg-white rounded'>
          <div className='col-12 col-md-2'>
            {/* in future add link to profile page */}
            {/* <a href='profile.html'> */}
            <img
              className='round-img'
              width='100px'
              height='100px'
              src={
                photo
                  ? photo
                  : 'https://paddle-project.s3.us-east-2.amazonaws.com/male-profile-image-placeholder.png'
              }
              alt=''
            />
            <h4>{name}</h4>
            {/* </a> */}
          </div>
          <div className='col-12 col-md-10'>
            <p className='my-1'>{text}</p>
            <p className='post-date'>
              Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
            </p>

            {auth.isAuthenticated && !auth.loading && auth.user._id === user ? (
              <button
                onClick={() => deleteComment(postId, _id)}
                type='button'
                className='btn btn-danger'
              >
                <i className='fas fa-times'></i>
              </button>
            ) : (
              <Fragment></Fragment>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

Comment.propTypes = {
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteComment })(Comment);
