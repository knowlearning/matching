export default async function validate(file) {
	const SIZE_LIMIT = 1000000
	if (file.size > SIZE_LIMIT) {
		console.warn('file too big')
		return false
	} else {
		return true
	}
}