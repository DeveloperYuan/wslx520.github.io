/* 简易 curry 工具函数*/


var curry = function (fn) {
    var slice = Array.prototype.slice;

    function curryIt(fn) {
        var args1 = slice.call(arguments, 1);
        // 返回的函数，形参个数就为0了，在内部依靠 arguments 调用参数，
        // 所以，此返回函数就不能通过 function.length 来获取参数个数了
        return function () {
            return fn.apply(this, args1.concat(slice.call(arguments)))
        }
    }
    function aaa(a,b,c) {
        return [a,b,c,1];
    }
    var bbb = curryIt(aaa, 333, 'b.b');
    console.log(bbb('c'));

    function curryArray(fn, argsArr) {
        // unshift 是会改变数组，但返回的是操作后的数组 length ，不是返回数组，所以不能直接传入 apply 后面
        argsArr.unshift(fn);
        return curryIt.apply(this, argsArr);
    }
    // 由于经过 curryArray -> curryIt 包装返回的函数，形参个数是 0 ，无法继续包装，所以 curryAll 需要每次显式的传入形参个数参数 n
    function currayAll(fn, n) {
        function forReturn() {
            var len = arguments.length;
            var args2 = slice.call(arguments, 0);
            var remain = n - len;

            console.log(n, len, remain);
            if (remain) {
                return currayAll(curryArray.call(this, forReturn, args2), remain);
            }
            return fn.apply(this, args2);
        }
        return forReturn;
    }
    // 真正的函数
    return function (fn) {
        // fn.length 即 fn 的参数个数
        // 如果 fn 形参个数本就不明确，那 科里化 就无从进行
        return currayAll(fn, fn.length);
    };
}();

var func = function (a, b, c) {
    return [a, b, c];
};

var curriedFn = curry(func);

console.log(curriedFn(1)(2)(3));