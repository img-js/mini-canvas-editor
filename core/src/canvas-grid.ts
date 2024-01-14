export function createCanvasGrid(): HTMLCanvasElement {
	const canvas = document.createElement('canvas');
	canvas.width = 10;
	canvas.height = 10;
	const context = canvas.getContext('2d')!;
	context.fillStyle = '#ffffff';
	context.fillRect(0, 0, 10, 10);
	context.fillStyle = '#f0f0f0';
	context.fillRect(0, 0, 5, 5);
	context.fillRect(5, 5, 5, 5);
	return canvas;
}
