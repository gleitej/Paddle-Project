import React from 'react';

function About(props) {
  return (
    <div style={{ padding: '' }}>
      <div className='row justify-content-center mt-5'>
        <img
          alt='icon'
          src={require('../../assets/iconNav.svg')}
          height='200px'
          width='200px'
        />
      </div>
      <div className='shadow-lg bg-white round-30 mt-5 mb-10'>
        <div className='text-center text-light bg-dark pl-5 p-5 round-30'>
          <h1>About us</h1>
          <h3>
            <span className='text-info'>Paddle project </span> was launced in
            2020. We are commited to creating an open source database of white
            water
            <span className='text-info'> rivers.</span>
            <br />
            <br /> We <span className='text-info'>do not make</span> nor intend
            to make any profit through our website. Any{' '}
            <span className='text-info'>revenue</span> earned is put directly
            back into supporting this <span className='text-info'>website</span>
            .
          </h3>
        </div>
        <div className='p-5 round-30 container'>
          <div className='row text-center'>
            <h3>
              <h1>Software</h1>
              Paddle Project is a completly open{' '}
              <span className='text-info'>source project</span>. We are always
              looking to make improvements.
              <br />
              <br />
              If you are a software <span className='text-info'>
                developer
              </span>{' '}
              and would like to contribute to our{' '}
              <span className='text-info'>code base</span> please do so. We
              thank you for your contributions
              <br />
              <br />
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://github.com/gleitej/Paddle-Project'
              >
                <i class='fab fa-github'></i>
                View Code
              </a>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

About.propTypes = {};

export default About;
