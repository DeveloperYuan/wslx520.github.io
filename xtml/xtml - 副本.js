/*
支持if,else, else if
支持for, for in
支持中途变量缓存。比如data中有个很深的对象：peoples.people.family,可以使用#var pf = peoples.people.family把它存下来，在后面用pf访问此数据
*/
var trim = function (str) {
    return str.replace(/^\s+/,'').replace(/\s+$/, '');
}
var 
varReg = /\$([\w\$]+)/g,
blockReg = /\{\{([\s\S]+?)\}\}/g,
blockEndReg = /\{\{\s*\/[\~\?]\s*\}\}/g,
forloopReg = /\~(\S+)\s+(?:as|in)\s+([\w\$]+)?,?([\w\$]+)?/,
blankStrReg = /out\+\='\s?';?\n?/g;
var objId = 0;
var startEnd = {
    newline:{
        start:'\';\n', end:'\nout+=\''
    },
    joinline:{
        start:"\'+", end:"+\'"
    }
},
newstart = startEnd.newline.start,
newend = startEnd.newline.end,
joinstart = startEnd.joinline.start,
joinend = startEnd.joinline.end;
function varReplace ($1) {
    return $1.replace(varReg, 'it.$1')
}
function forloopReplace ($1) {    
    // console.log(forloopReg.test($1))
    $1 = $1.replace(
            forloopReg,
            $1.indexOf(' in ') > -1 
            ? 'var $2,$3;\nfor ($3 in $1) { \n$2 = $1[$3];'
            : 'for (var arr_'+(objId+=1)+'=$1, $3 = 0, arr_len_'+objId+' = $1.length, $2; $3<arr_len_'+objId+';$3++) { \n$2 = arr_'+objId+'[$3];'
        );
    return newstart + varReplace($1) + newend;
}
function codeblockReplace ($1) {    
    return newstart + varReplace($1.slice(1)) + newend;
}
var templateReplace = {
    '~':forloopReplace, '#':codeblockReplace
}
var xtml = function (str, data) {
	return 
}
xtml.codeBlock = {
	start:'{{',
	end:'}}'
}
xtml.varSymbol = '$';
function compile(str) {
	return new Function('it', 'var out=\'\';' + newend 
        + str
        .replace(blockEndReg, newstart+'}'+newend)
        .replace(/\{\{(\?{1,2})([\s\S]+?)\}\}/g, function (m, isif, condition, c) {
            condition = trim(condition);
            if(isif === '?') {
                return newstart+'if(' + condition + '){'+newend
            }
            return (condition ? '\nelse if(' + condition + '){' : '\nelse {')+newend;
        })
        .replace(/\~(\S+)\s+(in|as)\s+([\w\$]+)?,?([\w\$]+)?/, function (ma, obj, type, value, key) {
            console.log(ma, obj, value, key)
            ma = type === 'in' ? 'var ' + key + ',' + value + ';\nfor(' + key + ' in ' + obj + ') { ' + value + ' = ' + obj + '[' + key + '];' : 'for (var arr_'+(objId+=1)+'=' + obj + ','+ key +' = 0, '+ value +', arr_len_'+objId+' = '+ obj +'.length; '+key+'<arr_len_'+objId+';'+key+'++) {'+value+' = arr_'+objId+'['+key+']; ';
            console.log(varReplace(ma), newstart)
            return newstart+ varReplace(ma) + newend;
        })
        .replace(blockReg, function (m, $1, replaceFn) {
            // console.log(m,'---------', $1,'---------', $2);
            $1 = trim($1);
            return (replaceFn = templateReplace[$1.charAt(0)]) ? replaceFn($1) : joinstart + varReplace($1) + joinend;
        })
        // 去除空的 out += ''这样的字符串
        .replace(blankStrReg,'')
        + newstart
        + 'return out;'
    )
}
function aa(it) {
	var result = '';
	result += '<div id="' + it.a + '">';
	result += '<span>';
	for(var value,key =0;key < it.arr.length;key++) {
		value = it.arr[key];
		result += '<em>' + value + '</em>';
	}
	result += '</span>';
	result += '</div>';
}

var compileFn = compile(str);
console.log(
    compileFn, compileFn(srcdata)
)
$('mb').innerHTML = str;
$('result').innerHTML = compileFn(srcdata);