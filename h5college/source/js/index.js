(function (undef) {
    // 一个简单的发起请求时loading，完成时清除loading的函数，且返回一个promise
    function loaData (url) {
        $('#loading').show();
        return new Promise(function (resolve, reject) {                
            var getData = $.get(url);
            console.log(getData);
            getData.onload = function () {

                // 手动加5秒延迟
                // setTimeout(function () {
                    resolve(JSON.parse(getData.responseText));
                // },5000) 
                $('#loading').hide();

            }
        })
    }
    // mock数据的ajax请求基础url
    var baseUrl = '//localhost:3000';
    // 公用组件
    var mainTab = Vue.component('main-tab', {
        template:'#main-tab'
    })
    var searchBar = Vue.component('search', {
        template: '#search-bar'
    })
    var banner = Vue.component('banner', {
        template: '#banner'
    })
    var listCourses = Vue.component('course-list', {
        props:['courses'],
        template:'#course-list-tpl'
    })
    // 根路由组件
    var Course = Vue.extend({
        template: '#index-tpl',
        components: {
            'search': searchBar,
            'main-tab': mainTab,
            'banner': banner,
            'course-list': listCourses
        },
        data: function () {
            return {
                mycourses: undef,
                newcourses: undef,
                courses_goutong:undef,
                hotcourses: undef
            }
        },
        route: {
            data: function () {
                return loaData(baseUrl + '/index')
            }
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
        route: {
            activate: function (transition) {
                console.log(1111111111,transition.to.path)
                transition.next()
            }
        }
    })
    // 子路由组件
    var CoursesList = Vue.extend({
        template: '课程列表页 <br/>分类是：{{$route.query.cat}},排序是：{{$route.query.order}}<br/> <ul><li>课程11</li><li>课程2</li><li>课程3</li></ul>'
    });
    var myServices = Vue.extend({
        template: '<div class="status">VIP状态：{{status}}</div>\
                记录：\
                <ul><li v-for="vip in history">\
                    开通时间：{{vip.doneDate}} <br />\
                    类型：{{vip.type}} <br />\
                    数量：{{vip.num}} <br />\
                    开始日期：{{vip.startDate}} <br />\
                    结束日期：{{vip.endDate}} <br />\
                </li></ul>',
        data: function () {            
            return {
                status:1,
                history:[]
            }
        },
        route: {
            data: function () {
                return loaData(baseUrl + '/myservices')
            }
        }
    })
    var courseDetail = Vue.extend({
        template:'课程详情页，id是：{{$route.params.id}}'
    })
    // 路由器需要一个根组件。
    // 出于演示的目的，这里使用一个空的组件，直接使用 HTML 作为应用的模板
    var App = Vue.extend({
        el:function () {
            return $('#wrap')[0]
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
        // 课程首页
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
        // 课程列表页
        '/course/list': {
            // name:'coursesList',
            component: CoursesList
        },
        '/me/services': {
            component: myServices
        },
        '/courses/:id': {
            component: courseDetail
        }
    })

    // 现在我们可以启动应用了！
    // 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
    router.start(App, '#wrap')
        
})();
