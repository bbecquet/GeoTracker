import React, { Component, PropTypes } from 'react';
import { withRouter} from 'react-router';

class PageHeader extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        backPath: PropTypes.string,
        rightChild: PropTypes.object,
    }

    render() {
        return <header>
            {this.props.backPath &&
                <button
                    onClick={() => { this.props.router.push(this.props.backPath) }}
                >
                    {'<'}
                </button>
            }
            {this.props.title}
            {this.props.rightChild}
        </header>
    }
}

export default withRouter(PageHeader);
