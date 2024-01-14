import { Html } from '../../../core/html';
import { DestroyableComponent } from '../../../components/component';
import { simplePropertyEditor } from './simple-property-editor';
import { TFiller } from 'mini-canvas-core';
import { PropertyAccessor } from '../property-accessor';

export type FillType = string | TFiller | null;

export function colorPropertyEditor(label: string, accessor: PropertyAccessor<FillType>): DestroyableComponent {
	function onInput() {
		accessor.setValue(input.value);
	}

	function setValue(value: FillType) {
		input.value = value as string;
	}

	function destroy() {
		//
	}

	const input = Html.element('input', {
		class: 'mce-prop-color-input',
		type: 'color',
		value: (accessor.getValue() as string) || '#000'
	});

	input.addEventListener('input', onInput, false);
	accessor.onExternalChanged.subscribe(setValue);

	return {
		view: simplePropertyEditor(label, input).view,
		destroy
	};
}
