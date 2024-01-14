import { MceImage, MceRect } from '../shapes';

export function fitImage(rect: MceRect, sourceImage: HTMLImageElement): MceImage {
	const scale = Math.max(rect.getScaledWidth() / sourceImage.width, rect.getScaledHeight() / sourceImage.height);
	const cropWidth = rect.getScaledWidth() / scale;
	const cropHeight = rect.getScaledHeight() / scale;
	const cropY = (sourceImage.height - rect.getScaledHeight() / scale) / 2;
	const cropX = (sourceImage.width - rect.getScaledWidth() / scale) / 2;

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
