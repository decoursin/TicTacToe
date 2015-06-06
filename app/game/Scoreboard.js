import React from 'react';

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

export { Scoreboard };
