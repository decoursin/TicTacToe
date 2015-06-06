var React = require('react'),
	App = require('./App.jsx'),
    mountNode = document.body,
    model = require('./models/modelLocalStorage');

window.React = React;

React.render(<App model={model}/>, mountNode);
