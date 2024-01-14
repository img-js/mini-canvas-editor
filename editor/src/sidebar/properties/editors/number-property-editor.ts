import { Html } from '../../../core/html';
import { DestroyableComponent } from '../../../components/component';
import { simplePropertyEditor } from './simple-property-editor';
import { PropertyAccessor } from '../property-accessor';

export interface NumberPropertyEditorConfiguration {
	step?: number;
	decimals?: number;
	min?: number;
	max?: number;
}

export function numberPropertyEditor(
	label: string,
	accessor: PropertyAccessor<number>,
	configuration?: NumberPropertyEditorConfiguration
): DestroyableComponent {
	function onInput() {
		const value = Number(input.value);
		accessor.setValue(value);
	}

	function setValue(value: number) {
		input.value = value.toFixed(decimals);
	}

	function destroy() {
		//
	}

	const decimals = configuration?.decimals ?? 1;
	const input = Html.element('input', {
		class: 'mce-prop-number-input',
		type: 'number',
		value: accessor.getValue().toFixed(decimals)
	});
	if (configuration) {
		if (configuration.step) {
			input.step = configuration.step.toString();
		}
		if (typeof configuration.min === 'number') {
			input.setAttribute('min', String(configuration.min));
		}
		if (typeof configuration.max === 'number') {
			input.setAttribute('max', String(configuration.max));
		}
	}
	input.addEventListener('input', onInput, false);
	accessor.onExternalChanged.subscribe(setValue);

	return {
		view: simplePropertyEditor(label, input).view,
		destroy
	};
}
