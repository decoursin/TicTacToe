var React = require('react'),
    BackboneReactMixin = require('backbone-react-component'),
    mountNode = $("#jumbotron")[0],
    app = require('./globals'),
    modal = require('./modal.jsx'),
    _ = require('underscore'),
    PlayerModel = require('./PlayerModel');

//var Players = require('../collections/Players');
//var Player = require('../collections/Player');

var Game = React.createClass({
    //mixins: [BackboneReactMixin],
    getInitialState: function () {
		var winningSolution = [],
            winner = false;
        for (var i = 0; i < 3; i++)
        {
			winningSolution.push('');
        }
        return {
            winningSolution: winningSolution,
            winner: winner
        }
    },
    updateScoreboard: function (player) {
        player.wins = player.wins + 1;
        this.props.model.store();
    },
    gameOver: function (player, index) {
		var gameOver = false,
			cells = player.cells,
			winningSolution = false;
		var possibleSolutions = app.solutions[index];
		_.each(possibleSolutions, function (arr) {
			if(_.contains(cells, arr[0]) && _.contains(cells, arr[1])) {
				winningSolution = arr;
				winningSolution.push(index);
                return;
			}
		}, this);
		return winningSolution
    },
    handleCellClick: function (location) {
        var player = this.getWhoseTurn(),
            winningSolution;
        player.cells.push(location);
        if(winningSolution = this.gameOver(player, location) ) {
            this.updateScoreboard(player);
            this.setState({
                winningSolution: winningSolution,
                winner: player
            });
            this.props.model.wasGameOver = true;
			setTimeout(function() {
				this.props.model.clearPlayerCells();
                this.props.model.wasGameOver = false;
                this.setState(this.getInitialState());
                this.props.model.store();
			}.bind(this), 3000);
        } else {
            this.forceUpdate();
        }
        this.props.model.store();
    },
    getNewPlayers: function () {
        $('#modal').modal();
    },
    resetScoreBoard: function () {
        _.each(this.props.model.players, function (player) {
            player.wins = 0;
        });
    },
    newGame: function (event) {
        this.resetScoreBoard();
        this.getNewPlayers();
    },
    componentDidUpdate: function (prevProps, prevState) {
        //if(this.state.winner) {
        //    setTimeout(function() {
        //        //TODO: set pointer that is loading or display somehow that it's clearingBoard
        //        // "Game over. Clearing board.."
        //    }.bind(this), 3000);
        //}
        ;
    },
    getWhoseTurn: function() {
        var playerX = this.props.model.players.PLAYERX,
            playerO = this.props.model.players.PLAYERO;
        if(playerX.cells.length === playerO.cells.length)
        {
            return playerX;
        } else {
            return playerO;
        }
    },
    render: function() {
        var Rows;
        Rows = [0,1,2].map(function (row) {
            return <Row key={row}
                        row={row}
                        onCellClick={this.handleCellClick}
                        players={this.props.model.players}
                        isGameOver={this.state.winner ? true : false} // Could use this.props.model.wasGameOver but it has a different purpose
                        winningSolution={this.state.winningSolution}
                   />
        }, this);
        return  (
            <div>
				<div className="scoreboard">
					<ScoreBoard player={this.props.model.players.PLAYERX} className="pull-left"/>
					<ScoreBoard player={this.props.model.players.PLAYERO} className="pull-right"/>
				</div>
                <div className="game">
					{Rows}
                </div>
                <div className="player-turn">
                    <PlayerTurn player={this.getWhoseTurn()} winner={this.state.winner}/>
                </div>
            </div>
        );
    }
});

var Row = React.createClass({
    getRowClassName: (function () {
        var lookup = ['top-row', 'middle-row', 'bottom-row'];
        return function (row) {
            return lookup[row];
        }
    })(),
    getBorder: function (row) {
        if(row === 0 || row === 1) {
            return border = <div className="border-top"></div> // Rename to border-bottom?
        }
        return '';
    },
    render: function () {
        var status = '',
            location,
            row = this.props.row,
            rowName = this.getRowClassName(row),
            border = this.getBorder(row);
        Cells = [0,1,2].map(function (cell) {
            location = row * 3 + cell;
            status = '';
            _.each(this.props.players, function (player) {
                if(_.contains(player.cells, location)) {
                    status = player;
                    return;
                }
            });
            return <Cell key={location}
                         onCellClick={this.props.onCellClick}
                         location={location}
                         status={status}
                         isGameOver={this.props.isGameOver}
                         isInWinningSolution={_.contains(this.props.winningSolution, location) ? true : false}
                   />
        }, this);
        return (
            <div className={"row " + rowName}>
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3"></div>
				{Cells}
				{border}
            </div>
        );
    }
});

var Cell = React.createClass({
    getClassName: function (location) {
        var cellLocation = location % 3;
        if(cellLocation === 0) {
            return 'left';
        } else if (cellLocation === 1) {
            return 'center';
        }
		return 'right'
    },
    handleClick: function () {
        if (this.props.status || this.props.isGameOver) {
            return;
        }
        this.props.onCellClick(this.props.location);
    },
    getFill: function (status, isInWinningSolution) {
        if (status.keyName === 'playerX' && !isInWinningSolution) {
            return <div><img src="images/X.svg" /></div>;
        } else if (status.keyName === 'playerO' && !isInWinningSolution) {
            return <div><img src="images/O.svg" /></div>;
        } else if (status.keyName === 'playerX' && isInWinningSolution) {
            return <div><img src="images/Red-X.svg" /></div>;
        } else if (status.keyName === 'playerO' && isInWinningSolution) {
            return <div><img src="images/Red-O.svg" /></div>;
        }
        return '';
    },
    render: function () {
        var status = this.props.status,
            fill = this.getFill(status, this.props.isInWinningSolution),
            isGameOver = this.props.isGameOver,
            className = this.getClassName(this.props.location);
		className = "cell " + className + " col-xs-2 col-sm-2 col-md-2 col-lg-2";
		return (
			<div onClick={this.handleClick} className={className}>
                <div className={"pointer " + (isGameOver ? '' : 'pointer-on')}>
                {fill}
				</div>
            </div>
        );
    }
});

//var NewGame = React.createClass({
//    handleClick: function (event) {
//        this.props.handleClick(event);
//    },
//    render: function () {
//        //data-toggle="modal" data-target="#modal">
//       return (
//           <div>
//			   <button onClick={this.handleClick} className="btn btn-primary">
//                    New Game
//               </button>
//		   </div>
//        )
//    }
//});

var ScoreBoard = React.createClass({
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

// TODO: Rename PlayerTurn to something else
var PlayerTurn = React.createClass({
    render: function () {
        var status;
        if(this.props.winner) {
            status = this.props.winner.displayName + " wins!"
        } else {
            status = this.props.player.displayName + "'s turn"
        }
        return (
            <p>
            {status}
            </p>
        )
    }
});

playerModel = new PlayerModel('tic-tac-toe');

module.exports = function () {
    React.render(<Game model={playerModel}/>, mountNode);
};
