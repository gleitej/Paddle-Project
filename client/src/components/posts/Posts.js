import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { getPosts } from '../../actions/posts';
import PostItem from './PostItem';
import Spinner from '../layout/Spinner';
import PostForm from './PostForm';
import PropTypes from 'prop-types';

function Posts({ getPosts, auth, posts: { posts, postLoading } }) {
  useEffect(() => {
    getPosts();
  }, [getPosts]);
  return (
    <Fragment>
      {postLoading && auth.authLoading ? (
        <Spinner />
      ) : (
        <Fragment>
          <PostForm auth={auth} />
          <div className='container'>
            <div className='row mt-10 justify-content-center'>
              {posts.length > 0 ? (
                posts.map((post, i) => <PostItem key={i} post={post} />)
              ) : (
                <h4>No posts found...</h4>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

Posts.propTypes = {
  posts: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  auth: state.auth,
});

export default connect(mapStateToProps, { getPosts })(Posts);
