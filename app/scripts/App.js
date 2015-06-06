var React = require('react'),
    NewPlayersBtn = require("./buttons/NewPlayersBtn"),
    Game = require("./game/Game"),
    NewGameBtn = require("./buttons/NewGameBtn");

var App = React.createClass({
    handleModalSubmit: function (newPlayerX, newPlayerO) {
        this.props.model.createNewPlayers(newPlayerX, newPlayerO);
        this.forceUpdate();
    },
    handleNewGameClick: function (event) {
        this.props.model.makeNewGame();
        this.forceUpdate();
    },
    render: function () {
        return (
			<div className="container">
				<div className="row">
                    <div className="btn-container col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <NewGameBtn handleClick={this.handleNewGameClick} />
					</div>
                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <h1>Tic Tac Toe!</h1>
                    </div>
                    <div className="btn-container col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <div id="modal-container">
                            <NewPlayersBtn model={this.props.model} handleModalSubmit={this.handleModalSubmit} />
                        </div>
                    </div>
				</div>
				<div id="jumbotron" className="jumbotron col-xs-12 col-sm-12 col-md-12 col-lg-12">
					<Game model={this.props.model} />
				</div>
				<div className="footer">
					<p>By Nick DeCoursin :)</p>
				</div>
			</div>
        )
    }
});

module.exports = App;
