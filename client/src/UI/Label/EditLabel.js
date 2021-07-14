import { LABEL_TYPES } from '../../lib/kanban';
import { Badge, Input } from 'reactstrap';

import React from 'react';

function EditLabel(props) {
	const { labels, onEdit } = props;

	return (
		<div>
			{LABEL_TYPES.map((label, index) => {
				let found = labels.find((l) => l.type === label) || {
					name: '',
				};
				return (
					<div
						className="d-flex flex-row align-items-center"
						key={label}
					>
						<Badge className={`bg-${label} p-3`}> </Badge>
						<Input
							type="text"
							onBlur={(e) => {
								onEdit(e, index);
							}}
							defaultValue={found.name}
						/>
					</div>
				);
			})}
		</div>
	);
}

export default EditLabel;
