import React, { Component, PropTypes } from 'react';
import { withRouter} from 'react-router';

class PageHeader extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        backPath: PropTypes.string,
        rightChild: PropTypes.object,
    }

    render() {
        return <header className="pageHeader">
            <div className="pageHeader-left">
            {this.props.backPath &&
                <button
                    onClick={() => { this.props.router.push(this.props.backPath) }}
                >
                    {'<'}
                </button>
            }
            </div>
            <h1>{this.props.title}</h1>
            <div className="pageHeader-right">
                {this.props.rightChild}
            </div>
        </header>
    }
}

export default withRouter(PageHeader);
