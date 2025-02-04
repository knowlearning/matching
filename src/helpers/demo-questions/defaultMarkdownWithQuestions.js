export default ({ source_language = 'en' }) => ({
	name: "New Markdown",
	md: null, // will be uuid of sub-scope for md content, set in customizer
	items: [
		{ id : '01fd0ef0-fb93-11ee-a57d-19b2f6cf4b58' }, // Butterfly Reordering
		{ id : '0c014c40-fb93-11ee-a57d-19b2f6cf4b58' }, // Kobe_MJ Match
		{ id : '13d0f650-fb93-11ee-a57d-19b2f6cf4b58' }, // Monument Pairs
	],
	translations: {
		source_language,
		paths : [
			[ 'name' ],
			[ 'md' ] // translation will be uuid => uuid
		]
	}
})