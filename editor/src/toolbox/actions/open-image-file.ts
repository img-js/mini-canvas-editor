export function openImageFile(): Promise<HTMLImageElement | null> {
	return new Promise(resolve => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.addEventListener('change', () => {
			if (input.files && input.files.length > 0) {
				const file = input.files[0];
				const reader = new FileReader();
				reader.onload = () => {
					const img = new Image();
					img.onload = () => {
						resolve(img);
					};
					img.src = reader.result as string;
				};
				reader.readAsDataURL(file);
			} else {
				resolve(null);
			}
		});
		input.click();
	});
}
