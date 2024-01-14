import { EditorState } from '../../editor-state';
import { Component } from '../../components/component';
import { IconButtonComponent, iconButtonComponent } from '../../components/icon-button-component';
import { Html } from '../../core/html';
import { Icons } from '../../core/icons';
import { FabricObject } from 'mini-canvas-core';

export class LayerItem implements Component {
	public static create(state: EditorState, object: FabricObject, isFirst: boolean, isLast: boolean) {
		const root = document.createElement('div');
		root.className = 'mce-layers-panel-item';

		const visibilityButton = iconButtonComponent(getIcon(object), 'Toggle visibility', 'sm');
		const deleteButton = iconButtonComponent(Icons.close, 'Delete layer', 'sm');
		let moveUpButton: IconButtonComponent | undefined;
		let moveDownButton: IconButtonComponent | undefined;

		const label = Html.div({
			class: 'mce-layers-panel-item-label'
		});

		const labelInput = Html.element('input', {
			class: 'mce-layers-panel-item-label-input'
		});
		labelInput.readOnly = true;
		labelInput.value = object.get('label') ?? object.type;

		label.appendChild(labelInput);
		root.appendChild(visibilityButton.view);
		root.appendChild(label);

		if (!isLast) {
			moveUpButton = iconButtonComponent(Icons.arrowUp, 'Move layer up', 'sm');
			root.appendChild(moveUpButton.view);
		}
		if (!isFirst) {
			moveDownButton = iconButtonComponent(Icons.arrowDown, 'Move layer down', 'sm');
			root.appendChild(moveDownButton.view);
		}

		root.appendChild(deleteButton.view);

		const item = new LayerItem(root, state, object, labelInput, visibilityButton);
		root.addEventListener('click', item.onItemClicked, false);
		labelInput.addEventListener('input', item.onLabelChanged, false);
		visibilityButton.onClicked.subscribe(item.onVisibilityClicked);
		moveUpButton?.onClicked.subscribe(item.onMoveUpClicked);
		moveDownButton?.onClicked.subscribe(item.onMoveDownClicked);
		deleteButton.onClicked.subscribe(item.onDeleteClicked);
		return item;
	}

	public isSelected = false;

	private constructor(
		public readonly view: HTMLElement,
		public readonly state: EditorState,
		public readonly object: FabricObject,
		private readonly labelInput: HTMLInputElement,
		private readonly visibilityButton: IconButtonComponent
	) {}

	private readonly onItemClicked = (e: Event) => {
		e.preventDefault();
		e.stopPropagation();
		this.state.selectObject(this.object);
	};

	private readonly onVisibilityClicked = () => {
		if (this.object.selectable && this.object.visible) {
			this.object.visible = true;
			this.object.selectable = false;
			if (this.state.canvas.getActiveObject() === this.object) {
				this.state.canvas.discardActiveObject();
			}
		} else if (this.object.visible && !this.object.selectable) {
			this.object.visible = false;
			this.object.selectable = true;
		} else {
			this.object.visible = true;
			this.object.selectable = true;
		}

		this.visibilityButton.setIcon(getIcon(this.object));
		this.state.canvas.requestRenderAll();
		this.state.onPropertiesChanged.forward(this.object);
	};

	private readonly onMoveUpClicked = () => {
		this.state.canvas.bringObjectForward(this.object);
		this.state.onLayerOrderChanged.forward();
	};

	private readonly onMoveDownClicked = () => {
		this.state.canvas.sendObjectBackwards(this.object);
		this.state.onLayerOrderChanged.forward();
	};

	private readonly onDeleteClicked = () => {
		this.state.canvas.remove(this.object);
	};

	private readonly onLabelChanged = () => {
		this.object.set('label', this.labelInput.value);
		this.state.onPropertiesChanged.forward(this.object);
	};

	public setIsSelected(isSelected: boolean) {
		this.isSelected = isSelected;
		this.labelInput.readOnly = !isSelected;
		this.view.classList.toggle('mce-selected', isSelected);
	}
}

function getIcon(object: FabricObject) {
	if (!object.selectable) {
		if (!object.visible) {
			throw new Error('Unsupported state');
		}
		return Icons.locked;
	}
	return object.visible ? Icons.eye : Icons.eyeOff;
}
