var React = require('react'),
    app = require('./globals');

var GameStatus = React.createClass({
    render: function () {
        var status,
            winner = this.props.winner;
        if(winner === app.TIE_GAME) {
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

module.exports = GameStatus;
