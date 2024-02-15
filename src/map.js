var PO = require("pofile")

var args = process.argv
var minimized_infile = args[2]
var original_untranslated = args[3]
var output = args[4]

var translation_strings = new Map()


PO.load(minimized_infile,function(err,po) {
	for(const item of po.items) {
		var original_string = item.msgid
		var translated_text = item.msgstr
		if(!translation_strings[item.msgid]) {
			translation_strings[item.msgid] = item.msgstr
		}
	}
	PO.load(original_untranslated,function(err,_po) {
		for(const item of _po.items) {
			if(translation_strings[item.msgid]) {
				item.msgstr = translation_strings[item.msgid]
			}
		}
		_po.save(output,function(err){})
	})
})
