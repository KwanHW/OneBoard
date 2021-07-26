import React from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import { FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa';
import { BiTime } from 'react-icons/bi';
import { SORT_MODE } from '../../lib/note';

function SortNote(props) {
	const { selected, changeSort } = props;
	console.log(selected);
	return (
		<ButtonGroup>
			<Button
				color={selected === SORT_MODE[0] ? 'primary' : 'secondary'}
				onClick={() => {
					changeSort('Alphabetical (A-Z)');
				}}
			>
				<FaSortAlphaDown />
				Alphabetical Order (A-Z)
			</Button>
			<Button
				color={selected === SORT_MODE[1] ? 'primary' : 'secondary'}
				onClick={() => {
					changeSort('Alphabetical (Z-A)');
				}}
			>
				<FaSortAlphaDownAlt />
				Alphabetical Order (Z-A)
			</Button>
			<Button
				color={selected === SORT_MODE[2] ? 'primary' : 'secondary'}
				onClick={() => {
					changeSort('Last Updated');
				}}
			>
				<BiTime />
				Last Updated
			</Button>
			<Button
				onClick={() => {
					changeSort('');
				}}
			>
				Reset
			</Button>
		</ButtonGroup>
	);
}

export default SortNote;
