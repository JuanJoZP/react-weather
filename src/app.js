import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from '@reach/router';
import Main from './main';
import Details from './Details';

const App = () => {
	return (
		<div>
			<Router>
				<Main path="/" />
				<Details path="/:date" />
			</Router>
		</div>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));
