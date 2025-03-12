export default ({ source_language = 'en' }) => ({
	name: "New Markdown",
	md: null, // will be uuid of sub-scope for md content, set in customizer
	items: [ ], // elements are { id: uuid }
	translations: {
		source_language,
		paths : [
			[ 'name' ],
			[ 'md' ] // translation will be uuid => uuid
		]
	}
})