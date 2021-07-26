export function createNote(note) {
	const { _id, name, description, updatedAt: lastUpdated } = note;
	return { _id, name, description, lastUpdated };
}

export const SORT_MODE = [
	'Alphabetical (A-Z)',
	'Alphabetical (Z-A)',
	'Last Updated',
];
const sortFns = {
	'Alphabetical (A-Z)': (noteA, noteB) => {
		const titleA = noteA.name.toLowerCase();
		const titleB = noteB.name.toLowerCase();
		if (titleA > titleB) return 1;
		if (titleA < titleB) return -1;
		return 0;
	},
	'Alphabetical (Z-A)': (noteA, noteB) => {
		const titleA = noteA.name.toLowerCase();
		const titleB = noteB.name.toLowerCase();
		if (titleA > titleB) return -1;
		if (titleA < titleB) return 1;
		return 0;
	},
	'Last Updated': (noteA, noteB) => {
		const dateA = new Date(noteA.lastUpdated).valueOf();
		const dateB = new Date(noteB.lastUpdated).valueOf();
		return dateB - dateA;
	},
};

export const noteSort = (notesToSort, sortMode) => {
	const sortingFn = sortFns[sortMode];
	return [...notesToSort].sort(sortingFn);
};
