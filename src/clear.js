var PO = require("pofile")

var args = process.argv
var infile = args[2]
var output = args[3]

var translation_strings = new Map()


PO.load(infile,function(err,po) {
	for(const item of po.items) {
		item.msgstr = ""
	}
	po.save(output,function(err){})
})
