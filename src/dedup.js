var PO = require("pofile")
const fs = require("node:fs")
var SKIP = new Map()
var TOTDUP = 0
var TOTMDUP = 0
var STR = ""
var csv = [
	"source text,translation",
]


function escape(text) {
    return text.toString().replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/,/g, "\\,")
}

PO.load(process.argv[2],function(err,po) {
	for(const item of po.items) {
		var txt = item.msgid
		if(!txt.startsWith("http") && isNaN(Number(txt)) && txt.length > 2) {
			if(!SKIP[txt]) {
				TOTDUP += 1
				SKIP[txt] = 1
				STR = STR+item.toString()+"\r\n"
				var entry = escape(txt)+","+escape(item.msgstr)
				csv.push(entry)
			} else {
				TOTMDUP += 1
				SKIP[txt] += 1
			}
		} else if (!txt.startsWith("http") && isNaN(Number(txt))) {
			//
		}
	}
	var dedup = PO.parse(STR)
	dedup.save(process.argv[3],function(err) {
	})
	var total_entries = TOTDUP+TOTMDUP
	var totcount = 0
	var dupstrings = 0
	for (const _item in SKIP) {
		if (SKIP[_item] > 1) {
			dupstrings += 1
			totcount += SKIP[_item]-1
		}
	}
	console.log("Found ["+dupstrings+"] duplicate texts with ["+totcount+"] total duplicates.")
	console.log("Reduced "+total_entries+" Entries to "+(total_entries-totcount)+".")
	var _str = csv.join("\n")
	fs.writeFileSync(process.argv[3]+".csv",_str)
})
