<script lang="ts">
	import { onMount } from "svelte";
	import { Editor } from "mini-canvas-editor";
	import { MceRect } from "mini-canvas-core";
	import './style.css';

	const IMAGE_WIDTH = 200;
	const IMAGE_HEIGHT = 300;

	let placeholder: HTMLElement;
	let outputImage: HTMLImageElement;
	let locked = false;

	onMount(() => {
		async function renderOnBackend() {
			const json = editor.toJSON();
			const body = JSON.stringify(json);
			const response = await fetch('/backend', {
				method: 'POST',
				body
			});
			const data = await response.text();
			outputImage.src = data;
			outputImage.width = json.width;
			outputImage.height = json.height;
		}

		async function scheduleRender() {
			if (locked) {
				return
			}
			locked = true
			try {
				await renderOnBackend();
			} finally {
				locked = false
			}
		}

		const editor = Editor.createBlank(placeholder, IMAGE_WIDTH, IMAGE_HEIGHT, {});
		editor.add(new MceRect({
			left: 10,
			top: 10,
			width: 30,
			height: 30
		}));
		editor.onChanged.subscribe(scheduleRender);
		scheduleRender();
	});
</script>

<div bind:this={placeholder} class="editor-placeholder" />

<div class="output">
	<h4>Server output</h4>

	<img bind:this={outputImage} class="output-image" width={IMAGE_WIDTH} height={IMAGE_HEIGHT} alt="" />
</div>
