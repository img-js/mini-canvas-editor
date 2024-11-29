import { MceImage, MceRect } from '../shapes';

export function fillImage(rect: MceRect, sourceImage: HTMLImageElement): MceImage {
	const scale = Math.min(rect.width / sourceImage.width, rect.height / sourceImage.height);
	const cropWidth = rect.width / scale;
	const cropHeight = rect.height / scale;

	// Center the crop area
	const cropY = Math.max(0, (sourceImage.height - cropHeight) / 2);
	const cropX = Math.max(0, (sourceImage.width - cropWidth) / 2);

	// Center the image in the rect
	const left = rect.left + (rect.width - sourceImage.width * scale) / 2;
	const top = rect.top + (rect.height - sourceImage.height * scale) / 2;

	return new MceImage(sourceImage, {
		angle: rect.angle,
		left,
		top,
		width: cropWidth,
		height: cropHeight,
		scaleX: scale,
		scaleY: scale,
		cropY,
		cropX
	});
}
