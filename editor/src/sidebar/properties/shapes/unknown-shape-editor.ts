import { UpdateManager } from '../update-manager';
import { DestroyableComponent } from '../../../components/component';
import { commonShapeEditor } from './common-shape-editor';
import { FabricObject } from 'mini-canvas-core';

export function unknownShapeEditor(manager: UpdateManager<FabricObject>): DestroyableComponent {
	return commonShapeEditor(manager, []);
}
