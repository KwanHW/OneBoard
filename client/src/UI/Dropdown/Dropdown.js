import React from 'react';
import { Select } from 'antd';
import { Badge } from 'reactstrap';

const { Option } = Select;

function Dropdown(props) {
	const { value, onChange, className, labelSrc } = props;
	return (
		<Select
			showSearch
			allowClear
			placeholder="Select label"
			className={className}
			value={value}
			onChange={onChange}
			mode="multiple"
		>
			{labelSrc.map((label) => (
				<Option value={label._id} key={label._id}>
					<Badge className={`bg-${label.type}`}>{label.name}</Badge>
				</Option>
			))}
		</Select>
	);
}

export default Dropdown;
