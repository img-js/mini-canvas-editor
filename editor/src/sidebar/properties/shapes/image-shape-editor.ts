import { UpdateManager } from '../update-manager';
import { DestroyableComponent } from '../../../components/component';
import { commonShapeEditor } from './common-shape-editor';
import { MceImage } from 'mini-canvas-core';
import { propertyEditorRow } from '../layout/property-editor-row';
import { numberPropertyEditor } from '../editors/number-property-editor';

export function imageShapeEditor(manager: UpdateManager<MceImage>): DestroyableComponent {
	const row1 = propertyEditorRow([
		numberPropertyEditor(
			'W',
			manager.bind(
				o => o.getScaledWidth(),
				(o, v) => {
					const scaleX = v / o.getOriginalSize().width;
					o.set('scaleX', scaleX);
				}
			)
		),
		numberPropertyEditor(
			'H',
			manager.bind(
				o => o.getScaledHeight(),
				(o, v) => {
					const scaleY = v / o.getOriginalSize().height;
					o.set('scaleY', scaleY);
				}
			)
		)
	]);

	return commonShapeEditor(manager, [row1]);
}
