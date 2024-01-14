import { TOptions, TextboxProps, Textbox, classRegistry } from 'fabric';

export enum MceVerticalAlign {
	top = 1,
	middle = 2,
	bottom = 3
}

export enum MceTextBackground {
	none = 0,
	behind = 1
}

export interface MceTextboxProps extends TextboxProps {
	label: string;
	maxHeight: number;
	verticalAlign: MceVerticalAlign;
	textBackground: MceTextBackground;
	textBackgroundFill: string;
}

export class MceTextbox extends Textbox {
	public label!: string;
	public verticalAlign!: MceVerticalAlign;
	public textBackground!: MceTextBackground;
	public textBackgroundFill!: string;
	public maxHeight!: number;

	public static cacheProperties = [...Textbox.cacheProperties, 'verticalAlign', 'textBackground', 'textBackgroundFill'];

	public constructor(text: string, options: TOptions<MceTextboxProps>) {
		super(text, {
			label: 'Textbox',
			fill: '#000000',
			fontSize: 30,
			fontFamily: 'serif',
			verticalAlign: MceVerticalAlign.top,
			textBackground: MceTextBackground.none,
			textBackgroundFill: '#ff0000',
			stroke: '#ff0000',
			strokeWidth: 0,
			paintFirst: 'stroke',
			...options
		});
		this.on('scaling', this.onScaled);
	}

	public setText(text: string) {
		this.set({ text });
	}

	private readonly onScaled = () => {
		const width = this.width * this.scaleX;
		const maxHeight = this.maxHeight * this.scaleY;
		this.set({
			width,
			maxHeight,
			scaleX: 1,
			scaleY: 1
		});
	};

	protected calcTextHeight(): number {
		return this.maxHeight;
	}

	protected _getTopOffset(): number {
		const y = -this.maxHeight / 2;
		if (this.verticalAlign === MceVerticalAlign.top) {
			return y;
		}
		const allLinesHeight = this.getHeightOfLine(0) * this.textLines.length;
		const remainingHeight = Math.max(this.maxHeight - allLinesHeight, 0);
		if (this.verticalAlign === MceVerticalAlign.middle) {
			return y + remainingHeight / 2;
		}
		if (this.verticalAlign === MceVerticalAlign.bottom) {
			return y + remainingHeight;
		}
		throw new Error('Unsupported vertical align');
	}

	protected _renderTextCommon(ctx: CanvasRenderingContext2D, method: 'fillText' | 'strokeText') {
		ctx.save();
		const left = this._getLeftOffset();
		const top = this._getTopOffset();

		if (this.textBackground === MceTextBackground.behind) {
			ctx.fillStyle = this.textBackgroundFill;
		}

		let lineHeights = 0;
		for (let i = 0, len = this._textLines.length; i < len; i++) {
			const heightOfLine = this.getHeightOfLine(i);
			if (lineHeights + heightOfLine > this.maxHeight) {
				break;
			}

			const maxHeight = heightOfLine / this.lineHeight;
			const leftOffset = this._getLineLeftOffset(i);

			if (this.textBackground === MceTextBackground.behind) {
				const firstCharBox = this.__charBounds[i][0];
				const lastCharBox = this.__charBounds[i][this.__charBounds[i].length - 1];
				ctx.fillRect(left + leftOffset, top + lineHeights, lastCharBox.left - firstCharBox.left + lastCharBox.width, maxHeight);
			}

			this._renderTextLine(method, ctx, this._textLines[i], left + leftOffset, top + lineHeights + maxHeight, i);
			lineHeights += heightOfLine;
		}
		ctx.restore();
	}

	// @ts-expect-error TS this typing limitations
	public toObject(propertiesToInclude: string[] = []) {
		return super.toObject(
			propertiesToInclude.concat([
				'label',
				'selectable',
				'verticalAlign',
				'maxHeight',
				'verticalAlign',
				'textBackground',
				'textBackgroundFill'
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			]) as any
		);
	}
}

classRegistry.setClass(MceTextbox);
