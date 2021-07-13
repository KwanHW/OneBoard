import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
	NavItem,
	Nav,
	NavLink,
	NavbarBrand,
	Navbar,
	UncontrolledDropdown,
	DropdownToggle,
} from 'reactstrap';
import { FaUserCog } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import AuthContext from '../store/AuthContext';
import { IconContext } from 'react-icons';
import { DropdownMenu } from 'reactstrap';
import { DropdownItem } from 'reactstrap';
import { useSelector } from 'react-redux';

function MainLayout(props) {
	const authContext = useContext(AuthContext);
	const user = useSelector((state) => state.user);

	const logoutHandler = () => {
		fetch('/api/signout', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		authContext.logout();
		return;
	};

	return (
		<React.Fragment>
			<Navbar
				// style={{ backgroundColor: '#458c7f' }}
				color="light"
				className="d-flex justify-content-between py-3 px-5 shadow-lg sticky-top"
			>
				<div className="d-flex flex-row align-items-center">
					<NavbarBrand>
						<Link
							to="/"
							style={{
								textDecoration: 'none',
								// color: '#fff'
							}}
							className="fs-2"
						>
							OneBoard
						</Link>
					</NavbarBrand>
					<Nav className="mx-4">
						<NavItem>
							<NavLink href="#notes">Notes</NavLink>
						</NavItem>
						<NavItem>
							<NavLink href="#kanban">Kanban Board</NavLink>
						</NavItem>
						<NavItem>
							<NavLink href="#expenses">Expense Tracker</NavLink>
						</NavItem>
					</Nav>
				</div>
				<UncontrolledDropdown>
					<DropdownToggle nav caret className="fs-5">
						{`Hello, ${user.firstName} ${user.lastName}`}
					</DropdownToggle>
					<DropdownMenu>
						<IconContext.Provider
							value={{
								color: '#343a40',
								size: '1.5em',
								style: { margin: '4px 8px 8px 0' },
							}}
						>
							<DropdownItem>
								<Link
									to="/editprofile"
									style={{
										textDecoration: 'none',
										color: 'inherit',
									}}
								>
									<FaUserCog />
									{'Edit Profile'}
								</Link>
							</DropdownItem>
							<DropdownItem onClick={logoutHandler}>
								<FiLogOut />
								{'Logout'}
							</DropdownItem>
						</IconContext.Provider>
					</DropdownMenu>
				</UncontrolledDropdown>
			</Navbar>
			{props.children}
		</React.Fragment>
	);
}

export default MainLayout;
