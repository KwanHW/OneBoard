import React from 'react';
// import styles from './Input.module.css';

function Input(props) {
	return (
		<div className={`${props.className}`}>
			<label htmlFor={props.id}>{props.label}</label>
			<input
				type={props.type}
				id={props.id}
				value={props.value}
				onChange={props.onChange}
				onBlur={props.onBlur}
			/>
		</div>
	);
}

// export default Input
