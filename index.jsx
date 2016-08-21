import 'polyfill'

import m from 'mithril'

const Test = {
	'view': function() {
		return (
			m("h1", "Hello")
			)
	}
}

m.mount(document.getElementById('root'), Test)