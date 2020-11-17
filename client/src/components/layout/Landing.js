import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

function Landing(props) {
  return (
    <section className=''>
      <div className='container'>
        <div className='row '>
          <div className='col order-2 order-md-1 '>
            <div className='text-center' style={{ paddingTop: '70px' }}>
              <LazyLoadImage
                src={require('../../assets/kayak.png')}
                alt='kayak image'
                width='90%'
                effect='opacity'
              />
            </div>
          </div>
          <div className='col-md-6 col-12 order-1 order-md-2 align-baseline mt-5'>
            <div className='row justify-content-center text-center'>
              <div className='col-12 '>
                <h1 className='t-large'>PADDLE</h1>
              </div>
            </div>

            <div className='row justify-content-center'>
              <div className='col-12 '>
                <h1 className='t-med text-center'>PROJECT</h1>
              </div>
            </div>
            <div className='row '>
              <div className='col text-center'>
                <Link to='/register' className=' btn btn-primary'>
                  Register
                </Link>
              </div>
            </div>
            <div className='row justify-content-center text-center'>
              <h4 className='col-12'>
                Creating a crowdsourced database of white water rivers
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Landing;
