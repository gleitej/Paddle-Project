import React, { Fragment, useEffect } from 'react';
import { getRivers } from '../../actions/rivers';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import RiverListItem from './RiverListItem';
import ClusterMap from './ClusterMap';
function Rivers({ getRivers, rivers: { rivers, riverloading } }) {
  useEffect(() => {
    getRivers();
  }, [getRivers]);

  const stateArr = [];
  rivers.forEach((river) => {
    const ex = stateArr.find((stateA) => {
      return stateA === river.state;
    });

    // if state is not in stateArr push to rivArr
    if (ex === undefined) {
      // let rivObj = { riverIndex: river.state };
      stateArr.push(river.state);
    }
  });
  stateArr.sort();

  return (
    <Fragment>
      {riverloading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className='container'>
            <div className='row mt-10 justify-content-center'>
              {stateArr.map((state, i) => (
                <div
                  key={i}
                  className=' shadow-lg m-3 p-3 bg-white rounded col-12 col-lg-5 '
                >
                  <h1 className=''>{state}</h1>
                  <div>
                    {rivers.map(
                      (river, i) =>
                        river.state === state && (
                          <RiverListItem key={i} river={river} />
                        )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <ClusterMap />
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

Rivers.propTypes = {
  rivers: PropTypes.object.isRequired,
  getRivers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  rivers: state.rivers,
});
export default connect(mapStateToProps, { getRivers })(Rivers);
