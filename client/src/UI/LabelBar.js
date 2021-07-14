import { Badge } from 'reactstrap';

const LabelBar = (props) => {
	const { labels, labelSrc } = props;

	if (!labels) return null;

	const labelsToRender = labelSrc.filter(
		(label) => label._id && labels.includes(label._id)
	);

	return (
		<div className="my-1">
			{labelsToRender.map((label) => (
				<Badge className={`bg-${label.type}`} key={label._id}>
					{label.name}
				</Badge>
			))}
		</div>
	);
};

export default LabelBar;
