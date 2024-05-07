import Swal from 'sweetalert2'
import { validate as isUUID } from 'uuid'
import questionTypes from './questionTypes.js'

export function itemFeedbackSwal(t, isCorrect) {
	 return isCorrect ?  itemCorrectSwal(t) : itemIncorrectSwal(t)
}

function itemCorrectSwal(t) {
	return Swal.fire({
		icon: 'success',
		confirmButtonText: t('next')
	})
}

function itemIncorrectSwal(t) {
	return Swal.fire({
		icon: 'warning',
		text: t('try-again'),
		confirmButtonText: t('ok')
	})
}

export function fileNotUploadedLikelyTooLargeSwal(t) {
	return Swal.fire({
		title: t('not-uploaded'),
		text: t('file-is-likely-too-large'),
		icon: 'warning',
		confirmButtonText: t('ok')
	})
}

export function uploadSizeNotificationSwal(t) {
	return Swal.fire({
		title: t('upload-warning'),
		html: t('long-upload-warning-html-text'),
		icon: 'warning',
		confirmButtonText: t('ok'),
    })
}

export function areYouSureSwal(t) {
	return Swal.fire({
		title: t('are-you-sure'),
		icon: 'warning',
		confirmButtonText: t('remove'),
		cancelButtonText: t('cancel'),
		showCancelButton: true,
    })
}

export function inputSwal(t, pre = '') {
	return Swal.fire({
		input: 'text',
		showCancelButton: true,
		inputValue: pre,
		confirmButtonText: t('ok'),
		cancelButtonText: t('cancel'),
		icon: 'question'
	})
}

export function unsupportedTypeSwal(t, id, type) {
	return Swal.fire({
		title: t('unsupported-type'),
		text: type,
		confirmButtonText: t('ok'),
		icon: 'warning'
	})
}

export function chooseTypeSwal(t) {
	return Swal.fire({
		title: t('select-question-type'),
		input: 'select',
		inputPlaceholder: t('select-question-type').toLowerCase(),
		inputOptions: Object.entries(questionTypes)
			.reduce(
				(acc, [key, val]) => ({ ...acc, [key] : t(val.description) }),
				{}
			),
		showCancelButton: true,
		confirmButtonText: t('ok'),
		cancelButtonText: t('cancel')
	})
}

export function copyItemSwal(t) {
	return Swal.fire({
		title: t('enter-id-of-item-to-copy'),
		input: 'text',
		inputAttributes: { autocapitalize: 'off' },
		showCancelButton: true,
		cancelButtonText: t('cancel'),
		confirmButtonText: t('copy'),
		inputValidator: async (id) => {
			if (!isUUID(id)) return t('input-is-not-a-valid-uuid')
			const { active_type } = await Agent.metadata(id)
			if (!active_type || !Object.keys(questionTypes).includes(active_type)) {
				return t('input-is-not-of-valid-type')
			}
		}
	})
}

export function alertTextSwal(text) {
	return Swal.fire({text})
}