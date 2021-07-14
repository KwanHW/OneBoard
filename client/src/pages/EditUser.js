import React, { useState } from 'react';
import { Nav, NavLink, TabContent, TabPane } from 'reactstrap';
import MainLayout from '../Layout/MainLayout';
import ChangeInfo from '../components/Profile/ChangeInfo';
import ChangePassword from '../components/Profile/ChangePassword';

const EDIT = { info: 'changeInfo', password: 'changePW' };

// const ChangeInfo = React.lazy(() => import('../components/Profile/ChangeInfo'));

// const ChangePassword = React.lazy(() =>
// 	import('../components/Profile/ChangePassword')
// );

function EditUser() {
	const [activeTab, setActiveTab] = useState(EDIT.info);

	return (
		<MainLayout>
			<Nav tabs className="mt-4">
				<NavLink
					onClick={() => {
						setActiveTab(EDIT.info);
					}}
					style={{ active: activeTab === EDIT.info }}
				>
					Edit User Information
				</NavLink>
				<NavLink
					onClick={() => {
						setActiveTab(EDIT.password);
					}}
					style={{ active: activeTab === EDIT.password }}
				>
					Change Password
				</NavLink>
			</Nav>
			<div className="w-50 m-auto mt-3">
				<TabContent activeTab={activeTab}>
					<TabPane tabId={EDIT.info}>
						<ChangeInfo />
					</TabPane>
					<TabPane tabId={EDIT.password}>
						<ChangePassword />
					</TabPane>
				</TabContent>
			</div>
		</MainLayout>
	);
}

export default EditUser;
