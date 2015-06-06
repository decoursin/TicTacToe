var React = require('react');

var NewGame = React.createClass({
    render: function () {
        return (
            <div>
                <button onClick={this.props.handleClick} className="btn-new-game btn btn-primary">
                New Game
                </button>
            </div>
        )
    }
});

module.exports = NewGame;
