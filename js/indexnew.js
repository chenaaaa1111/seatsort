Vue.http.options.emulateJSON = true;
var vm = new Vue({
    el : '#app',
    data : function(){
        return {
            classInfo:{},
            moveing:false,
            moveingItem:null,
            moveingTarget:null,
            moveOffset:{},
            studentsList:[],
            dragItem:null
        }
    },
    methods : {
        init:function(){
            var _this = this;
            this.$http.get('./json/classJson.json').then(function(res){
                _this.classInfo = res.data;
            })
        },
        isInArea:function(dot,area){
            // 以左上角来判断是否在区域内
            if(dot.left > area.left && dot.top > area.top && dot.left < area.right && dot.top < area.bottom){
                return true
            }
        },
        // pc端实现拖拽
        drag:function(e,dragItem){
            this.dragItem = dragItem
        },
        allowDrop:function(e){
            e.preventDefault();
        },
        drop:function(e,dropItem){
            var moveOldStudent = this.dragItem.student;
            var moveNewStudent = dropItem.student;
            dropItem.student = moveOldStudent;
            this.dragItem.student = moveNewStudent;
            this.$http.post('xxx',this.classInfo)
        },
        // 移动端实现拖拽
        startMove:function(e,item){
            console.log('drag',e)
            this.moveing = true;
            this.moveingItem = item;
            this.moveingTarget = e.target;
            this.moveOffset = {
                left : e.target.getBoundingClientRect().left+'px',
                top : e.target.getBoundingClientRect().top+'px'
            }
        },
        // 用户滑动
        move:function(e){
            if(!this.moveing){
                return false
            }
            // 更新位置
            this.moveOffset = {
                left : e.changedTouches[0].clientX+'px',
                top : e.changedTouches[0].clientY+'px'
            }
        },
        // 用户结束滑动
        endMove:function(e){
            var _this = this;
            console.log('滑动结束', this.$refs)
            document.querySelectorAll('.desk').forEach(function(item,index){
                console.log(',,,',item,+":"+index,_this.moveingTarget);
                // 判断是否在某个区域内
                if(_this.isInArea(_this.moveingTarget.getBoundingClientRect(),item.getBoundingClientRect())){
                    console.log('互换学生')
                    console.log(_this.moveingItem)
                    console.log(index)
                    // var moveOldStudent = _this.studentsList.deskId.student;
                    // var moveNewStudent = _this.studentsList.deskId.student;
                    // _this.studentsList[index].student = moveOldStudent;
                    // _this.desk_list[_this.moveingItem].student = moveNewStudent;
                    // _this.$http.post('xxx',_this.classInfo)
                }
            })
            this.moveing = false;
            this.moveingItem = null;
            this.moveingTarget = null
        },
    },
    watch : {

    },
    computed : {
        moveingStyle(){
            return {
                position:'fixed',
                ...this.moveOffset
        }
        }
    },
    created:function(){
        this.init()
    },
    mounted : function(){

    }
})



