import { Editor } from 'mini-canvas-editor';
import { MceImageJSON, MceRect, MceTextbox } from 'mini-canvas-core';

import 'mini-canvas-editor/css/editor.css';

export class App {
	public static async create(reset: boolean): Promise<App> {
		const placeholder = document.getElementById('placeholder') as HTMLElement;
		const preview = document.getElementById('preview') as HTMLImageElement;

		const saved = Storage.tryGet();
		let editor: Editor;
		if (saved && !reset) {
			editor = await Editor.createFromJSON(saved, placeholder, {});
		} else {
			editor = Editor.createBlank(placeholder, 400, 300, {});
			editor.add(
				new MceRect({
					fill: '#ffffff',
					left: 0,
					top: 0,
					width: 400,
					height: 300,
					label: 'Background',
					selectable: false
				})
			);
			editor.add(
				new MceRect({
					fill: '#80a30b',
					left: 20,
					top: 20,
					width: 100,
					height: 260,
					label: '$cat'
				})
			);
			editor.add(
				new MceTextbox('Hello $name', {
					fontSize: 40,
					left: 140,
					top: 52,
					width: 240,
					maxHeight: 60
				})
			);
			editor.add(
				new MceTextbox('Time: $time', {
					fontSize: 20,
					left: 140,
					top: 120,
					width: 240,
					fill: '#8c8c8c',
					maxHeight: 30
				})
			);
		}

		editor.onChanged.subscribe(() => {
			const png = editor.render().toDataURL('image/png');
			preview.src = png;

			const json = editor.toJSON();
			Storage.set(json);
		});
		const app = new App(editor, preview);
		editor.onChanged.subscribe(app.reloadPreview);
		app.reloadPreview();

		const preloader = new Image();
		preloader.src = './assets/cat.jpg';
		preloader.onload = () => {
			app.catImage = preloader;
			app.reloadPreview();
		};
		return app;
	}

	public catImage?: HTMLImageElement;

	private constructor(private readonly editor: Editor, private readonly preview: HTMLImageElement) {}

	private readonly reloadPreview = async () => {
		const canvas = await this.editor.cloneToStaticCanvas();
		const replacer = canvas.getReplacer();
		const layers = canvas.getLayers();

		layers.forEach(layer => {
			if (layer.type === 'textbox') {
				const text = replacer.getText(layer);
				const newText = text.replace('$name', 'Tosiek').replace('$time', new Date().toLocaleString());
				if (newText !== text) {
					replacer.replaceText(layer, newText);
				}
			}
			if (this.catImage && layer.type === 'rect' && layer.name === '$cat') {
				replacer.replaceRectToImage(layer, this.catImage, 'fit');
			}
		});

		this.preview.src = canvas.exportToDataURL('png');
	};

	public async destroy() {
		await this.editor.destroy();
	}
}

const localStorageKey = 'mceTemplateCreator_v2';

export class Storage {
	public static tryGet(): MceImageJSON | undefined {
		const raw = localStorage[localStorageKey];
		return raw ? JSON.parse(raw) : undefined;
	}

	public static set(json: MceImageJSON) {
		localStorage[localStorageKey] = JSON.stringify(json);
	}

	public static clear() {
		localStorage.removeItem(localStorageKey);
	}
}

async function load() {
	const resetTemplateButton = document.getElementById('resetTemplateButton');
	let app = await App.create(false);

	resetTemplateButton?.addEventListener(
		'click',
		async e => {
			e.preventDefault();
			await app.destroy();
			Storage.clear();
			app = await App.create(true);
		},
		false
	);
}

document.addEventListener('DOMContentLoaded', load, false);
