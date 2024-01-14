import { getEnv } from 'fabric';

export function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = getEnv().document.createElement('img');
		image.onload = () => resolve(image);
		image.onerror = () => {
			const safeUrl = url.length > 20 ? url.substring(0, 20) + '...' : url;
			reject(new Error(`Failed to load image: ${safeUrl}`));
		};
		image.src = url;
	});
}
