import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { deleteRiver, changePublishStatus } from '../../actions/rivers';
import { connect } from 'react-redux';
import GMap from './GMap';

// react boostrap needed for modal
import Button from 'react-bootstrap/Button';

// modal component
import RiverModal from './RiverModal';

// note delete not working
function RiverItem({
  deleteRiver,
  changePublishStatus,
  river,
  river: { published, section, photos, gMap, _id, info, classs, state, user },
}) {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div className=' mt-5 mb-10 shadow-lg mb-5 bg-dark rounded'>
      {/* unpublish */}
      <div
        className='modal fade '
        id={`u${_id}`}
        tabIndex='-1'
        role='dialog'
        aria-labelledby='mySmallModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-sm'>
          <div className='modal-content'>
            <div className='modal-body'>
              <h3 className='text-center'>
                Would you like to unpublish this river?
              </h3>
            </div>
            <div className='modal-footer river-delete'>
              <div className='river-delete-item'>
                <button
                  type='button'
                  className='btn btn-default'
                  data-dismiss='modal'
                >
                  Close
                </button>
                <button
                  type='button'
                  className='btn btn-warning'
                  onClick={() => changePublishStatus(_id, user)}
                  data-dismiss='modal'
                >
                  Unpublish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* publish modal */}
      <div
        className='modal fade '
        id={`p${_id}`}
        tabIndex='-1'
        role='dialog'
        aria-labelledby='mySmallModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-sm'>
          <div className='modal-content'>
            <div className='modal-body'>
              <h3 className='text-center'>
                Is this river ready to be published?
              </h3>
            </div>
            <div className='modal-footer river-delete'>
              <div className='river-delete-item'>
                <button
                  type='button'
                  className='btn btn-default'
                  data-dismiss='modal'
                >
                  Close
                </button>
                <button
                  type='button'
                  className='btn btn-success'
                  onClick={() => changePublishStatus(_id, user)}
                  data-dismiss='modal'
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* delete modal */}
      <div
        className='modal fade '
        id={`a${_id}`}
        tabIndex='-1'
        role='dialog'
        aria-labelledby='mySmallModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-sm'>
          <div className='modal-content'>
            <div className='modal-body'>
              <h3 className='text-center'>Are your Sure?</h3>
            </div>
            <div className='modal-footer river-delete'>
              <div className='river-delete-item'>
                <button
                  type='button'
                  className='btn btn-default'
                  data-dismiss='modal'
                >
                  Close
                </button>
                <button
                  type='button'
                  className='btn btn-danger'
                  onClick={() => deleteRiver(_id)}
                  data-dismiss='modal'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=' clearfix bg-dark p-1 my-1'></div>

      <div
        style={{ marginLeft: '0', marginRight: '0', color: 'white' }}
        className=' row  bg-dark  p-1 my-1'
      >
        <div className='col-3 col-sm-3'>
          {gMap.length > 0 &&
            (published ? (
              <button
                type='button'
                className='btn btn-warning my-1'
                data-toggle='modal'
                data-target={`#u${_id}`}
              >
                Unpublish{' '}
              </button>
            ) : (
              <button
                type='button'
                className='btn btn-success my-1'
                data-toggle='modal'
                data-target={`#p${_id}`}
              >
                Publish{' '}
              </button>
            ))}
          <Button
            className='my-1'
            style={{ paddingLeft: '21px', paddingRight: '21px' }}
            variant='primary'
            onClick={() => setModalShow(true)}
          >
            Edit{' '}
          </Button>

          <button
            type='button'
            className='btn btn-danger my-1'
            data-toggle='modal'
            data-target={`#a${_id}`}
          >
            Delete{' '}
          </button>
        </div>

        {/* river modal */}
        <RiverModal
          river={river}
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
        <div className='col-6 col-sm-2 text-center'>
          <strong>River: </strong>
          {river.river}
        </div>
        <div className='col-6 col-sm-2 text-center'>
          <strong>Section: </strong>
          {section}
        </div>
        <div className='col-6 col-sm-2 text-center'>
          <strong>Location: </strong>
          {state}
        </div>

        <div className='col-6 col-sm-2 text-center'>
          <strong>Class: </strong>
          {classs}
        </div>

        <div className='col-12'>
          <p className='my-1 text-center'>{info}</p>
          {/* <p className='post-date'>Posted on 04/16/2019</p> */}
        </div>
      </div>

      <div className='row no-gutters justify-content-center'>
        {photos.length > 0 ? (
          <Fragment>
            <div className='col-12 col-md-6'>
              <div
                id={`carouselExampleControlsa${state}`}
                className='carousel slide'
                data-ride='carousel'
              >
                <div className='carousel-inner'>
                  {photos.map((photo, i) =>
                    i === 0 ? (
                      <div key={i} className='carousel-item active'>
                        <img
                          alt='icon'
                          style={{ height: '60vh' }}
                          className='d-block w-100'
                          src={photos[i]}
                        />
                      </div>
                    ) : (
                      <div key={i} className='carousel-item '>
                        <img
                          alt='icon'
                          style={{ height: '60vh' }}
                          className='d-block w-100'
                          src={photo}
                        />
                      </div>
                    )
                  )}
                </div>

                <a
                  className='carousel-control-prev'
                  href={`#carouselExampleControlsa${state}`}
                  role='button'
                  data-slide='prev'
                >
                  <span
                    className='carousel-control-prev-icon'
                    aria-hidden='true'
                  ></span>
                  <span className='sr-only'>Previous</span>
                </a>
                <a
                  className='carousel-control-next'
                  href={`#carouselExampleControlsa${state}`}
                  role='button'
                  data-slide='next'
                >
                  <span
                    className='carousel-control-next-icon'
                    aria-hidden='true'
                  ></span>
                  <span className='sr-only'>Next</span>
                </a>
              </div>
            </div>
            <div
              style={{
                position: 'relative',
                height: '60vh',
              }}
              className='col-12 col-md-6'
            >
              {gMap.length === 0 ? (
                <div>
                  <h2 className='text-white'>
                    Your map is not complete. You must add maps
                  </h2>{' '}
                  <Link
                    className='my-1 btn btn-block btn-success btn-lg'
                    to={`/create-map/${_id}`}
                  >
                    Maps
                  </Link>
                </div>
              ) : (
                <GMap lines={gMap[0].lines} markers={gMap[0].markers} />
              )}
            </div>
          </Fragment>
        ) : (
          <Fragment>
            {gMap.length === 0 ? (
              <div>
                <h2 className='text-white text-center'>
                  Your river is not complete. <br /> You must add
                  <Link
                    className='my-1 btn btn-success btn-lg'
                    to={`/create-map/${_id}`}
                  >
                    Maps
                  </Link>
                </h2>
              </div>
            ) : (
              <div
                style={{
                  position: 'relative',
                  height: '85.4vh',
                }}
                className='col-12'
              >
                <GMap lines={gMap[0].lines} markers={gMap[0].markers} />
              </div>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
}

RiverItem.propTypes = {};

export default connect(null, { deleteRiver, changePublishStatus })(RiverItem);
