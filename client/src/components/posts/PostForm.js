import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createPost } from '../../actions/posts';

const PostForm = ({ createPost, userRole: { role } }) => {
  const [text, setText] = useState('');
  return role === null ? (
    <Spinner />
  ) : role === 'user' || role === 'admin' ? (
    <form
      className='mlr-20 mb-5 mt-10'
      action=''
      onSubmit={(e) => {
        e.preventDefault();
        createPost({ text });
        setText('');
      }}
    >
      <div className='form-group'>
        <h2>Create a post</h2>
        <textarea
          onChange={(e) => setText(e.target.value)}
          className='form-control'
          id='exampleFormControlTextarea1'
          rows='3'
        />
        <input type='submit' className='mt-2 btn btn-success' value='Submit' />
      </div>
    </form>
  ) : role === 'pending' ? (
    <p className='text-center mt-5'>
      <h2>
        Want to create a Post?
        <br /> Please <Link to='/confirm-email'>Confirm your email</Link>{' '}
      </h2>
    </p>
  ) : (
    <p className='text-center mt-5'>
      <h2>
        Want to create a Post?
        <br /> Please <Link to='/login'>login</Link> or{' '}
        <Link to='/register'>register</Link>{' '}
      </h2>
    </p>
  );
};

PostForm.propTypes = {
  createPost: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  userRole: state.userRole,
});

export default connect(mapStateToProps, {
  createPost,
})(PostForm);
