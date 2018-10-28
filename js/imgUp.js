var ImgUpLib={
    elem:' <div class="card">\n' +
    '                                <div class="img-box full">\n' +
    '                                    <section class="img-section">\n' +
    '                                        <!-- \t\t\t\t\t\t<p class="up-p">作品图片：<span class="up-span">最多可以上传5张图片，马上上传</span></p>\n' +
    '                                         -->\n' +
    '                                        <div class="z_photo upimg-div clear">\n' +
    '                                            <section class="z_file fl">\n' +
    '                                                <img src="../images/uploadTips.png" class="add-img">\n' +
    '                                                <input type="file" data-descriptions="file" data-required="true"\n' +
    '                                                       name="file" id="file" class="file" value=""\n' +
    '                                                       accept="image/jpg,image/jpeg,image/png,image/bmp" multiple/>\n' +
    '                                            </section>\n' +
    '                                        </div>\n' +
    '                                    </section>\n' +
    '                                </div>\n' +
    '                                <aside class="mask works-mask">\n' +
    '                                    <div class="mask-content">\n' +
    '                                        <p class="del-p ">您确定要删除图片吗？</p>\n' +
    '                                        <p class="check-p"><span class="del-com wsdel-ok">确定</span><span class="wsdel-no">取消</span></p>\n' +
    '                                    </div>\n' +
    '                                </aside>\n' +
    '                            </div>',
    init:function (option) {
        var delParent;
        var imgArray={};
        var defaults = {
            el:"#imgUp",
            fileType         : ["jpg","png","bmp","jpeg"],   // 上传文件的类型
            fileSize         : 1024 * 1024 * 10,                  // 上传文件的大小 10M
            imgMaxSize:1
        };
        var opt=option||{};

        defaults=$.extend({},defaults,opt);
        /*点击图片的文本框*/
        $(defaults.el).append(this.elem);
        $(".file").change(function(){
            var idFile = $(this).attr("id");
            var file = document.getElementById(idFile);
            var imgContainer = $(this).parents(".z_photo"); //存放图片的父亲元素
            var fileList = file.files; //获取的图片文件
            var input = $(this).parent();//文本框的父亲元素
            var imgArr = [];
            var index=0;
            //遍历得到的图片文件
            var numUp = imgContainer.find(".up-section").length;
            var totalNum = numUp + fileList.length;  //总的数量
            if(fileList.length > defaults.imgMaxSize || totalNum > defaults.imgMaxSize ){
                alert("上传图片数目不可以超过"+defaults.imgMaxSize+"个，请重新选择");  //一次选择上传超过5个 或者是已经上传和这次上传的到的总数也不可以超过5个
            }
            else if(numUp < defaults.imgMaxSize){
                fileList = validateUp(fileList);
                // self.imgArrfile.push(fileList);
                for(var i = 0;i<fileList.length;i++){
                    var fileId='s'+index;
                    self.imgArrfile[fileId]=fileList[i];
                    self.imgArray.push(fileList[i]);
                    index++;
                    var imgUrl = window.URL.createObjectURL(fileList[i]);
                    imgArr.push(imgUrl);
                    var $section = $("<section class='up-section fl loading'>");
                    imgContainer.prepend($section);
                    var $span = $("<span class='up-span'>");
                    $span.appendTo($section);
                    var $iinput=$('<input type="file" style="display:none" class="imgFileInput" value="'+fileList[i]+'" />');
                    $iinput.appendTo($section);
                    var $img0 = $("<img data-img='"+fileId+"' class='close-upimg'>").on("click",function(event){
                        var src=$(event.target).parent().find('.up-img').attr('src');
                        var index= '';

                        var jindex='';
                        for(var i in self.imgblob){
                            if(self.imgblob[i].indexOf(src)>=0){
                                jindex=i;
                                index=self.imgblob[i].indexOf(src);
                            }
                        }
                        var indexs=$(event.target).data('img');

                        // console.log('indexs',indexs);
                        if(self.imgblob[jindex]){
                            self.imgblob[jindex].splice(index,1);

                        }

                        event.preventDefault();
                        event.stopPropagation();
                        $(".works-mask").show();
                        delParent = $(this).parent();
                        $(".wsdel-ok").attr('data-sindex',indexs)
                    });
                    $img0.attr("src","../images/a7.png").appendTo($section);
                    var $img = $("<img class='up-img up-opcity'>");
                    $img.attr("src",imgArr[i]);
                    $img.appendTo($section);
                    var $p = $("<p class='img-name-p'>");
                    $p.html(fileList[i].name).appendTo($section);
                    var $input = $("<input id='taglocation' name='taglocation' value='' type='hidden'>");
                    $input.appendTo($section);
                    var $input2 = $("<input id='tags' name='tags' value='' type='hidden'/>");
                    $input2.appendTo($section);


                }
                imgArray.elem=$section;
                self.imgblob.push(imgArr);

            }

            setTimeout(function(){
                $(".up-section").removeClass("loading");
                $(".up-img").removeClass("up-opcity");
            },450);
            numUp = imgContainer.find(".up-section").length;
            if(numUp >= defaults.imgMaxSize){
                $(this).parent().hide();
            }
        });

        $(".z_photo").delegate(".close-upimg","click",function(event){

            $(".works-mask").show();
            delParent = $(this).parent();
        });
        var self=this;
        $(".wsdel-ok").click(function(e){
            var imgArray=[];
            var srcindex=e.target.dataset.sindex;
            console.log('uuee',e.target.dataset.sindex)
            console.log('self.imgArrfile',self.imgArrfile)
            delete  self.imgArrfile[srcindex];
            for(var inn in self.imgArrfile){
                imgArray.push(self.imgArrfile[inn])
            }
            self.imgArray=imgArray;
//
            $(".works-mask").hide();
            var numUp = delParent.siblings().length;
            if(numUp < (defaults.imgMaxSize+1)){
                delParent.parent().find(".z_file").show();
            }
            delParent.remove();


        });

        $(".wsdel-no").click(function(){
            $(".works-mask").hide();
        });

        function validateUp(files){
            var arrFiles = [];//替换的文件数组
            for(var i = 0,file=files[i];i<files.length; i++){
                //获取文件上传的后缀名
                var newStr = file.name.split("").reverse().join("");
                if(newStr.split(".")[0] != null){
                    var type = newStr.split(".")[0].split("").reverse().join("");
                    if(jQuery.inArray(type, defaults.fileType) > -1){
                        // 类型符合，可以上传
                        if (file.size >= defaults.fileSize) {
                            alert(file.size);
                            alert('您这个"'+ file.name +'"文件大小过大');
                        } else {
                            // 在这里需要判断当前所有文件中
                            arrFiles.push(file);
                        }
                    }else{
                        alert('您这个"'+ file.name +'"上传类型不符合');
                    }
                }else{
                    alert('您这个"'+ file.name +'"没有类型, 无法识别');
                }
            }
            // localStorage.setItem('imgarray',arrFiles.toString())
            return arrFiles;
        }

    },
    imgArray:[],
    imgArrfile:{},
    imgblob:[],
    clearimg:function(){
        this.imgArr=[];

    }
}