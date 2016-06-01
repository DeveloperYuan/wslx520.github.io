var defaultData = {
    activeTab:'course',
            a:'aaaaaaaaaaa'
}


// 公用组件
var mainTab = Vue.component('main-tab', {
    template:'<div id="main_tab" class="tab_wrap">\
                <a v-link="{path:\'/course\', activeClass:\'active\'}" class="tab">课程</a>\
                <a v-link="{path:\'/jincourse\', activeClass:\'active\'}" class="tab">今课堂</a>\
                <a v-link="{path:\'/me\', activeClass:\'active\'}" class="tab">我</a>\
            </div>'
})
var searchBar = Vue.component('search', {
    template: '<form action="" method="POST" class="search_form">\
                <input type="text" name="keyword" id="" class="textbox" />\
                <input type="submit" value="搜索" class="btn-submit" />\
            </form>'
})
var banner = Vue.component('banner', {
    template: '<div class="banner" id="banner">\
                <ul class="img_list">\
                    <li><a href="#"><img src="" alt="banner1" /></a></li>\
                    <li><a href="#"><img src="" alt="banner2" /></a></li>\
                    <li><a href="#"><img src="" alt="banner3" /></a></li>\
                </ul>\
                <ul class="pager">\
                    <li>&#183;</li>\
                    <li>&#183;</li>\
                    <li>&#183;</li>\
                </ul>\
            </div>'
})
// 根路由组件
var Course = Vue.extend({
    template: '<search></search><br/><banner></banner><p>This is Course!</p><main-tab></main-tab>',
    components: {
        'search': searchBar,
        'main-tab': mainTab,
        'banner': banner
    }
})

var JinCourse = Vue.extend({
    template: '<search></search><br/><p>This is JinCourse!</p><main-tab></main-tab>',
    components: {
        'main-tab': mainTab,
        'search': searchBar
    }
})

var Me = Vue.extend({
    template: '<p>This is Me!</p><a v-link="{path:\'services\', append:true}">My services</a><main-tab></main-tab>',
    components: {
        'main-tab': mainTab
    },
    data: function () {
        return defaultData;
    },
    route: {
        activate: function (transition) {
            console.log(1111111111,transition.to.path)
            this.$data.activeTab = transition.to.path.slice(1);
            // defaultData.activeTab = transition.to.path.slice(1);
            console.log(this.$data.activeTab)
            transition.next()
        }
    }
})
// 子路由组件
var myServices = Vue.extend({
    template: '<ul><li>1</li><li>2</li><li>3</li></ul>'
})
// 路由器需要一个根组件。
// 出于演示的目的，这里使用一个空的组件，直接使用 HTML 作为应用的模板
var App = Vue.extend({
    el:function () {
        return $('#wrap')[0]
    },
    data: function (){
        return defaultData
    },
    methods: {
    }
})

// 创建一个路由器实例
// 创建实例时可以传入配置参数进行定制，为保持简单，这里使用默认配置
var router = new VueRouter({
    // history:true
})

// 定义路由规则
// 每条路由规则应该映射到一个组件。这里的“组件”可以是一个使用 Vue.extend
// 创建的组件构造函数，也可以是一个组件选项对象。
// 稍后我们会讲解嵌套路由
router.map({
    '/': {
        component: Course
    },
    '/course': {
        component: Course
    },
    '/jincourse': {
        component: JinCourse
    },
    '/me': {
        component: Me,
        // subRouters: {
        //     '/services': {
        //         component: myServices
        //     }
        // }
    },
    '/me/services': {
        component: myServices
    }
})

// 现在我们可以启动应用了！
// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
router.start(App, '#wrap')
