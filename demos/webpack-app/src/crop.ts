import { Editor, EditorMode } from 'mini-canvas-editor';

import 'mini-canvas-editor/css/editor.css';

export class App {
	public static preload() {
		const preloader = new Image();
		preloader.src = './assets/cat.jpg';
		preloader.onload = () => App.create(preloader);
	}

	public static create(image: HTMLImageElement) {
		const placeholder = document.getElementById('editor-placeholder') as HTMLElement;
		const saveButton = document.getElementById('save-button') as HTMLElement;

		const editor = Editor.createFromImage(
			placeholder,
			image,
			{
				workspaceHeight: 160,
				workspaceWidth: 200,
				fitToWorkspace: true,
				select: true
			},
			{
				initialMode: EditorMode.select,
				brush: false,
				rect: false,
				image: false,
				textbox: false,
				sidebar: false
			}
		);
		const app = new App(editor);
		saveButton.addEventListener('click', app.onSaveClicked, false);
		return app;
	}

	private constructor(private readonly editor: Editor) {}

	private readonly onSaveClicked = () => {
		const a = document.createElement('a');
		a.download = 'crop.png';
		a.href = this.editor.render().toDataURL('image/png');
		a.click();
	};
}

document.addEventListener('DOMContentLoaded', App.preload, false);
