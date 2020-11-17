import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { deletePost, addLike, removeLike } from '../../actions/posts';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';

function PostItem({
  deletePost,
  addLike,
  removeLike,
  auth,
  post,
  userRole: { role },
  post: { postLoading, date, text, likes, comments, user },
}) {
  const [isLiked, setIsLiked] = useState(undefined);
  useEffect(() => {
    if (auth.isAuthenticated && auth.user !== null) {
      setIsLiked(likes.find((like) => like.user === auth.user._id));
    } else {
      setIsLiked(undefined);
    }
  }, [setIsLiked, auth.isAuthenticated, auth.user, likes]);

  return (
    <Fragment>
      {auth.authLoading && likes && post === null ? (
        <Spinner />
      ) : (
        <div className=' shadow-lg m-3 p-3 bg-white rounded col-12'>
          <div className=' row bg-white p-1 my-1'>
            <div className='col-12 col-md-2'>
              {/* in future add link to profile page */}
              {/* <a href='profile.html'> */}
              <img
                className='round-img mx-auto d-block'
                width='100px'
                height='100px'
                src={
                  user === null || user.photo === null
                    ? 'https://paddle-project.s3.us-east-2.amazonaws.com/male-profile-image-placeholder.png'
                    : user.photo
                }
                alt=''
              />
              <h4 className='text-center'>
                {user === null ? 'Deleted User' : user.name}
              </h4>
              {/* </a> */}
            </div>
            <div className='col-12 col-md-10'>
              <p className='my-1'>{text}</p>
              <p className='post-date'>
                Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
              </p>
              {role === 'user' || role === 'admin' ? (
                isLiked === undefined ? (
                  <button
                    onClick={() => addLike(post._id)}
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
                    onClick={() => removeLike(post._id)}
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

              <Link to={`/posts/${post._id}`} className='my-1 btn btn-primary'>
                Discussion{' '}
                <span className='comment-count'>
                  {comments.length > 0 ? comments.length : ''}
                </span>
              </Link>
              {auth.isAuthenticated &&
                !auth.loading &&
                !postLoading &&
                user !== null &&
                auth.user._id === user._id && (
                  <button
                    onClick={() => deletePost(post._id)}
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

PostItem.propTypes = {
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  userRole: state.userRole,
});

export default connect(mapStateToProps, { deletePost, addLike, removeLike })(
  PostItem
);
