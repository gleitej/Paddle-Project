import React, { useEffect, Fragment } from 'react';
import { getRiverById } from '../../actions/rivers';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import FileUpload from '../multiFileUpdate/FileUpload';
import { deleteSinglePhoto } from '../../actions/rivers';

function UpdatePhotos({
  deleteSinglePhoto,
  match,
  getRiverById,
  rivers: {
    riverLoading,
    singleRiver,
    singleRiver: { photos, _id },
  },
}) {
  useEffect(() => {
    getRiverById(match.params.id);
  }, [getRiverById, match.params.id]);
  return (
    <Fragment>
      {riverLoading && photos === undefined ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className='mt-5'>
            <h1 className='text-center'>Manage photos</h1>
            <div className='mt-10'>
              <div>
                <div>
                  <FileUpload singleRiver={singleRiver} />
                </div>
                <div className='button-center'></div>
              </div>
            </div>
          </div>
          {photos === undefined || photos.length === 0 ? (
            <h2 className='text-center'>Would you like to add some photos?</h2>
          ) : (
            <Fragment>
              <div className='container'>
                <div className='row d-flex justify-content-center'>
                  {photos.map((photo, index) => (
                    <div key={index} className='col-auto '>
                      <div
                        style={{
                          height: '200px',
                          width: '260px',
                          backgroundImage: `url(${photo})`,
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'cover',
                          margin: '10px',
                          borderRadius: '5px',
                        }}
                      >
                        <button
                          className='btn btn-danger col-auto'
                          onClick={() => {
                            deleteSinglePhoto(_id, index).then((res) =>
                              getRiverById(match.params.id)
                            );
                          }}
                        >
                          {' '}
                          <i className='fas fa-times'></i>
                        </button>{' '}
                      </div>
                      <div className='row justify-content-center'> </div>
                    </div>
                  ))}
                </div>
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}

UpdatePhotos.propTypes = {};

const mapStateToProps = (state) => ({
  rivers: state.rivers,
});
export default connect(mapStateToProps, { getRiverById, deleteSinglePhoto })(
  UpdatePhotos
);
