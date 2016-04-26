/*
支持if,else, else if
支持for, for in
支持中途变量缓存。比如data中有个很深的对象：peoples.people.family,可以使用#var pf = peoples.people.family把它存下来，在后面用pf访问此数据
*/
var xtml = (function () {    
    var trim = function (str) {
        return str.replace(/^\s+/,'').replace(/\s+$/, '');
    },     
    varReg = /\$([\w\$]+)/g,
    ifelseReg = /\{\{(\?{1,2})([\s\S]+?)\}\}/g,
    blockReg = /\{\{([\s\S]+?)\}\}/g,
    blockEndReg = /\{\{\s*\/[\~\?]\s*\}\}/g,
    brReg =/(\n|\r|\t)/g,
    forloopReg = /(\S+)\s+(?:as|in)\s+([\w\$]+)?,?([\w\$]+)?/,
    blankStrReg = /out\+\='\s?';?\n?/g;
    objId = 0,
    newlinestart = "';\n",
    newlineend = "\nout+='",
    joinlinestart = "'+",
    joinlineend = "+'";
    function varReplace ($1) {
        return $1.replace(varReg, 'it.$1')
    }
    var templateReplace = {
        '~':function forloopReplace ($1) {
            $1 = varReplace($1.replace(
                    forloopReg,
                    $1.indexOf(' in ') > -1 
                    ? 'var $2,$3;\nfor ($3 in $1) { \n$2 = $1[$3];'
                    : 'for (var arr_'+(objId+=1)+'=$1, $3 = 0, arr_len_'+objId+' = $1.length, $2; $3<arr_len_'+objId+';$3++) { \n$2 = arr_'+objId+'[$3];'
                ));
            return newlinestart + $1 + newlineend;
        },
        '#':function ($1) {    
            return newlinestart + varReplace($1) + newlineend;
        }
    }
    function compile(str) {
    	return new Function('it', "var out='';" + newlineend 
            // 
            + trim(str)
            .replace(brReg,'\\$1')
            .replace(blockEndReg, newlinestart+'}'+newlineend)
            .replace(ifelseReg, function (m, isif, condition, c) {
                condition = trim(condition);
                if(isif === '?') {
                    return newlinestart+'if(' + condition + '){'+newlineend
                }
                return (condition ? '\nelse if(' + condition + '){' : '\nelse {')+newlineend;
            })
            .replace(blockReg, function (m, $1, replaceFn) {
                // console.log(m,'---------', $1,'---------', $2);
                $1 = trim($1);
                return (replaceFn = templateReplace[$1.charAt(0)]) ? replaceFn($1.substr(1)) : joinlinestart + varReplace($1) + joinlineend;
            })
            // 去除空的 out += ''这样的字符串
            .replace(blankStrReg,'')
            + newlinestart
            + 'return out;'
        )
    }
    return compile;
})();