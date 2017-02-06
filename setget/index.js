var obj = {
    set a(v) {
        this.b = v*3;
    },
    get a() {
        return this._a;
    },
    // get _a() {
    //     return
    // },
    get c() {
        return this.b*this.b;
    }
}
console.log(obj.a)
obj.a = 3;
console.log(obj)

var df = {a:0};
Object.defineProperties(df, {
    b:{
        set: function (v) {
            this.a = v *4;
        }
    },
    c: {
        value:'this is c'
    }
})
df.b = 3;
console.log(df)

var dfp = {a:0};
Object.defineProperty(dfp,'b',{
    // enumerable:true,
    // value:333
    set: function (v) {
        this.a = v * 3;
    }
})
dfp.b = 3;
console.log(dfp)