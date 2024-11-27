import { MceImage, MceRect } from '../shapes';

export function fillImage(rect: MceRect, sourceImage: HTMLImageElement): MceImage {
	const scale = Math.min(rect.width / sourceImage.width, rect.height / sourceImage.height);
	const cropWidth = rect.width / scale;
	const cropHeight = rect.height / scale;
	const cropY = (sourceImage.height - rect.height / scale) / 2;
	const cropX = (sourceImage.width - rect.width / scale) / 2;

	return new MceImage(sourceImage, {
		angle: rect.angle,
		left: rect.left,
		top: rect.top,
		width: cropWidth,
		height: cropHeight,
		scaleX: scale,
		scaleY: scale,
		cropY,
		cropX
	});
}
