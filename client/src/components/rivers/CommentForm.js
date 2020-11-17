import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { addCommentRiver } from '../../actions/rivers';

const CommentFrom = ({ _id, addCommentRiver, userRole: { role } }) => {
  const [text, setText] = useState('');
  return role === null ? (
    <Spinner />
  ) : (
    <Fragment>
      {role === 'user' || role === 'admin' ? (
        <form
          className='mlr-20 mb-5 mt-10'
          action=''
          onSubmit={(e) => {
            e.preventDefault();
            addCommentRiver(_id, { text });
            setText('');
          }}
        >
          <div className='form-group'>
            <h2>Leave a comment</h2>

            <textarea
              onChange={(e) => setText(e.target.value)}
              className='form-control'
              id='exampleFormControlTextarea1'
              rows='3'
            ></textarea>
          </div>
          <input type='submit' className='btn btn-success' value='Submit' />
        </form>
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
    </Fragment>
  );
};

CommentFrom.propTypes = {
  addCommentRiver: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  userRole: state.userRole,
});

export default connect(mapStateToProps, {
  addCommentRiver,
})(CommentFrom);
