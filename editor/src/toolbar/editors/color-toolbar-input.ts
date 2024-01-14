import { Component } from '../../components/component';
import { Html } from '../../core/html';
import { SimpleEvent } from '../../core/simple-event';

export interface ColorToolbarInputComponent extends Component {
	readonly onChanged: SimpleEvent<string>;
}

export function colorToolbarInput(labelText: string, initialValue: string): ColorToolbarInputComponent {
	function onInputChanged() {
		onChanged.forward(input.value);
	}

	const onChanged = new SimpleEvent<string>();

	const label = Html.element('span', {
		class: 'mce-toolbar-label'
	});
	label.textContent = labelText;

	const input = Html.element('input', {
		class: 'mce-toolbar-color-input',
		type: 'color',
		value: initialValue
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
