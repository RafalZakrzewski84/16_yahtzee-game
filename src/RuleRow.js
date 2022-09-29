/** @format */

import React, { Component } from 'react';
import './RuleRow.css';

class RuleRow extends Component {
	render() {
		const { score, description, doScore, name } = this.props;
		const disabled = score !== undefined;
		return (
			<tr
				className={`RuleRow RuleRow-${disabled ? 'disabled' : 'active'}`}
				onClick={disabled ? null : doScore}>
				<td className="RuleRow-name">{name}</td>
				<td className="RuleRow-score">{disabled ? score : description}</td>
			</tr>
		);
	}
}

export default RuleRow;
