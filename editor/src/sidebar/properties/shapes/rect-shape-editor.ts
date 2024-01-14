import { propertyEditorRow } from '../layout/property-editor-row';
import { UpdateManager } from '../update-manager';
import { numberPropertyEditor } from '../editors/number-property-editor';
import { DestroyableComponent } from '../../../components/component';
import { commonShapeEditor } from './common-shape-editor';
import { colorPropertyEditor } from '../editors/color-property-editor';
import { MceRect } from 'mini-canvas-core';

export function rectShapeEditor(manager: UpdateManager<MceRect>): DestroyableComponent {
	const row1 = propertyEditorRow([
		numberPropertyEditor(
			'W',
			manager.bind(
				o => o.getScaledWidth(),
				(o, v) => {
					o.set('width', v);
					o.set('scaleX', 1);
				}
			)
		),
		numberPropertyEditor(
			'H',
			manager.bind(
				o => o.getScaledHeight(),
				(o, v) => {
					o.set('height', v);
					o.set('scaleY', 1);
				}
			)
		)
	]);

	const row2 = propertyEditorRow([
		numberPropertyEditor(
			'Radius',
			manager.bind(
				o => o.rx,
				(o, v) => {
					o.set('rx', v);
					o.set('ry', v);
				}
			)
		)
	]);

	const row3 = propertyEditorRow([
		colorPropertyEditor(
			'Fill',
			manager.bind(
				o => o.fill,
				(o, v) => o.set('fill', v)
			)
		)
	]);

	const row4 = propertyEditorRow([
		numberPropertyEditor(
			'SW',
			manager.bind(
				o => o.strokeWidth,
				(o, v) => o.set('strokeWidth', v)
			)
		),
		colorPropertyEditor(
			'SC',
			manager.bind(
				o => o.stroke,
				(o, v) => o.set('stroke', v)
			)
		)
	]);

	return commonShapeEditor(manager, [row1, row2, row3, row4]);
}
