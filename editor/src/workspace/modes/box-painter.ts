import { FabricObject, TPointerEvent, TPointerEventInfo } from 'mini-canvas-core';
import { SimpleEvent } from '../../core/simple-event';
import { SelectionReverter, EditorState } from '../../editor-state';

export class BoxPainter {
	public static create(state: EditorState, objectFactory: () => FabricObject) {
		const selectionReverter = state.disableSelection();

		const painter = new BoxPainter(state, selectionReverter, objectFactory);
		state.canvas.on('mouse:down', painter.onDown);
		state.canvas.on('mouse:move', painter.onMove);
		state.canvas.on('mouse:up', painter.onUp);
		state.canvas.setCursor('crosshair');

		return painter;
	}

	private object: FabricObject | null = null;
	private origX = 0;
	private origY = 0;

	public readonly onFinished = new SimpleEvent<FabricObject>();

	private constructor(
		private readonly state: EditorState,
		private readonly selectionReverter: SelectionReverter,
		private readonly objectFactory: () => FabricObject
	) {}

	public destroy() {
		this.state.canvas.off('mouse:down', this.onDown);
		this.state.canvas.off('mouse:move', this.onMove);
		this.state.canvas.off('mouse:up', this.onUp);
		this.selectionReverter.revert();
	}

	private readonly onDown = (o: TPointerEventInfo<TPointerEvent>) => {
		o.e.preventDefault();
		o.e.stopPropagation();
		this.state.canvas.discardActiveObject();

		const pointer = this.state.canvas.getPointer(o.e);

		this.origX = Math.floor(pointer.x);
		this.origY = Math.floor(pointer.y);

		this.object = this.objectFactory();
		this.object.set('left', this.origX);
		this.object.set('top', this.origX);
		this.state.add(this.object);
	};

	private readonly onMove = (o: TPointerEventInfo<TPointerEvent>) => {
		if (!this.object) {
			return;
		}

		const pointer = this.state.canvas.getPointer(o.e);

		const dx = Math.floor(pointer.x - this.origX);
		const dy = Math.floor(pointer.y - this.origY);
		const width = Math.abs(dx);
		const height = Math.abs(dy);

		this.object.set({
			left: dx > 0 ? this.origX : this.origX + dx,
			top: dy > 0 ? this.origY : this.origY + dy,
			width,
			height
		});
		this.state.canvas.renderAll();
	};

	private readonly onUp = () => {
		if (!this.object) {
			return;
		}

		this.onFinished.forward(this.object);
		this.object = null;
	};
}
