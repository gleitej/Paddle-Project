import React, { useState } from 'react';
import { addComment } from '../../actions/posts';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

function CommentForm({ addComment, postId }) {
  const [text, setText] = useState('');

  return (
    <form
      className='mlr-20 mb-5 mt-10'
      onSubmit={e => {
        e.preventDefault();
        addComment(postId, { text });
        setText('');
      }}
    >
      <div className='form-group'>
        <h2>Leave a comment</h2>
        <textarea
          name='text'
          className='form-control'
          placeholder='Comment the post'
          value={text}
          onChange={e => setText(e.target.value)}
          required
        ></textarea>
      </div>
      <input type='submit' className='btn btn-success' value='Submit' />
    </form>
  );
}

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired
};

export default connect(null, { addComment })(CommentForm);
