import React from 'react';
import { Card, CardTitle as h3 } from 'reactstrap';
import Board from '../Kanban/Board';
import Notes from '../Notes/Notes';
import Calendar from '../Calendar/Calendar';
import Countdown from './Countdown/Countdown';
import styles from './Dashboard.module.css';

function Dashboard(props) {
	return (
		<div className="mt-4 mx-5">
			<div className="row mb-5">
				<Card className="min-h-100 p-4 shadow col-4">
					<h3>Notes</h3>
					<Notes />
				</Card>
				<div className="col-3 d-flex flex-column justify-content-around">
					<Card style={{ height: '45%' }} className="shadow p-4">
						{/* Countdown goes here */}
						<Countdown />
					</Card>
				</div>
				<Card className="col-5 shadow p-4">
					<h3>Calendar</h3>
					<Calendar />
				</Card>
			</div>
			<Card className="row mb-5 shadow p-4">
				<h3>Kanban Board</h3>
				<Board />
			</Card>
		</div>
	);
}

export default Dashboard;
