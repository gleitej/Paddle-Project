import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import Moment from 'react-moment';
import CommentForm from './CommentForm';
import Comment from './Comment';
import { getPost, addLike, removeLike } from '../../actions/posts';

function Post({
  getPost,
  addLike,
  removeLike,
  auth,
  userRole: { role },
  posts: {
    post,
    postLoading,
    post: { _id, likes, text, date, comments, user },
  },

  match,
}) {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost, match.params.id]);
  return user === undefined || postLoading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <div className='mt-10 mb-10'>
        <div className=' row post bg-white p-1 my-1'>
          <div className='col-12 col-md-2'>
            {/* in future add link to profile page */}
            {/* <a href='profile.html'> */}
            <img
              className='round-img'
              width='100px'
              height='100px'
              src={
                user === null
                  ? 'https://paddle-project.s3.us-east-2.amazonaws.com/male-profile-image-placeholder.png'
                  : user.photo
              }
              alt=''
            />
            <h4>{user === null ? 'Deleted User' : user.name}</h4>
            {/* </a> */}
          </div>
          <div className='col-12 col-md-10'>
            <p className='my-1'>{text}</p>
            <p className='post-date'>
              Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
            </p>

            <Link to='/posts' className='my-1 btn btn-primary'>
              Back To Posts
            </Link>
          </div>
        </div>
      </div>
      {role === 'user' || role === 'admin' ? (
        <CommentForm postId={_id} />
      ) : role === 'pending' ? (
        <div className='text-center mb-5'>
          <h2>
            Want to leave a comment?
            <br /> Please <Link to='/confirm-email'>
              confirm your email
            </Link>{' '}
          </h2>
        </div>
      ) : (
        <div className='text-center mb-5'>
          <h2>
            Want to leave a comment?
            <br /> Please <Link to='/login'>login</Link> or{' '}
            <Link to='/register'>register</Link>{' '}
          </h2>
        </div>
      )}
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} postId={post._id} />
      ))}
    </Fragment>
  );
}

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  posts: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  auth: state.auth,
  userRole: state.userRole,
});

export default connect(mapStateToProps, { getPost, addLike, removeLike })(Post);
