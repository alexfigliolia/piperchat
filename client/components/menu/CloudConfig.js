export const CloudConfig = {
	url: 'https://api.cloudinary.com/v1_1/alexfig/image/upload',
	preset: 'h09eychm',
	name: 'alexfig'
}

export const AxiosConfig = {
	onUploadProgress: progressEvent => console.log(progressEvent.loaded)
}