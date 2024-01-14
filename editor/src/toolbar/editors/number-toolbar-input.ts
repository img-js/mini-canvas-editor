import { Component } from '../../components/component';
import { Html } from '../../core/html';
import { SimpleEvent } from '../../core/simple-event';

export interface NumberToolbarInputComponent extends Component {
	readonly onChanged: SimpleEvent<number>;
}

export function numberToolbarInput(labelText: string, initialValue: number): NumberToolbarInputComponent {
	function onInputChanged() {
		const newValue = Number(input.value);
		onChanged.forward(newValue);
	}

	const onChanged = new SimpleEvent<number>();

	const label = Html.element('span', {
		class: 'mce-toolbar-label'
	});
	label.textContent = labelText;

	const input = Html.element('input', {
		class: 'mce-toolbar-number-input',
		type: 'number',
		min: '0.5',
		step: '0.5',
		value: String(initialValue)
	});
	input.addEventListener('change', onInputChanged, false);

	const view = Html.div({
		class: 'mce-toolbar-item'
	});
	view.appendChild(label);
	view.appendChild(input);
	return {
		view,
		onChanged
	};
}
