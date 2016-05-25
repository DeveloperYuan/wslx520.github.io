/*
支持if,else, else if
支持for, for in
支持中途变量缓存。比如data中有个很深的对象：peoples.people.family,可以使用#var pf = peoples.people.family把它存下来，在后面用pf访问此数据
2016/5/16:
决定插值语句和命令语句采用不同语法（如etpl一般）
*/
var xtml = (function () {
    'use strict';
    var trim = function (str) {
            return str.replace(/^\s+/, '').replace(/\s+$/, '');
        },
        varReg = /\$\{([\s\S]+?)\}/g,
        // varReg = /(.)?\$([\w\$]+)/g,
        ifelseReg = /\{\{(\?{1,2})([\s\S]+?)\}\}/g,
        blockReg = /\{\{([\s\S]+?)\}\}/g,
        blockEndReg = /\{\{\s*\/[\~\?]\s*\}\}/g,
        brReg = /(\n|\r|\t)/g,
        forloopReg = /(\S+)\s+(?:as|in)\s+([\w\$]+)?,?([\w\$]+)?/,
        blankStrReg = /out\+\='\s?';?\n?/g,
        objId = 0,
        newlinestart = "';\n",
        newlineend = "\nout+='",
        joinlinestart = "'+",
        joinlineend = "+'";
    function varFn(m, m1, m2) {
        console.log(m, m1, m2);
        if (m1 === undefined) {
            return 'it.' + m2;
        }
        if (/[^\w\$]/.test(m1)) {
            return m1 + 'it.' + m2;
        }
        return m;
    }
    function varReplace($1) {
        return $1.replace(varReg, 'it.$1');
        // return $1.replace(varReg, varFn);
    }
    function forloopReplace($1) {
        $1 = $1.replace(
            forloopReg,
            $1.indexOf(' in ') > -1
            ? 'var $2,$3;\nfor ($3 in $1) { \n$2 = $1[$3];'
            : 'for (var arr_' + (objId += 1) + '=$1, $3 = 0, arr_len_' + objId + ' = $1.length, $2; $3<arr_len_' + objId + ';$3++) { \n$2 = arr_' + objId + '[$3];'
        );
        return notjoin($1);
    }
    function notjoin ($1) {
        return newlinestart + $1 + newlineend;
    }
    /*
    function keys (obj) {
        var ks = Object.keys(obj);
        var waitEval = 'var ';
        for(var i=ks.length;i--;){
            // waitEval += ks[i] + '=obj["'+ks[i]+'"],';
            console.log('var '+ks[i] +'='+'obj["'+ks[i]+'"];')
            eval('var '+ks[i] +'='+'obj["'+ks[i]+'"];');
        }
        waitEval = waitEval.slice(0,-1)+';';
        console.log(waitEval);
        // eval在严格模式下无法用，弃!
        eval(waitEval);
        eval('var aa = 23222');
        // var d=obj['d'],c=obj['c'],b=obj['b'],a=obj['a'];
        console.log()
        setTimeout(function () {
            console.log(a,b,c,d)
        },200)
        
    }
    keys({a:1,b:{'aaa':1},c:'dddddddd',d:[1,2,3,4]})
    */
    var templateReplace = {
        '~': forloopReplace,
        '#': notjoin
    };
    function compileSource (str) {
        return "var out='';" + newlineend
            + trim(str)
            .replace(varReg, joinlinestart + '($1)' + joinlineend)
            .replace(brReg, '\\$1')
            .replace(blockEndReg, newlinestart + '}' + newlineend)
            .replace(ifelseReg, function (m, isif, condition) {
                condition = trim(condition);
                if (isif === '?') {
                    return newlinestart + 'if(' + condition + '){' + newlineend;
                }
                return (condition ? '\nelse if(' + condition + '){' : '\nelse {') + newlineend;
            })
            .replace(blockReg, function (m, $1, replaceFn) {
                // console.log(m,'---------', $1,'---------', $2);
                $1 = trim($1);
                if($1.charAt(0) === '~') return forloopReplace($1.substr(1));
                return notjoin($1);
                // return (replaceFn = templateReplace[$1.charAt(0)]) ? replaceFn($1.substr(1)) : joinlinestart + $1 + joinlineend;
            })
            // 去除空的 out += ''这样的字符串
            .replace(blankStrReg, '')
            + newlinestart
            + 'return out;'
    }
    function compile(temStr,arglist) {
        temStr = compileSource(temStr);
        return new Function(arglist == void 0 ? 'it' : arglist, temStr);
    }
    function splitArgs (obj,ks) {        
        // var ks = Object.keys(obj);
        var waitEval = 'var ';
        for(var i=ks.length;i--;){
            waitEval += ks[i] + '='+obj+'["'+ks[i]+'"],';
        }
        return waitEval.slice(0,-1)+';';        
    }
    var obj = {a:1,b:{'aaa':1},c:'dddddddd',d:[1,2,3,4]};
    // console.log(splitArgs(obj)(obj));
    var Compile = function (str) {
        this.temlate = compileSource(str);
        this.keys = null;

    }
    Compile.prototype.render = function (data) {
        var keys = Object.keys(data);
        var localeVar = splitArgs('it',keys);
        // console.log(keys, localeVar)
        // console.log(localeVar + this.temlate)
        return new Function('it', localeVar + this.temlate)(data);
    }
    return Compile;
    return compile;
}());