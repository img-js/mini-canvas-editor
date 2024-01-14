import { DestroyableComponent } from '../../../components/component';
import { UpdateManager } from '../update-manager';
import { textShapeEditor } from './textbox-shape-editor';
import { rectShapeEditor } from './rect-shape-editor';
import { circleShapeEditor } from './circle-shape-editor';
import { imageShapeEditor } from './image-shape-editor';
import { unknownShapeEditor } from './unknown-shape-editor';
import { Circle, FabricObject, MceImage, MceRect, MceTextbox, ObjectEvents } from 'mini-canvas-core';

export class ShapeEditorFactory {
	public static create(type: string, manager: UpdateManager<FabricObject, ObjectEvents>): DestroyableComponent {
		switch (type) {
			case 'rect':
				return rectShapeEditor(manager as UpdateManager<MceRect>);
			case 'circle':
				return circleShapeEditor(manager as UpdateManager<Circle>);
			case 'textbox':
				return textShapeEditor(manager as UpdateManager<MceTextbox>);
			case 'image':
				return imageShapeEditor(manager as UpdateManager<MceImage>);
			default:
				return unknownShapeEditor(manager as UpdateManager<FabricObject>);
		}
	}
}
