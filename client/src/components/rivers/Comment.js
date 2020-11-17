import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { deleteCommentRiver, addLike, removeLike } from '../../actions/rivers';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';

function Comment({
  deleteCommentRiver,
  addLike,
  removeLike,
  auth,
  river_id,
  comment: {
    date,
    text,
    likes,
    _id,
    user,
    user: { name, photo },
  },
}) {
  const [isLiked, setIsLiked] = useState(undefined);
  useEffect(() => {
    if (auth.isAuthenticated) {
      setIsLiked(likes.find((like) => like.user === auth.user._id));
    } else {
      setIsLiked(undefined);
    }
  }, [isLiked, auth.isAuthenticated, likes]);

  return (
    <Fragment>
      {auth.authLoading ? (
        <Spinner />
      ) : (
        <div className=' mb-10 shadow-lg p-3 mb-5 bg-white rounded'>
          <div className=' row post bg-white p-1 my-1'>
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

              {auth.isAuthenticated && !auth.loading ? (
                isLiked === undefined ? (
                  <button
                    onClick={() => addLike(_id)}
                    type='button'
                    className='my-1 btn btn-white'
                  >
                    <i className='far fa-heart'></i>{' '}
                    <span>
                      {likes.length > 0 && <span>{likes.length}</span>}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => removeLike(_id)}
                    type='button'
                    className='my-1 btn btn-white'
                  >
                    <i className='fas fa-heart'></i>{' '}
                    <span>
                      {likes.length > 0 && <span>{likes.length}</span>}
                    </span>
                  </button>
                )
              ) : (
                <button type='button' className='my-1 btn btn-white'>
                  <i className='far fa-heart'></i>{' '}
                  <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
                </button>
              )}

              {auth.isAuthenticated &&
                !auth.loading &&
                //   !riverLoading &&
                auth.user._id === user._id && (
                  <button
                    onClick={() => deleteCommentRiver(river_id, _id)}
                    type='button'
                    className='btn btn-danger'
                  >
                    <i className='fas fa-times'></i>
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

Comment.propTypes = {
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  deleteCommentRiver: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  deleteCommentRiver,
  addLike,
  removeLike,
})(Comment);
