var React = require('react');

var Scoreboard = React.createClass({
    render: function () {
        var player = this.props.player;
        return (
            <div className={"scoreboard-player " + this.props.className}>
                <div>
				{player.displayName}
                </div>
                <div>
                {player.wins}
                </div>
            </div>
        )
    }
});

module.exports = Scoreboard;
