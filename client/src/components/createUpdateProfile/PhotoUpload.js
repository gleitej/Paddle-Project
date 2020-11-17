import React, { useState, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
// import { singleFileUploadHandler } from '../../actions/profiles';
import PropTypes from 'prop-types';

const PhotoUpload = ({ profiles: { profileLoading, profile } }) => {
  const [selectedFile, setSelectedFile] = useState('');
  const singleFileChangedHandler = e => {
    setSelectedFile({ selectedFile: e.target.files[0] });
    // console.log(e.target.files);
  };

  const singleFileUploadHandler = async () => {
    const data = new FormData();
    // console.log(selectedFile);
    const config = {
      headers: {
        'Content-type': 'multipart/form-data'
      }
    };

    if (selectedFile) {
      data.append('photo', selectedFile);
      try {
        // const res = await axios({
        //   proxy: {
        //     port: 5000
        //     // host: 'localhost',
        //     // protocol: 'http'
        //   },
        //   method: 'post',
        //   url: '/api/profile/file-upload',
        //   baseURL: 'http://localhost:5000',
        //   data: data,
        //   headers: {
        //     ContentType: 'multipart/form-data'
        //   }
        // });

        const res = await axios.post('/api/profile/file-upload', data, config);
        if (res.status === 200) {
          if (res.data.error) {
            // If file size is larger than expected.
            if ('LIMIT_FILE_SIZE' === res.data.error.code) {
              console.log('max size exceeded');
              // reconfigure to setAlert and display correct max size defined in API route
            } else {
              console.log(res.data.error);
              // reconfigure to setAlert and display correct max size defined in API route
              // If not the given file type
              console.log(res.data.error);
            }
          } else {
            // Success
            let fileName = res.data;
            console.log('fileName', fileName);
            // reconfigure to setAlert and display correct max size defined in API route
          }
        }
      } catch (err) {
        // If another error
        console.log(err.message);
        // reconfigure to setAlert and display correct max size defined in API routes
      }
    } else {
      // if file not selected throw error
      console.log('Please upload file');
      // reconfigure to setAlert and display correct max size defined in API routes
    }
  };

  return (
    <Fragment>
      <div className='form-group'>
        <label>
          Chose a profile picture to upload
          <small>JPEG, JEG</small>
        </label>
        <input type='file' onChange={e => singleFileChangedHandler(e)} />
      </div>
      <button
        onClick={e => singleFileUploadHandler(selectedFile)}
        className='btn btn-submit btn-success'
      >
        Upload
      </button>
    </Fragment>
  );
};

PhotoUpload.protoTypes = {
  profiles: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profiles: state.profiles
});
export default connect(mapStateToProps, {})(PhotoUpload);
