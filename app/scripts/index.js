import React from 'react';

import {App} from './App';
import {model} from './models/modelLocalStorage';

window.React = React;

React.render(<App model={model} />, document.body);
