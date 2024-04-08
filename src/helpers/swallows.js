import Swal from 'sweetalert2'
import { validate as isUUID } from 'uuid'
import questionTypes from './questionTypes.js'

export function areYouSureSwal(t) {
	return Swal.fire({
		title: t('are-you-sure'),
		icon: "warning",
		confirmButtonText: t('remove'),
		cancelButtonText: t('cancel'),
		showCancelButton: true,
    })
}

export function inputSwal(pre = '') {
	return Swal.fire({
		input: 'text',
		showCancelButton: true,
		inputValue: pre,
		icon: 'question'
	})
}

export function unsupportedTypeSwal(id, type) {
	return Swal.fire({
		title: 'Unsupported Type',
		text: `id ${id} is of unsupported type, ${type}`,
		icon: 'warning'
	})
}

export function chooseTypeSwal(t) {
	return Swal.fire({
		title: t('select-question-type'),
		input: "select",
		inputOptions: Object.entries(questionTypes)
			.reduce(
				(acc, [key, val]) => ({ ...acc, [key] : t(val.description) }),
				{}
			),
		inputPlaceholder: t('select-question-type'),
		showCancelButton: true,
		confirmButtonText: t('ok'),
		cancelButtonText: t('cancel')
	})
}

export function copyItemSwal() {
	return Swal.fire({
		title: 'Enter ID of to Copy',
		input: 'text',
		inputAttributes: { autocapitalize: "off" },
		showCancelButton: true,
		cancelButtonText: 'Cancel',
		confirmButtonText: 'Copy',
		inputValidator: async (id) => {
			if (!isUUID(id)) return 'Input is not a valid UUID'
			const { active_type } = await Agent.metadata(id)
			if (!active_type || !Object.keys(questionTypes).includes(active_type)) {
				return 'ID is not of valid type'
			}
		}
	})
}