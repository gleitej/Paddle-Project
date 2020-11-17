import React, { useEffect, useState, Fragment } from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import {
  getRiverById,
  addUpvote,
  removeUpvote,
  addDownvote,
  removeDownvote,
} from '../../actions/rivers';
import Spinner from '../layout/Spinner';
import Comment from './Comment';
import CommentForm from './CommentForm';
import GMap from './GMap';

function RiverItem({
  match,
  auth,
  getRiverById,
  addUpvote,
  removeUpvote,
  addDownvote,
  removeDownvote,
  riverLoading,
  singleRiver,
  userRole: { role, userRoleLoading },
  singleRiver: {
    photos,
    gMap,
    _id,
    river,
    info,
    classs,
    state,
    user,
    section,
    comments,
    upVote,
    downVote,
    date,
  },
}) {
  const [isUpVote, setIsUpVote] = useState(undefined);
  const [isDownVote, setIsDownVote] = useState(undefined);
  const [load, setLoad] = useState(true);
  const [loadriver, setLoadriver] = useState(true);

  useEffect(() => {
    loadriver && getRiverById(match.params.id);
    if (
      auth.user !== null &&
      singleRiver !== undefined &&
      singleRiver.downVote !== undefined &&
      singleRiver.upVote !== undefined &&
      userRoleLoading === false &&
      riverLoading === false &&
      load === false
    ) {
      setIsUpVote(upVote.find((upVote) => upVote.user === auth.user._id));
      setIsDownVote(
        downVote.find((downVote) => downVote.user === auth.user._id)
      );
    }
  }, [
    getRiverById,
    match.params.id,
    upVote,
    downVote,
    auth.user,
    load,
    loadriver,
    riverLoading,
    singleRiver,
    userRoleLoading,
  ]);

  return (
    <Fragment>
      {_id !== match.params.id ? (
        <Fragment>
          <Spinner />
        </Fragment>
      ) : (
        <Fragment>
          {load && setLoad(false)}
          {loadriver && setLoadriver(false)}
          <div className=' mt-5 mb-10 shadow-lg mb-5 bg-dark rounded'>
            {/* delete modal */}

            <div className=' clearfix bg-dark p-1 my-1'></div>

            <div
              style={{ marginLeft: '0', marginRight: '0', color: 'white' }}
              className=' row  bg-dark  p-1 my-1'
            >
              <div className='col-6 col-sm-2 text-center'>
                <strong>River: </strong>
                {river}
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

              <div className='col-6 col-sm-2 text-center'>
                <strong>Created by: </strong>
                {user !== undefined && user.name}
              </div>

              <div className='col-6 col-sm-2 text-center'>
                <strong>Updated: </strong>
                <Moment format='YYYY/MM/DD'>{date}</Moment>
              </div>

              <div className='pb-3 pt-3 col-12 text-center'>
                <strong className='pr-2'>Rate accuracy of information: </strong>

                {/* upvote */}
                {/* check if user is user || admin */}
                {role === 'user' || role === 'admin' ? (
                  // user is user || admin
                  // check if user upvoted
                  isUpVote !== undefined && isUpVote.user === auth.user._id ? (
                    // user has upVoted
                    <span>
                      <i
                        onClick={() => {
                          removeUpvote(_id);
                        }}
                        className='pr-6 fa fa-thumbs-up'
                        aria-hidden='true'
                      ></i>
                      <span className='pl-1 pr-5'>{upVote.length}</span>
                    </span>
                  ) : (
                    // user has not upVoted
                    <span>
                      <i
                        onClick={() => {
                          // check if user has already downVoted
                          isDownVote !== undefined &&
                          isDownVote.user === auth.user._id
                            ? removeDownvote(_id)
                            : addUpvote(_id);
                        }}
                        className='pr-6 fa fa-thumbs-up'
                        aria-hidden='true'
                        style={{ fontWeight: '10' }}
                      ></i>
                      <span className='pl-1 pr-5'>{upVote.length}</span>
                    </span>
                  )
                ) : (
                  // user is not user || admin
                  <span>
                    <i
                      className='fa fa-thumbs-up'
                      aria-hidden='true'
                      style={{ fontWeight: '10' }}
                    ></i>
                    <span className='pl-1 pr-5'>{upVote.length}</span>
                  </span>
                )}

                {/* downVote */}
                {/* check if user is user || admin */}
                {role === 'user' || role === 'admin' ? (
                  // user is user || admin
                  // check if user downVoted
                  isDownVote !== undefined &&
                  isDownVote.user === auth.user._id ? (
                    // user has downVoted
                    <span>
                      <i
                        onClick={() => {
                          removeDownvote(_id);
                        }}
                        className='pr-2 fa fa-thumbs-down'
                        aria-hidden='true'
                      ></i>
                      <span className='pl-1 pr-5'>{downVote.length}</span>
                    </span>
                  ) : (
                    // user has not downVoted
                    <span>
                      <i
                        onClick={() => {
                          isUpVote !== undefined &&
                          isUpVote.user === auth.user._id
                            ? removeUpvote(_id)
                            : addDownvote(_id);
                        }}
                        className='fa fa-thumbs-down'
                        aria-hidden='true'
                        style={{ fontWeight: '10' }}
                      ></i>
                      <span className='pl-1 pr-5'>{downVote.length}</span>
                    </span>
                  )
                ) : (
                  // user is not user || admin
                  <span>
                    <i
                      className='fa fa-thumbs-down'
                      aria-hidden='true'
                      style={{ fontWeight: '10' }}
                    ></i>
                    <span className='pl-1 pr-5'>{downVote.length}</span>
                  </span>
                )}
              </div>

              <div className='col-12 text-center'>
                <p className='my-1 text-center'>{info}</p>
              </div>
            </div>

            <div className='row no-gutters justify-content-center'>
              {photos && photos.length > 0 ? (
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
                    <GMap lines={gMap[0].lines} markers={gMap[0].markers} />
                  </div>
                </Fragment>
              ) : (
                <div
                  style={{
                    position: 'relative',
                    height: '85.4vh',
                  }}
                  className='col-12'
                >
                  {gMap && gMap.length > 0 && (
                    <GMap lines={gMap[0].lines} markers={gMap[0].markers} />
                  )}
                </div>
              )}
            </div>
          </div>
          <CommentForm auth={auth} _id={_id} />
          {comments &&
            comments.map((comment, i) => (
              <Comment comment={comment} river_id={_id} key={i} />
            ))}
        </Fragment>
      )}
    </Fragment>
  );
}

RiverItem.propTypes = {};

const mapStateToProps = (state) => ({
  singleRiver: state.rivers.singleRiver,
  riverLoading: state.rivers.riverLoading,
  userRole: state.userRole,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getRiverById,
  addUpvote,
  removeUpvote,
  addDownvote,
  removeDownvote,
})(RiverItem);
