import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvent } from '../../../store/event-actions';

function determineCountdown(start, end) {
	if (moment().isAfter(end, 'days')) return { daysDiff: -1, isStart: false };

	let daysDiff;
	let isStart = true;
	if (moment().isBefore(start)) {
		daysDiff = moment().diff(start, 'days') * -1 + 1;
		console.log(daysDiff);
	} else {
		daysDiff = moment().diff(end, 'days') * -1;
		isStart = false;
	}

	return { daysDiff, isStart };
}

function Countdown() {
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const featured = useSelector((state) => state.user.featured);
	const [featuredEvent, setFeaturedEvent] = useState(null);

	useEffect(() => {
		async function fetchData() {
			const getEvent = await dispatch(fetchEvent(token, featured));
			setFeaturedEvent(getEvent);
		}

		if (featured) {
			fetchData();
		} else {
			setFeaturedEvent(null);
		}
		return () => {};
	}, [dispatch, token, featured]);

	if (!featuredEvent) {
		return <p>No events for countdown.</p>;
	}

	const countdown = determineCountdown(
		featuredEvent.start,
		featuredEvent.end
	);

	const formatMessage = !featuredEvent.allDay
		? `${countdown.isStart ? 'start of' : 'end of'}`
		: '';

	return (
		<div>
			{countdown.daysDiff > 0 && <h2>{countdown.daysDiff}</h2>}
			<p style={{ fontSize: '1.15em' }}>
				{countdown.daysDiff >= 0
					? `days to ${formatMessage} ${featuredEvent.title}`
					: 'Event selected has passed.'}
			</p>
		</div>
	);
}

export default Countdown;
