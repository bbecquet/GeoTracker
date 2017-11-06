import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import logo from '../imgs/logo.png';
import './Page.css';

const TopBarAction = ({ icon, text, to, action }) => {
    if (to) {
        return <Link to={to}><img src={icon} alt="" />{text}</Link>;
    }
    return <button onClick={action}><img src={icon} alt="" />{text}</button>;
}

class Page extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        backPath: PropTypes.string,
        actions: PropTypes.array,
    }

    static defaultProps = {
        actions: [],
    }

    render() {
        return <div>
            <header className="pageHeader">
                <div className="pageHeader-left">
                    {this.props.backPath
                        ? <Link to={this.props.backPath}>❮</Link>
                        : <img src={logo} alt="" />
                    }
                </div>
                <h1>{this.props.title}</h1>
                <div className="pageHeader-right">
                    {this.props.actions.map((action, i) => <TopBarAction action={action} key={i} />)}
                </div>
            </header>
            <main>{this.props.children}</main>
        </div>;
    }
}

export default Page;
