import Select from 'react-select'

export function SelectDropdown({ options, setNewAssign }) {
	const customStyles = {
		control: provided => ({
			...provided,
			backgroundColor: '#FCFDFF',
			fontWeight: 500,
			borderRadius: '0.313rem',
			minHeight: '40px',
			borderColor: '#E1E3E6',
			'&:hover': {
				borderColor: 'filter: brightness(0)',
			},
		}),
		option: (provided, state) => ({
			...provided,
			backgroundColor: state.isSelected ? '#5A5A66' : '#fff',
			color: state.isSelected ? '#fff' : '#5A5A66',
			'&:hover': {
				backgroundColor: state.isSelected ? '#5A5A66' : '#f0f0f0',
			},
		}),
		menu: provided => ({
			...provided,
			borderRadius: '0.313rem',
			zIndex: 10,
		}),
		dropdownIndicator: provided => ({
			...provided,
			color: '#5A5A66',
		}),
		placeholder: provided => ({
			...provided,
			color: '#5A5A66',
		}),
		singleValue: provided => ({
			...provided,
			color: '#5A5A66',
		}),
	}

	return (
		<Select
			options={options}
			onChange={option => setNewAssign(option.value)}
			placeholder="Selecionar"
			isSearchable
			styles={customStyles}
			noOptionsMessage={() => 'Nenhum departamento ou funcionário encontrado'}
		/>
	)
}
