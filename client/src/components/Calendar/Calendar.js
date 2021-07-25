import moment from 'moment';
import React, { useEffect, useContext, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from 'antd';
import { Calendar as Cal, momentLocalizer } from 'react-big-calendar';
import EventModal from './EventModal';
import { eventActions } from '../../store/event';
import { fetchEvents, updateEvent } from '../../store/event-actions';
import ModalContext from '../../store/ModalContext';
import { convertToDate, sameDateTime } from '../../lib/event';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DATE_FORMAT } from '../../lib/validators';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Cal);

function Calendar() {
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const [calendar, setCalendar] = useState({
		view: 'day',
		date: moment().toDate(),
	});
	const modalContext = useContext(ModalContext);
	const events = useSelector((state) => state.event).map(convertToDate);

	useEffect(() => {
		function eventsFromStorage() {
			const stringEvents = localStorage.getItem('event');
			const parsedEvents = JSON.parse(stringEvents);
			// * This is causing events to collapse on its own
			if (parsedEvents) {
				if (parsedEvents.length !== 0) {
					dispatch(eventActions.replace(parsedEvents));
					return;
				}
			}
			// console.log('Fetch events from server');
			const start = moment().startOf('month').toDate();
			const end = moment().endOf('month').toDate();
			dispatch(fetchEvents(token, start, end));
		}
		eventsFromStorage();
		return () => {
			dispatch(eventActions.store());
		};
	}, [dispatch, token]);

	const eventDropHandler = (data) => {
		if (
			sameDateTime(data.event.start, data.start) &&
			sameDateTime(data.event.end, data.end)
		) {
			return;
		}

		const newEvent = {
			...data.event,
			start: data.start.toISOString(),
			end: data.end.toISOString(),
		};
		// console.log(newEvent);
		dispatch(updateEvent(token, newEvent));
	};

	const addEventHandler = (data) => {
		modalContext.showModal(
			<EventModal modalType="Add" addStart={data.start} />
		);
	};

	const viewEventHandler = (event) => {
		modalContext.showModal(<EventModal modalType="Read" event={event} />);
	};

	const dateChangeHandler = (date) => {
		setCalendar({ ...calendar, date });

		if (calendar.view === 'month') {
			const start = moment(date).startOf('month').toDate();
			const end = moment(date).endOf('month').toDate();
			console.log(start, end);
			dispatch(fetchEvents(token, start, end));
		}
	};

	const viewChangeHandler = (view) => {
		setCalendar({ ...calendar, view });
	};

	const setDateFormat = {
		picker: calendar.view === 'month' ? 'month' : 'date',
		format: calendar.view === 'month' ? 'MMM YYYY' : DATE_FORMAT,
	};

	return (
		<React.Fragment>
			<div className="w-50 my-2">
				<b>Jump to </b>
				<DatePicker
					{...setDateFormat}
					value={moment(calendar.date)}
					allowClear={false}
					onChange={(date) => {
						dateChangeHandler(date.toDate());
					}}
				/>
			</div>
			<DnDCalendar
				{...calendar}
				onNavigate={dateChangeHandler}
				onView={viewChangeHandler}
				events={events}
				localizer={localizer}
				style={{ height: '55vh' }}
				onEventDrop={eventDropHandler}
				onEventResize={eventDropHandler}
				onSelectSlot={addEventHandler}
				onSelectEvent={viewEventHandler}
				views={['month', 'day']}
				resizable
				selectable
				popup
			/>
		</React.Fragment>
	);
}

export default Calendar;
