import { MceStaticCanvas, type MceImageJSON } from 'mini-canvas-core/node';
import { readFileSync } from 'fs';

export async function POST({ request }: { request: Request }) {
	const json = (await request.json()) as MceImageJSON;
	const staticCanvas = await MceStaticCanvas.createFromJSON(json);

	const replacer = staticCanvas.getReplacer();
	const layers = staticCanvas.getLayers();

	layers
		.filter(layer => layer.type === 'textbox')
		.forEach(layer => {
			const text = replacer.getText(layer);
			const newText = text.replace('$time', new Date().toLocaleTimeString());
			if (newText !== text) {
				replacer.replaceText(layer, newText);
			}
		});

	const rectLayer = layers.find(layer => layer.type === 'rect');
	if (rectLayer) {
		const image = readFileSync('./static/noise.png', 'base64');
		const imageDataUrl = `data:image/png;base64,${image}`;
		await replacer.replaceRectToImage(rectLayer, imageDataUrl, 'stretch');
	}

	const dataUrl = staticCanvas.exportToDataURL('png');
	return new Response(dataUrl);
}
