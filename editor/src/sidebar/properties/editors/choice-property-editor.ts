import { Html } from '../../../core/html';
import { DestroyableComponent } from '../../../components/component';
import { simplePropertyEditor } from './simple-property-editor';
import { PropertyAccessor } from '../property-accessor';

export type Choices<T> = Record<string, T>;

export function choicePropertyEditor<T>(label: string, choices: Choices<T>, accessor: PropertyAccessor<T>): DestroyableComponent {
	function onChange() {
		const value = choiceValues[select.selectedIndex];
		accessor.setValue(value);
	}

	function setValue(value: T) {
		const index = choiceValues.indexOf(value);
		if (index >= 0) {
			for (let i = 0; i < options.length; i++) {
				options[i].selected = i === index;
			}
		}
	}

	function destroy() {
		//
	}

	const initialValue = accessor.getValue();
	const select = Html.element('select', {
		class: 'mce-prop-choice'
	});
	select.addEventListener('change', onChange, false);
	const choiceValues = Object.values(choices);
	const options = Object.keys(choices).map(label => {
		const option = Html.element('option', {
			value: label
		});
		option.text = label;
		if (choices[label] === initialValue) {
			option.selected = true;
		}
		select.appendChild(option);
		return option;
	});

	accessor.onExternalChanged.subscribe(setValue);

	return {
		view: simplePropertyEditor(label, select).view,
		destroy
	};
}
