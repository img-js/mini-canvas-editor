import { EditorState } from '../../editor-state';
import { SimpleEvent } from '../../core/simple-event';
import { Observable } from 'mini-canvas-core';
import { PropertyAccessor } from './property-accessor';

export class UpdateManager<Obj extends Observable<EventSpec>, EventSpec = unknown> {
	public static create<O extends Observable<ES>, ES>(state: EditorState, events: (keyof ES)[], object: O): UpdateManager<O, ES> {
		const inst = new UpdateManager(state, object, events);
		for (const event of events) {
			object.on(event, inst.onExternalChanged);
		}
		return inst;
	}

	private readonly accessors: PropertyAccessor[] = [];
	public readonly onChanged = new SimpleEvent<void>();

	public constructor(
		private readonly state: EditorState,
		private readonly object: Obj,
		private readonly events: (keyof EventSpec)[]
	) {}

	public bind<Val = unknown>(getValue: (o: Obj) => Val, setValue: (o: Obj, value: Val) => void): PropertyAccessor<Val> {
		const accessor: PropertyAccessor<Val> = {
			onExternalChanged: new SimpleEvent(),
			lastValue: getValue(this.object),
			getValue: () => {
				return getValue(this.object);
			},
			setValue: v => {
				setValue(this.object, v);
				accessor.lastValue = v;
				this.state.canvas.requestRenderAll();
				this.onChanged.forward();
			}
		};
		this.accessors.push(accessor as PropertyAccessor);
		return accessor;
	}

	private readonly onExternalChanged = () => {
		for (const accessor of this.accessors) {
			const value = accessor.getValue();
			if (value !== accessor.lastValue) {
				accessor.onExternalChanged.forward(value);
			}
		}
	};

	public destroy() {
		for (const event of this.events) {
			this.object.off(event, this.onExternalChanged);
		}
	}
}
