import React from 'react';
import _ from 'underscore';

import {GameStatus} from './GameStatus';
import {Scoreboard} from './Scoreboard';
import {globals} from './globals';

var Game = React.createClass({
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
		var possibleSolutions = globals.solutions[index];
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
            this.cleanUp(player, winningSolution);
        } else if(this.isTieGame()) {
            this.cleanUp(globals.TIE_GAME, '');
        } else {
            this.forceUpdate();
        }
        this.props.model.store();
    },
    cleanUp: function (winner, winningSolution) {
        this.setState({
            winningSolution: winningSolution,
            winner: winner
        });
        this.props.model.wasGameOver = true;
        setTimeout(function() {
            this.props.model.clearPlayerCells();
            this.props.model.wasGameOver = false;
            this.setState(this.getInitialState());
            this.props.model.store();
        }.bind(this), 3000);
    },
    isTieGame: function() {
        var playerX = this.props.model.players.PLAYERX,
            playerO = this.props.model.players.PLAYERO;
        if(_.uniq(playerX.cells).length === 5 && _.uniq(playerO.cells).length === 4) {
            return true;
        }
        return false;
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
        var winner = this.state.winner;
        Rows = [0,1,2].map(function (row) {
            return <Row key={row}
                        row={row}
                        onCellClick={this.handleCellClick}
                        players={this.props.model.players}
                        isGameOver={(winner && winner != globals.TIE_GAME) ? true : false} // Could use this.props.model.wasGameOver but it has a different purpose
                        winningSolution={this.state.winningSolution}
                   />
        }, this);
        return  (
            <div>
				<div className="scoreboard">
					<Scoreboard player={this.props.model.players.PLAYERX} className="pull-left"/>
					<Scoreboard player={this.props.model.players.PLAYERO} className="pull-right"/>
				</div>
                <div className="game">
					{Rows}
                </div>
                <div className="player-turn">
                    <GameStatus player={this.getWhoseTurn()} winner={winner}/>
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
            var border = <div className="border-top"></div> // Rename to border-bottom?
			return border;
        }
        return '';
    },
    render: function () {
        var status = '',
            location,
            row = this.props.row,
            rowName = this.getRowClassName(row),
            border = this.getBorder(row),
			Cells;
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
		return 'right';
    },
    handleClick: function () {
        if (this.props.status || this.props.isGameOver) {
            return;
        }
        this.props.onCellClick(this.props.location);
    },
    getFill: function (status, isInWinningSolution) {
		// TODO: src picture path. Maybe, load these pictures with npm?
        if (status.keyName === 'playerX' && !isInWinningSolution) {
            return <div><img src="/app/images/X.svg" /></div>;
        } else if (status.keyName === 'playerO' && !isInWinningSolution) {
            return <div><img src="/app/images/O.svg" /></div>;
        } else if (status.keyName === 'playerX' && isInWinningSolution) {
            return <div><img src="/app/images/Red-X.svg" /></div>;
        } else if (status.keyName === 'playerO' && isInWinningSolution) {
            return <div><img src="/app/images/Red-O.svg" /></div>;
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

export { Game };
