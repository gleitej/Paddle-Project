import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getRiverById, newRiver } from '../../actions/rivers';
import Spinner from '../layout/Spinner';
import { Redirect } from 'react-router-dom';

function UpdateInfo({
  match,
  history,
  getRiverById,
  newRiver,
  auth: { isAuthenticated },
  rivers: { singleRiver, riverLoading },
}) {
  const [formData, setFormData] = useState({
    section: '',
    river: '',
    info: '',
    classs: '',
    state: '',
    _id: singleRiver._id,
  });
  useEffect(() => {
    getRiverById(match.params.id);
    setFormData({
      section: riverLoading || !singleRiver.section ? '' : singleRiver.section,
      river: riverLoading || !singleRiver.river ? '' : singleRiver.river,
      info: riverLoading || !singleRiver.info ? '' : singleRiver.info,
      classs: riverLoading || !singleRiver.classs ? '' : singleRiver.classs,
      state: riverLoading || !singleRiver.state ? '' : singleRiver.state,
      _id: singleRiver._id,
    });
  }, [
    singleRiver._id,
    getRiverById,
    match.params.id,
    riverLoading,
    singleRiver.section,
    singleRiver.river,
    singleRiver.info,
    singleRiver.classs,
    singleRiver.state,
  ]);

  const [disableButton, setDisabledButton] = useState(true);

  const disable = (e) => {
    setDisabledButton(false);
    setTimeout(() => {
      setDisabledButton(true);
    }, 3000);
  };

  const { section, river, info, classs, state } = formData;
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    newRiver(formData, history, true);
  };

  if (!isAuthenticated) {
    return <Redirect to='/' />;
  }

  return (
    <Fragment>
      {riverLoading ? (
        <Spinner />
      ) : (
        <div className='mlr-20 mt-5 mb-10'>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className='form-group'>
              <label>River's name</label>
              <input
                onChange={(e) => onChange(e)}
                type='text'
                name='river'
                value={river}
                required
                className='form-control'
              />
            </div>
            <div className='form-group'>
              <label>River Section</label>
              <input
                onChange={(e) => onChange(e)}
                type='text'
                name='section'
                placeholder='River section'
                value={section}
                required
                className='form-control'
              />
            </div>
            <div className='form-group'>
              <label>Information</label>
              <textarea
                onChange={(e) => onChange(e)}
                className='form-control'
                name='info'
                value={info}
                rows='3'
                required
              ></textarea>
            </div>
            <div className='form-group'>
              <label>What class is this river</label>
              <select
                onChange={(e) => onChange(e)}
                className='form-control'
                required
                name='classs'
                value={classs}
                id='exampleFormControlSelect1'
              >
                <option>Choose one</option>

                <option>1</option>
                <option>2 +</option>
                <option>2</option>
                <option>3</option>
                <option>3 +</option>
                <option>4</option>
                <option>4 +</option>
                <option>5</option>
                <option>5 +</option>
              </select>
            </div>
            <div className='form-group'>
              <label>What state is this river in?</label>
              <select
                onChange={(e) => onChange(e)}
                className='form-control'
                required
                name='state'
                value={state}
              >
                <option>Choose one</option>
                <option value='Alabama'>Alabama</option>
                <option value='Alaska'>Alaska</option>
                <option value='Arizona'>Arizona</option>
                <option value='Arkansas'>Arkansas</option>
                <option value='California'>California</option>
                <option value='Colorado'>Colorado</option>
                <option value='Connecticut'>Connecticut</option>
                <option value='Delaware'>Delaware</option>
                <option value='Distric Of Columbia'>
                  District Of Columbia
                </option>
                <option value='Florida'>Florida</option>
                <option value='Georgia'>Georgia</option>
                <option value='Hawaii'>Hawaii</option>
                <option value='Idaho'>Idaho</option>
                <option value='Illinois'>Illinois</option>
                <option value='Indiana'>Indiana</option>
                <option value='Iowa'>Iowa</option>
                <option value='Kanas'>Kansas</option>
                <option value='Kentucky'>Kentucky</option>
                <option value='Louisiana'>Louisiana</option>
                <option value='Maine'>Maine</option>
                <option value='Maryland'>Maryland</option>
                <option value='Massachusetts'>Massachusetts</option>
                <option value='Micigan'>Michigan</option>
                <option value='Minnesota'>Minnesota</option>
                <option value='Mississippi'>Mississippi</option>
                <option value='Missouri'>Missouri</option>
                <option value='Montana'>Montana</option>
                <option value='Nebraska'>Nebraska</option>
                <option value='Nevada'>Nevada</option>
                <option value='New Hampshire'>New Hampshire</option>
                <option value='New Jersey'>New Jersey</option>
                <option value='New Mexico'>New Mexico</option>
                <option value='New York'>New York</option>
                <option value='North Carolina'>North Carolina</option>
                <option value='North Dakota'>North Dakota</option>
                <option value='Ohio'>Ohio</option>
                <option value='Oklahoma'>Oklahoma</option>
                <option value='Oregon'>Oregon</option>
                <option value='Pennsylvania'>Pennsylvania</option>
                <option value='Rhode Island'>Rhode Island</option>
                <option value='South Carolina'>South Carolina</option>
                <option value='South Dakota'>South Dakota</option>
                <option value='Tennessee'>Tennessee</option>
                <option value='Texas'>Texas</option>
                <option value='Utah'>Utah</option>
                <option value='Vermont'>Vermont</option>
                <option value='Virginia'>Virginia</option>
                <option value='Washington'>Washington</option>
                <option value='West Virginia'>West Virginia</option>
                <option value='Wisconsin'>Wisconsin</option>
                <option value='Wyoming'>Wyoming</option>
              </select>
            </div>
            <Link to='/dashboard' className='btn btn-primary my-1'>
              Back
            </Link>
            {disableButton ? (
              <button
                onSubmit={disable}
                type='submit'
                className='btn btn-submit btn-success'
              >
                Save
              </button>
            ) : (
              <button
                disabled
                type='submit'
                className='btn btn-submit btn-success'
              >
                Disabled Save
              </button>
            )}
          </form>
        </div>
      )}
    </Fragment>
  );
}

// UpdateInfo.propTypes = {
//   getRiverById: PropTypes.func.isRequired
// };

const mapStateToProps = (state) => ({
  rivers: state.rivers,
  auth: state.auth,
});
export default connect(mapStateToProps, { getRiverById, newRiver })(UpdateInfo);
