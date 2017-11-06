import React, { Component } from 'react';
import Page from '../components/Page';
import logo from '../imgs/logo.png';

class About extends Component {
    render() {
        return <Page
            title="About"
            backPath="/tracks"
        >
            <div className="padding">
                <div style={{ textAlign: 'center', margin: '10px 0 20px' }}>
                    <h1>GeoTracker</h1>
                    <img src={logo} alt=""/>
                    <p><a className="link" href="https://github.com/bbecquet/GeoTracker">GitHub project page</a>.</p>
                    <p>© 2016 <a className="link" href="http://bbecquet.net">Benjamin Becquet</a>.</p>
                </div>
                <h2>Attributions</h2>
                <p>Map views powered by <a className="link" href="http://leafletjs.com">Leaflet</a>.</p>
                <p>Maps and address data ©&nbsp;<a className="link" href="http://www.openstreetmap.org/copyright">OpenStreetMap Contributors</a>.</p>
            </div>
        </Page>;
    }
}

export default About;
