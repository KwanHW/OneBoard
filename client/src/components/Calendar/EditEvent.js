import moment from 'moment';
import React, { useState, useContext, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import {
	Alert,
	Button,
	Form,
	FormFeedback,
	Input,
	Label,
	ModalBody,
	ModalFooter,
} from 'reactstrap';
import { HiLocationMarker } from 'react-icons/hi';
import { DatePicker } from 'antd';
import 'antd/dist/antd.css';
import EventModal from './EventModal';
import ModalContext from '../../store/ModalContext';
import { addEvent, updateEvent } from '../../store/event-actions';
import useInput from '../hooks/use-input';
import useError from '../hooks/use-error';
import { FormGroup } from 'reactstrap';
import { durationIsSame, initializeEvent } from '../../lib/event';

// TODO Add Error Banner
function EditEvent(props) {
	const { event, addStart } = props;
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const initEvent = initializeEvent(event, addStart);
	const modalContext = useContext(ModalContext);

	const {
		value: title,
		isValid: titleIsValid,
		hasError: titleHasError,
		onChange: titleOnChange,
		onBlur: titleOnBlur,
	} = useInput((value) => value.trim() !== '', initEvent.title);
	const descRef = useRef();
	const placeRef = useRef();
	const [dateTime, setDateTime] = useState(initEvent.dateTime);
	const [allDay, setAllDay] = useState(initEvent.allDay);
	const { error, errorMsg, changeMessage } = useError();

	const returnToView = (selectedEvent) => {
		modalContext.showModal(
			<EventModal modalType="Read" event={selectedEvent} />
		);
	};

	const changeDateTimeHandler = (dates, dateStrings) => {
		setDateTime(dates);
	};

	const submitHandler = (e) => {
		e.preventDefault();

		const newDesc = descRef.current.value;
		const newPlace = placeRef.current.value;
		let [start, end] = dateTime;

		if (!titleIsValid || start === null || end == null) {
			changeMessage('Please make sure title and duration is not empty.');
			return;
		}

		if (
			initEvent.title === title &&
			initEvent.allDay === allDay &&
			initEvent.description === newDesc &&
			initEvent.place === newPlace &&
			durationIsSame(
				{ start: event.start, end: event.end },
				{ start, end }
			)
		) {
			returnToView(event);
			return;
		}

		const [startSerialize, endSerialize] = [start, end].map((time) => {
			if (allDay) {
				time = time.startOf('day');
			}
			return time.toISOString();
		});

		const eventReq = {
			start: startSerialize,
			end: endSerialize,
			allDay,
			name: title,
			description: newDesc,
			place: newPlace,
		};

		// * Add Event
		if (initEvent.isAdd) {
			dispatch(addEvent(token, eventReq));
			modalContext.hideModal();
			return;
		}

		// * Updating Events
		eventReq['_id'] = event._id;
		dispatch(updateEvent(token, eventReq));

		returnToView({ ...eventReq, title, resource: newPlace });
	};

	const cancelHandler = () => {
		if (initEvent.isAdd) {
			modalContext.hideModal();
			return;
		}
		returnToView(event);
	};

	return (
		<React.Fragment>
			<ModalBody>
				<Form>
					<FormGroup className="mb-2">
						<Alert
							color="danger"
							isOpen={error}
							toggle={() => {
								changeMessage('');
							}}
						>
							{errorMsg}
						</Alert>
						<Label for="title">Title</Label>
						<Input
							type="text"
							id="title"
							name="title"
							placeholder="Add a title"
							value={title}
							onChange={titleOnChange}
							onBlur={titleOnBlur}
							invalid={titleHasError}
						/>
						<FormFeedback invalid>
							Title cannot be empty.
						</FormFeedback>
					</FormGroup>
					<FormGroup className="mb-2">
						<Label for="dateRange">Duration</Label>
						<DatePicker.RangePicker
							id="dateRange"
							ranges={{
								Today: [moment(), moment()],
							}}
							showTime={
								allDay
									? false
									: { use12Hours: true, format: 'h:mm a' }
							}
							style={{ width: '85%' }}
							onChange={changeDateTimeHandler}
							format={allDay ? 'DD/MM/YYYY' : 'DD/MM/YYYY h:mm a'}
							value={dateTime}
						/>
						<div className="d-flex flex-row align-items-center">
							<Input
								type="checkbox"
								id="allDay"
								name="allDay"
								onChange={(e) => setAllDay(e.target.checked)}
								defaultChecked={initEvent.allDay}
							/>
							<Label
								for="allDay"
								style={{ marginLeft: '8px', fontSize: '1rem' }}
							>
								All Day
							</Label>
						</div>
					</FormGroup>
					<FormGroup className="mb-2">
						<Label for="place">
							<HiLocationMarker />
							Location
						</Label>
						{console.log(initEvent)}
						<Input
							type="text"
							id="place"
							name="place"
							innerRef={placeRef}
							placeholder="Add a place"
							defaultValue={initEvent.resource}
						/>
					</FormGroup>
					<FormGroup className="mb-2">
						<Label for="description">Description</Label>
						<Input
							type="textarea"
							id="description"
							name="description"
							placeholder="Add a description"
							innerRef={descRef}
							defaultValue={initEvent.description}
						/>
					</FormGroup>
				</Form>
			</ModalBody>
			<ModalFooter>
				<Button color="success" type="submit" onClick={submitHandler}>
					Submit
				</Button>
				<Button color="danger" outline onClick={cancelHandler}>
					Cancel
				</Button>
			</ModalFooter>
		</React.Fragment>
	);
}

export default EditEvent;
