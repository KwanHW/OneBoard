// import moment from 'moment';
import { Button, ModalBody, ModalFooter } from 'reactstrap';
import React, { useContext } from 'react';
import { HiLocationMarker } from 'react-icons/hi';
import ModalContext from '../../store/ModalContext';
import { formatDate } from '../../lib/event';
import EventModal from './EventModal';

const ViewEvent = (props) => {
	const { event } = props;
	const { start, end, allDay, description, resource } = event;
	const modalContext = useContext(ModalContext);

	const editHandler = () => {
		modalContext.showModal(<EventModal modalType="Edit" event={event} />);
	};

	const deleteHandler = () => {
		modalContext.showModal(<EventModal modalType="Delete" event={event} />);
	};

	return (
		<React.Fragment>
			<ModalBody>
				<h4>Duration</h4>
				<p style={{ fontSize: '16px' }}>{`${formatDate(
					start,
					allDay
				)} — ${formatDate(end, allDay)}`}</p>
				<h4>
					<HiLocationMarker />
					Location
				</h4>
				<p>{resource || 'No location'}</p>
				<h4>Description</h4>
				<p>{description || 'No description'}</p>
			</ModalBody>
			<ModalFooter>
				<Button color="warning" onClick={editHandler}>
					Edit Event
				</Button>
				<Button color="danger" onClick={deleteHandler}>
					Delete Event
				</Button>
			</ModalFooter>
		</React.Fragment>
	);
};

export default ViewEvent;
