import { UpdateManager } from '../update-manager';
import { DestroyableComponent } from '../../../components/component';
import { commonShapeEditor } from './common-shape-editor';
import { Circle } from 'mini-canvas-core';

export function circleShapeEditor(manager: UpdateManager<Circle>): DestroyableComponent {
	return commonShapeEditor(manager, []);
}
