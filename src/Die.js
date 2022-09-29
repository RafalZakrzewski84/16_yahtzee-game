/** @format */

import React, { Component } from 'react';
import './Die.css';

class Die extends Component {
	static defaultProps = {
		iconNumText: ['one', 'two', 'three', 'four', 'five', 'six'],
	};
	render() {
		const { val, locked, idx, iconNumText, handleClick, rolling } = this.props;
		let classes = `Die fa-solid fa-dice-${iconNumText[val - 1]} `;
		if (rolling) classes += 'Die-rolling';
		if (locked) classes += 'Die-locked';
		return (
			<i
				className={classes}
				disabled={rolling}
				// changed to arrow function for binding this -fixing dice locking
				onClick={() => handleClick(idx)}
			/>
		);
	}
}

export default Die;
