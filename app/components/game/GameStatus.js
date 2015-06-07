import React from 'react';

import {globals} from '../../constants/globals';

var GameStatus = React.createClass({
    render: function () {
        var status,
            winner = this.props.winner;
        if(winner === globals.TIE_GAME) {
            status = 'Tie Game!';
        }
        else if(winner) {
            status = winner.displayName + " wins!";
        } else {
            status = this.props.player.displayName + "'s turn";
        }
        return (
            <p>
            {status}
            </p>
        )
    }
});

export { GameStatus };
