import React from 'react';
import Page from '../components/Page';
import logo from '../imgs/logo.png';

const About = () => (
  <Page title="About" backPath="/tracks">
    <div className="padding">
      <div style={{ textAlign: 'center', margin: '10px 0 20px' }}>
        <h1>GeoTracker</h1>
        <img src={logo} alt="" />
        <p>
          <a className="link" href="https://github.com/bbecquet/GeoTracker">
            GitHub project page
          </a>
          .
        </p>
        <p>
          © 2020{' '}
          <a className="link" href="https://bbecquet.net">
            Benjamin Becquet
          </a>
          .
        </p>
      </div>
      <h2>Attributions</h2>
      <p>
        Map views powered by{' '}
        <a className="link" href="https://leafletjs.com">
          Leaflet
        </a>
        .
      </p>
      <p>
        Maps and address data ©&nbsp;
        <a className="link" href="https://www.openstreetmap.org/copyright">
          OpenStreetMap Contributors
        </a>
        .
      </p>
    </div>
  </Page>
);

export default About;
