import React from 'react';
import { Card } from 'reactstrap';
import Expense from '../Expense/Expense';
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
						<h3> Countdown</h3>
						<Countdown />
					</Card>

					<Card style={{ height: '45%' }} className="shadow p-4">
						{/* Expense Summary goes here */}
						Expense Summary Component
					</Card>
				</div>
				<Card className="col-5 shadow p-4">
					<h3>Calendar</h3>
					<Calendar />
				</Card>
			</div>
			<Card className="row mb-5 shadow p-4" id="kanban">
				<h3>Kanban Board</h3>
				<Board />
			</Card>

			<Card className="mb-5 shadow p-4" id="expenses">
				<h3>Expenses</h3>
				<Expense />
			</Card>
		</div>
	);
}

export default Dashboard;
