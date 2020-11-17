import React, { Fragment } from 'react';
import { connect } from 'react-redux';

// components
import Spinner from '../layout/Spinner';

let hideEmail = function (email) {
  return email.replace(/(.{2})(.*)(?=@)/, function (gp1, gp2, gp3) {
    for (let i = 0; i < gp3.length; i++) {
      gp2 += '*';
    }
    return gp2;
  });
};

function ConfirmEmailMessage({ auth: { authLoading }, auth }) {
  return (
    <Fragment>
      {authLoading ? (
        <Spinner />
      ) : (
        <div className='mt-10 text-center'>
          <h2>We don't like robots</h2>
          <img
            alt='icon'
            src={require('../../assets/iconNav.svg')}
            height='80px'
            width='80px'
          />
          <img
            alt='icon'
            src={require('../../assets/robot-svg.svg')}
            height='100px'
            width='100px'
          />
          <h2>A conformation email has been sent to</h2>
          <h4 className='mt-5'>{hideEmail(auth.user.email)}</h4>
        </div>
      )}
    </Fragment>
  );
}

ConfirmEmailMessage.propTypes = {};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(ConfirmEmailMessage);
