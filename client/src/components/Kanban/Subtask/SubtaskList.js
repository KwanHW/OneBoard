import React from 'react';
import { ListGroup } from 'reactstrap';
import SubtaskItem from './SubtaskItem';

function SubtaskList(props) {
	const { subtasks, onUpdate } = props;

	if (subtasks.length === 0) return <p>No Subtasks</p>;

	const renderSubtasks = subtasks.map((subtask, index) => (
		<SubtaskItem
			subtask={subtask}
			key={index}
			index={index}
			onUpdate={onUpdate}
		/>
	));

	// Maybe change to a table
	return <ListGroup>{renderSubtasks.length > 0 && renderSubtasks}</ListGroup>;
}

export default SubtaskList;
