import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { updateAddPhotos, getRiverById } from '../../actions/rivers';
import { connect } from 'react-redux';
// import { getRiver } from '../../../actions/rivers';

import Message from './Message';
import Progress from './Progress';
import axios from 'axios';
import PropTypes from 'prop-types';

// Consider moving state connection to parent component
// Then pass down state to child(this component)
const FileUpload = ({
  match,
  updateAppPhotos,
  getRiverById,
  singleRiver: { _id },
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [files, setFiles] = useState([]);
  const [filename, setFilename] = useState('Choose Files');
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = (e) => {
    let filesArr = [];
    for (let i = 0; i < e.target.files.length; i++) {
      filesArr.push(e.target.files[i]);
    }
    setIsSelected(true);
    setFiles(filesArr);
    setFilename('Files Selected');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('photos', file);
    });

    try {
      await axios.put(`/api/river/update-photos/${_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        },
      });
      await updateAddPhotos(_id);
      await getRiverById(_id);
      setIsSelected(false);
      setFiles([]);
      setMessage('File Uploaded');
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('You must select files to upload');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form className='uploads-item uploads' onSubmit={onSubmit}>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            multiple={true}
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
          {isSelected && <Progress percentage={uploadPercentage} />}
        </div>

        <div className='upload-buttons row justify-content-center'>
          {isSelected ? (
            <input
              type='submit'
              value='Upload'
              className='btn btn-primary btn-lg'
            />
          ) : (
            <Link
              className='btn btn-info btn-lg '
              to={`/create-map/${match.params.id}`}
              style={{ marginTop: '0' }}
            >
              Next
            </Link>
          )}
        </div>
      </form>
      <div className='contianer mt-top mt-1px uploads-item uploads'>
        <div className='row justify-content-center mb-5'>
          {/* image preview */}
          {files &&
            [...files].map((file) => (
              <Fragment key={file.lastModified}>
                <div className='card' style={{}}>
                  <img
                    alt='icons'
                    height='100vw'
                    src={URL.createObjectURL(file)}
                  />
                </div>
              </Fragment>
            ))}
        </div>
      </div>
    </Fragment>
  );
};
FileUpload.prototTypes = {
  profile: PropTypes.object.isRequired,
  singleFileUpload: PropTypes.func.isRequired,
  getRiver: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profiles.profile,
  rivers: state.rivers,
  auth: state.auth,
});

export default connect(mapStateToProps, { updateAddPhotos, getRiverById })(
  withRouter(FileUpload)
);
