import React, { useContext, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import {
	Alert,
	Button,
	UncontrolledTooltip,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from 'reactstrap';
import { AiOutlineClose } from 'react-icons/ai';
import ModalContext from '../../../store/ModalContext';
import styles from '../DeleteExpense.module.css';
import { bulkAddExpense } from '../../../store/expense-action';
import { useDropzone } from 'react-dropzone';
import dropStyle from './ImportExpense.module.css';
import useError from '../../hooks/use-error';

function BulkExpense() {
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const modalContext = useContext(ModalContext);
	const [isSuccess, setIsSuccess] = useState(false);
	const [fileToUpload, setFileToUpload] = useState(null);
	const { error, errorMsg, changeError, changeMessage } = useError();

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: '.csv',
		onDropRejected: (file) => {
			const errorMsg = file[0].errors[0].message;
			setIsSuccess(false);
			changeMessage(errorMsg);
		},
		onDropAccepted: (file) => {
			setIsSuccess(true);
			changeMessage('File loaded');
			setFileToUpload(file[0]);
		},
	});

	const importExpensesHandler = async () => {
		if (!fileToUpload) return; // Set error message
		const result = await dispatch(bulkAddExpense(token, fileToUpload));
		if (!result) {
			setIsSuccess(true);
			changeMessage('CSV successfully uploaded');
		} else {
			setIsSuccess(false);
			changeMessage(result);
		}
	};

	return (
		<Modal isOpen={modalContext.isVisible} toggle={modalContext.hideModal}>
			<AiOutlineClose
				onClick={modalContext.hideModal}
				className={`${styles.close} me-3 mt-3`}
			/>
			<ModalHeader>Import from csv</ModalHeader>
			<ModalBody>
				<Alert
					color={isSuccess ? 'success' : 'danger'}
					className="w-100"
					isOpen={error}
					toggle={() => {
						changeError(!error);
					}}
				>
					{errorMsg}
				</Alert>
				<p>
					Please ensure that the columns are in the following order :
					Name,Description,
					<u id="date-tooltip">Date</u>
					,Amount
				</p>
				<UncontrolledTooltip placement="bottom" target="date-tooltip">
					Supported Formats: <br />
					YYYY-MM-DD or YYYY/MM/DD
				</UncontrolledTooltip>
				{fileToUpload && (
					<p className="my-3">
						{fileToUpload.name} ({fileToUpload.size} bytes)
					</p>
				)}
				<div
					{...getRootProps({
						className: `${dropStyle.dropzone} mt-3 `,
					})}
				>
					<input {...getInputProps()} />
					<p>
						{isDragActive
							? 'Drop the file here!'
							: 'Drag and drop or click here to upload CSV.'}
					</p>
				</div>
			</ModalBody>
			<ModalFooter>
				<Button color="success" onClick={importExpensesHandler}>
					Import Expenses
				</Button>
				<Button onClick={modalContext.hideModal}>Cancel</Button>
			</ModalFooter>
		</Modal>
	);
}

export default BulkExpense;
