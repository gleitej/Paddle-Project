import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { submitApplicaiton } from '../../actions/userRole';

const AdminApplication = ({ submitApplicaiton, auth: { isAuthenticated } }) => {
  const [formData, setFormData] = useState({
    why: '',
    about: '',
    craft: '',
    experience: '',
    favoriteRiver: '',
  });

  const [submit, setSubmit] = useState(false);

  const { why, about, craft, experience, favoriteRiver } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    submitApplicaiton(formData);
    setSubmit(true);
  };

  if (!isAuthenticated) {
    return <Redirect to='/' />;
  }

  if (submit) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <div className='shadow-lg bg-white round-30 mt-10 mb-10'>
        <div className='text-light bg-dark pl-5 p-5 round-30'>
          <h1>Admin Application</h1>
          <h3>
            At <span className='text-info'>Paddle project</span> we take our
            data <span className='text-info'>seriously</span>
            <br /> Please take time to give{' '}
            <span className='text-info'>thoughtful </span> answers
          </h3>
        </div>
        <form onSubmit={(e) => onSubmit(e)} className='p-5 round-30 container'>
          <div className='form-group row'>
            <div className='col-md-6 col-12'>
              <label for='exampleFormControlInput1'>
                Why do you want to be an admin?
              </label>
              <textarea
                onChange={(e) => onChange(e)}
                name='why'
                value={why}
                className='form-control'
                id='exampleFormControlTextarea1'
                rows='3'
                required
              ></textarea>
            </div>
            <div className='col-md-6 col-12'>
              <label for='exampleFormControlTextarea1'>
                Tell us a little about yourself?
              </label>
              <textarea
                onChange={(e) => onChange(e)}
                name='about'
                value={about}
                className='form-control'
                id='exampleFormControlTextarea1'
                rows='3'
                required
              ></textarea>
            </div>
          </div>
          <div className='form-group row'>
            <div className='form-group col-md-4'>
              <label>What craft do you paddle?</label>
              <input
                onChange={(e) => onChange(e)}
                name='craft'
                value={craft}
                type='text'
                class='form-control'
                required
              />
            </div>
            <div class='form-group col-md-4'>
              <label>experience of experience?</label>
              <input
                onChange={(e) => onChange(e)}
                name='experience'
                value={experience}
                type='text'
                class='form-control'
                required
              />
            </div>
            <div class='form-group col-md-4'>
              <label>Favortite river?</label>
              <input
                onChange={(e) => onChange(e)}
                name='favoriteRiver'
                value={favoriteRiver}
                type='text'
                class='form-control'
                required
              />
            </div>
          </div>
          <button className='btn btn-submit btn-success'>Submit</button>
        </form>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { submitApplicaiton })(
  AdminApplication
);
