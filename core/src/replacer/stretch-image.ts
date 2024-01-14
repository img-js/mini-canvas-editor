import { MceImage, MceRect } from '../shapes';

export function stretchImage(rect: MceRect, sourceImage: HTMLImageElement): MceImage {
	const scaleX = rect.width / sourceImage.width;
	const scaleY = rect.height / sourceImage.height;
	return new MceImage(sourceImage, {
		angle: rect.angle,
		left: rect.left,
		top: rect.top,
		width: sourceImage.width,
		height: sourceImage.height,
		scaleX,
		scaleY
	});
}
