import MatchingPlayer from '../components/Matching/Player.vue'
import MatchingCustomizer from '../components/Matching/Customizer.vue'
import TextEntryPlayer from '../components/TextEntry/Player.vue'
import TextEntryCustomizer from '../components/TextEntry/Customizer.vue'

export default {
	'application/json;type=matching' : {
		player: MatchingPlayer,
		customizer: MatchingCustomizer
	},
	'application/json;type=textEntry' : {
		player: TextEntryPlayer,
		customizer: TextEntryCustomizer
	}
}