import { MceImage } from 'mini-canvas-core';
import { EditorState } from '../../editor-state';
import { openImageFile } from './open-image-file';

export async function openImageAction(state: EditorState) {
	const rawImage = await openImageFile();
	if (rawImage) {
		const scale = Math.max(rawImage.width / state.canvas.workspaceWidth, rawImage.height / state.canvas.workspaceHeight);
		const image = new MceImage(rawImage, {
			left: 0,
			top: 0,
			width: rawImage.width,
			height: rawImage.height,
			scaleX: 1 / scale,
			scaleY: 1 / scale
		});
		state.add(image);
	}
}
