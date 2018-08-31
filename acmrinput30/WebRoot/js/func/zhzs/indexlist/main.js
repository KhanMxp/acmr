define(function (require,exports,module) {
    'use strict';
    var $ = require('jquery'),
        tree = require('tree'),
        common = require('common'),
        pjax=require('pjax'),
        modal = require('modal'),
        listjsp= require('listjsp');
    /**
     * 新增目录ajax提交，忽略数据检查
     */
    $(document).on('submit', '.J_add_catalogue', function(event) {
        event.preventDefault();
        var self = this,
            currentUrl = $(self).attr('action');
        $.ajax({
            url: currentUrl,
            data: $(self).serialize(),
            type: 'post',
            dataType: 'json',
            timeout: 10000,
            success: function(data) {
                if (data.returncode == 200) {
                    alert("保存成功");
                    $('#mymodal-data').modal('hide');
                }else {
                    alert("保存失败");
                    $('#mymodal-data').modal('hide');
                }
            },
            error: function() {
                common.commonTips('添加失败');

            }

        })

    });
    $(document).on('submit', '.J_add_plan', function(event) {
        event.preventDefault();
        var self = this,
            currentUrl = $(self).attr('action');
        $.ajax({
            url: currentUrl,
            data: $(self).serialize(),
            type: 'post',
            dataType: 'json',
            timeout: 10000,
            success: function(data) {
                if (data.returncode == 200) {
                    alert("保存成功");
                    $('#mymodal-data1').modal('hide');
                    //window.location.reload();
                    //common.commonTips('保存成功！');
                } else {
                    alert("保存失败");
                    $('#mymodal-data1').modal('hide');
                    // common.commonTips('保存出错！');
                }
            }

        })

    });
    $(document).on('submit', '.J_add_cope', function(event) {
        event.preventDefault();
        var self = this,
            currentUrl = $(self).attr('action');
        $.ajax({
            url: currentUrl,
            data: $(self).serialize(),
            type: 'post',
            dataType: 'json',
            timeout: 10000,
            success: function(data) {
                if (data.returncode == 200) {
                    alert("保存成功");
                    //$('#mymodal-data2').modal('hide');
                    setTimeout("window.location.reload()", 1500);
                    //common.commonTips('保存成功！');
                } else {
                    alert("保存失败");
                    $('#mymodal-data2').modal('hide');
                    // common.commonTips('保存出错！');
                }
            }

        })
    });
    /**
     * 搜索框
     */
    var delIds = [];
    var isMove = true;
    var searchField = "";
    $(document).on('submit', '.J_search_form', function(event) {
        event.preventDefault();
        var self = this,
            requestUrl = $(self).prop('action'),
            key = $('select',self).val(),
            val = $('input',self).val(),
            str = "";
        var requestData = common.formatData(key,val);
        if(requestData.length>0){
            requestData="&"+requestData;
        }
        searchField = requestData+str;
        isMove = false;
        $.pjax({
            url: requestUrl+searchField,
            container: '.J_regmgr_data_table'
        });
        $(document).on('pjax:success', function() {
            delIds = [];
        });
    });
    var zNodes =[
        { id:"#1", pId:0, name:"指数",isParent:true,sou:true},
        { id:"#2", pId:0, name:"我收到的指数",isParent:true,sou:true},
        { id:"#3", pId:0, name:"我共享的指数", isParent:true,sou:true}
    ];
    var indexlist=listjsp.indexlist;
    for(var i=0;i<indexlist.length;i++){
        zNodes.push(indexlist[i])
    }

    var setting = {
        async:{

        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback:{
            onClick:clickEvent
        }
    };
    var setting1 = {
        async:{

        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback:{
            onClick:clickEvent1
        }
    };
    var setting2 = {
        async:{

        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback:{
            onClick:clickEvent2
        }
    };
    var setting3 = {
        async:{

        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback:{
            onClick:clickEvent3
        }
    };
    //局部刷新列表
    function reloadList() {
        var url=window.location.href
        $('#my_index_all').load(url + ' .my_index')
    }
    function clickEvent(event,treeId,treeNode) {
        if(treeNode.isParent==false){
            return false
        }
        $.ajaxSettings.async=false
        $("#my_index_all").children().removeAttr("class")
        reloadList()
        changeTrClass();
        var proCode=treeNode.id
        var classname="-"+proCode+"-"
        $(".my_index:not([class*='" +
            classname+"'])").detach()
    }
    function clickEvent1(event,treeId,treeNode) {

        if (treeNode.id != '') {
            $('input[name=cataname]').val(treeNode.name);
            $('input[name=idcata]').val(treeNode.id);
        } else {
            $('input[name=cataname]').val('');
        }

    }
    function clickEvent2(event,treeId,treeNode) {

        if (treeNode.id != '') {
            $('input[name=planname]').val(treeNode.name);
            $('input[name=idplan]').val(treeNode.id);
        } else {
            $('input[name=planname]').val('');
        }

    }
    function clickEvent3(event,treeId,treeNode) {

        if (treeNode.id != '') {
            $('input[name=indexname]').val(treeNode.name);
            $('input[name=nprocode]').val(treeNode.id);
        } else {
            $('input[name=indexname]').val('');
        }

    }

    //修复图标，使没有子节点的目录也显示为目录
    function fixIcon(treeid){
        var treeObj = $.fn.zTree.getZTreeObj(treeid);
        //过滤出sou属性为true的节点（也可用你自己定义的其他字段来区分，这里通过sou保存的true或false来区分）
        var folderNode = treeObj.getNodesByFilter(function (node) { return node.sou});
        for(var j=0 ; j<folderNode.length; j++){//遍历目录节点，设置isParent属性为true;
            folderNode[j].isParent = true;
        }
        treeObj.refresh();//调用api自带的refresh函数。
    }


    //添加一个属性path，里面存放节点的的所有父节点（包括自己）
    function addPath(){
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var nodes=treeObj.transformToArray(treeObj.getNodes());
        for(var i=0;i<nodes.length;i++){
            var paths=nodes[i].getPath();
            var path="";
            for(var j=0;j<paths.length;j++){
                path=path+"-"+paths[j].id
            }
            nodes[i].path=path;
        }
    }
    //操作列表的class
    function changeTrClass(){
       // 修正classname
        $("tr[class='pro-']").attr("class","pro-#1")
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var nodes=treeObj.transformToArray(treeObj.getNodes());
        //把path添加到class中
        for(var i=0;i<nodes.length;i++){
            var comp=nodes[i].id;
            var path=nodes[i].path;
            //console.log(comp)
            $("tr[class*='pro-" +
                comp+"']").addClass(path)
        }
    }
    /**
     * 删除数据
     */
    $(document).on('click','.J_opr_del',function(event){
        event.preventDefault();
        var self = this,
            delId = $(self).attr('id');
        if(!confirm("确定要删除选中记录吗？")){
            return;
        }
        $.ajax({
            url:common.rootPath+'zbdata/indexlist.htm?m=toDelete',
            data:"delId=" + delId,
            type:'post',
            dataType:'json',
            timeout:1000,
            success:function(data){
                if(data.returncode == 200){
                    common.commonTips("删除成功");
                    window.location.reload(true);
                }else{
                    common.commonTips(data.returndata);
                }
            }
        });
    });
    /*function categoryEdit(){
        console.log("editcategory")*/
    //     $(document).on('click','.category_edit',function(event){
    //         event.preventDefault();
    //         if($('#grade_modal_search').length>0){
    //             $('#grade_modal_search').remove();
    //         }
    //         var modalContent = '<div class="modal-header">';
    //         modalContent +='<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
    //         modalContent +='<h4 class="modal-title" id="myModalLabel">高级查询</h4>';
    //         modalContent +='</div>';
    //         modalContent +='<div class="modal-body">';
    //         modalContent +='<div class="form-inline form-margin">';
    //         modalContent +='<div class="form-group">';
    //         modalContent +='<select class="form-control input-sm" name="searchCode"><option value="code">代码</option><option value="cname">名称</option><option value="cname_en">英文名称</option>';
    //         modalContent +='<option value="ccname">中文全称</option><option value="ccname_en">英文全称</option><option value="ifdata">指标、分类</option>';
    //         modalContent +='<option value="cexp">中文解释</option><option value="cexp_en">英文解释</option><option value="cmemo">中文备注</option><option value="cmemo_en">英文备注</option><option value="createtime">生成时间</option>';
    //         modalContent +='</select>';
    //         modalContent +='</div>';
    //         modalContent +='<div class="form-group">';
    //         modalContent +='<select class="form-control input-sm btn-margin" name="searchOpr"><option value="like">包含</option><option value="=">等于</option><option value=">=">大于等于</option><option value=">">大于</option><option value="<=">小于等于</option><option value="<">小于</option>';
    //         modalContent +='<option value="not like">不包含</option><option value="<>">不等于</option><option value="起于">起于</option><option value="止于">止于</option><option value="is">is</option>';
    //         modalContent +='</select>';
    //         modalContent +='</div>';
    //         modalContent +='<div class="form-group">';
    //         modalContent +='<select class="form-control input-sm btn-margin" name="searchCondition"><option value="|">或</option><option value="&">与</option></select>';
    //         modalContent +='</div>';
    //         modalContent +='<div class="form-group">';
    //         modalContent +='<input type="text" class="form-control input-sm btn-margin" name="searchText" placeholder="条件值"/>';
    //         modalContent +='</div>';
    //         modalContent +='<div class="form-group">';
    //         modalContent +='<button type="button" class="btn btn-sm btn-primary btn-margin J_component_sentence">组合语句</button>';
    //         modalContent +='</div>';
    //         modalContent +='</div>';
    //         modalContent +='<div class="form-group">';
    //         modalContent +='<textarea class="form-control J_priview_sentence" rows="3" readonly></textarea>';
    //         modalContent +='<textarea class="form-control J_hpriview_sentence hidden" rows="3"></textarea>';
    //         modalContent +='</div>';
    //         modalContent +='<div class="form-group" id="msg"></div>';
    //         modalContent +='<div class="modal-footer">';
    //         modalContent +='<button type="button" class="btn btn-primary J_btn_clear_condition">清空</button>';
    //         modalContent +='<button type="button" class="btn btn-primary J_btn_import_condition">代码导入</button>';
    //         modalContent +='<button type="button" class="btn btn-primary J_btn_check_condition">分析</button>';
    //         modalContent +='<button type="button" class="btn btn-primary J_btn_save_condition" id="find">查询</button><button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>';
    //         modalContent +='</div>';
    //         common.buildModelHTML('grade_modal_search',modalContent);
    //         $("#msg").hide();
    //         $('#grade_modal_search').modal('show');
    //     });
    // }

    $(document).ready(function(){
        $.fn.zTree.init($("#treeDemo"), setting, zNodes);
        fixIcon("treeDemo");
        addPath();

        $.fn.zTree.init($("#treeCata"), setting1, CategoryNodes);
        fixIcon("treeCata");
        $.fn.zTree.init($("#treePlan"), setting2, CategoryNodes);
        fixIcon("treePlan");
        $.fn.zTree.init($("#treeZs"), setting3, zNodes);
        fixIcon("treeZs");

    });


    //CategoryNode为只有目录的树结构nodes
    var CategoryNodes=[];
    for(i=0;i<zNodes.length;i++){
        if (zNodes[i].isParent==true&&zNodes[i].pId!="#2"&&zNodes[i].pId!="#3"){
            CategoryNodes.push(zNodes[i])
        }
    }
    console.log(CategoryNodes)

    module.exports={
        CategoryNodes:CategoryNodes
    }

})