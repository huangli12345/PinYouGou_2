 //控制层 
app.controller('goodsController' ,function($scope,$controller,$location,goodsService,uploadService,itemCatService,typeTemplateService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(){
		var id=$location.search()["id"];//获取参数值
		if(id==null){
			return;
		}
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;
				//设置富文本编辑器里的值
				editor.html($scope.entity.goodsDesc.introduction);
				//序列化图片列表成json
				$scope.entity.goodsDesc.itemImages=JSON.parse($scope.entity.goodsDesc.itemImages);
				//序列化拓展属性成json
				$scope.entity.goodsDesc.customAttributeItems=JSON.parse($scope.entity.goodsDesc.customAttributeItems);
				//序列化规格选项属性chengjson
				$scope.entity.goodsDesc.specificationItems=JSON.parse($scope.entity.goodsDesc.specificationItems);
				//SKU列表规格转换
				// for(var i = 0; i < $scope.entity.itemList.length; i++) {
                 //    $scope.entity.itemList[i].spec=JSON.parse($scope.entity.itemList[i].spec);
				// }
                //SKU 列表规格列转换
                for( var i=0;i<$scope.entity.itemList.length;i++ ){
                    $scope.entity.itemList[i].spec =
                        JSON.parse( $scope.entity.itemList[i].spec);
                }
			}
		);				
	}
	
	//保存 
	$scope.add=function(){
//		$scope.entity.goodsDesc.introduction=editor.html();
		$scope.entity.goodsDesc.introduction=editor.html();
		goodsService.add($scope.entity).success(
			function(response){
				if(response.success){
					$scope.entity={};
					editor.html('');
					alert("保存成功");
				}else{
					alert(response.message);
				}
			}		
		);				
	}

	//保存
	$scope.save=function () {
        //提取文本编辑器的值
		$scope.entity.goodsDesc.introduction=editor.html();
		//服务层对象
		var serviceObject;//服务层对象
		if($scope.entity.goods.id!=null){//如果有 ID
            serviceObject=goodsService.update( $scope.entity ); //修改
        }else{
            serviceObject=goodsService.add( $scope.entity );//增加
        }
        serviceObject.success(
            function(response){
                if(response.success){
                    //alert('保存成功');
                    //$scope.entity={};
                    //editor.html("");
					location.href="goods.html";//跳转到商品列表页
                }else{
                    alert(response.message);
                }
            }
        );
    }
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象
    $scope.status=['未审核','已审核','审核未通过','关闭'];//商品状态
	
	
	//搜索

	$scope.search=function(page,rows){			
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//上传图片
   // $scope.image_entity={};
	$scope.uploadFile=function(){
		uploadService.uploadFile().success(
			function(response){
				//debugger;
				if(response.success){
					$scope.image_entity.url=response.message;
				}else{
					alert(response.message);
				}
			}
		).error(
			function(){
				alert('上传发生错误');
			}
		);
	}
	
	//添加到图片列表
	$scope.entity={goods:{},goodsDesc:{itemImages:[],specificationItems:[]}};//定义页面实体结构
	$scope.addToImageList=function(){
		$scope.entity.goodsDesc.itemImages.push($scope.image_entity);
	}
	
	//从图片列表删除
	$scope.deleToImageList=function(index){
		$scope.entity.goodsDesc.itemImages.splice(index,1);
	}
	
	//查询一级分类下拉列表框
	$scope.selectItemCat1List=function(){
		itemCatService.findByParentId(0).success(
			function(response){
				$scope.itemCat1List=response;
			}
		);
	}
	
	//查询二级分类下拉列表框
	$scope.$watch('entity.goods.category1Id',function(newValue,oldValue){
		itemCatService.findByParentId(newValue).success(
				function(response){
					$scope.itemCat2List=response;
				}
			);
		
		}
	);
	
	//查询三级分类下拉列表框
	$scope.$watch('entity.goods.category2Id',function(newValue,oldValue){
		itemCatService.findByParentId(newValue).success(
				function(response){
					$scope.itemCat3List=response;
				}
			);
		
		}
	);
	
	//更新模板id
	$scope.$watch('entity.goods.category3Id',function(newValue,oldValue){
		itemCatService.findOne(newValue).success(
				function(response){
					$scope.entity.goods.typeTemplateId=response.typeId;
				}
			);
		
		}
	);
	
	//更新模板下拉列表
	$scope.$watch('entity.goods.typeTemplateId',function(newValue,oldValue){
			typeTemplateService.findOne(newValue).success(
				function(response){
					//接收模板表的数据
					$scope.typeTemplate=response;
					//品牌列表转成json
					$scope.typeTemplate.brandIds=JSON.parse($scope.typeTemplate.brandIds);
					if($location.search()["id"]==null){
                        //拓展属性转成json
                        $scope.entity.goodsDesc.customAttributeItems=JSON.parse($scope.typeTemplate.customAttributeItems);
					}
				}
			);
			
			//查询规格列表
			typeTemplateService.findSpecList(newValue).success(
				function(response){
					$scope.specList=response;
				}
			);
		}
	);
	
	//把规格选项从集合加入或移除
	$scope.updateSpecAttribute=function($event,name,value){
		var object=$scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems,"attributeName",name);
		if(object!=null){//有对应属性名
			if($event.target.checked){//被选中了
				object.attributeValue.push(value);
			}else{//被取消选中了
//				object.attributeValue.splise(object.attributeValue.indexOf(value),1);
				object.attributeValue.splice(object.attributeValue.indexOf(value),1);
				//如果attributeValue中没有一个值，就移除整个attributeName和attributeValue
				if(object.attributeValue.length==0){
					$scope.entity.goodsDesc.specificationItems.splice($scope.entity.goodsDesc.specificationItems.indexOf(object),1);
				}
			}
		}else{//没有对应属性名
			$scope.entity.goodsDesc.specificationItems.push({"attributeName":name,"attributeValue":[value]});
		}
	}
	
	//把规格选项从集合加入或移除
//	$scope.updateSpecAttribute=function($event,name,value){
//		var object= $scope.searchObjectByKey(
//		$scope.entity.goodsDesc.specificationItems ,'attributeName', name);
//		if(object!=null){
//		if($event.target.checked ){
//		object.attributeValue.push(value);
//		}else{//取消勾选
//		object.attributeValue.splice( object.attributeValue.indexOf(value ) ,1);//移除选
//		//如果选项都取消了，将此条记录移除
//		if(object.attributeValue.length==0){
//		$scope.entity.goodsDesc.specificationItems.splice(
//		$scope.entity.goodsDesc.specificationItems.indexOf(object),1);
//		}
//		}
//		}else{
//		$scope.entity.goodsDesc.specificationItems.push(
//		{"attributeName":name,"attributeValue":[value]});
//		}
//		}
	
	//构建SKU列表
	$scope.createItemList=function(){
		$scope.entity.itemList=[{spec:{},price:0,num:9999,status:'0',isDefault:'0'}];
		var spec_items=$scope.entity.goodsDesc.specificationItems;
		for(var i=0;i<spec_items.length;i++){
			$scope.entity.itemList=addColumn($scope.entity.itemList,spec_items[i].attributeName,spec_items[i].attributeValue);
		}
	}
	
	//添加项到SKU列表
	addColumn=function(list,columnName,columnValues){
		var newList=[]
		for(var i=0;i<list.length;i++){
			var oldRow=list[i];
			for(var j=0;j<columnValues.length;j++){
				newRow=JSON.parse(JSON.stringify(oldRow));
				newRow.spec[columnName]=columnValues[j];//深克隆
				newList.push(newRow);
			}
		}
		return newList;
	}

	//加载商品分类列表
    $scope.itemCatList=[];//商品分类列表
	$scope.findItemCatList=function () {
        itemCatService.findAll().success(
			function (response) {
				for(var i = 0; i < response.length; i++) {
				  $scope.itemCatList[response[i].id]=response[i].name;
				}
            }
		);
    }

    //根据规格名称和规格选项名称判断是否被勾选
	$scope.checkAttributeValue=function(specName,optionName){
		var items=$scope.entity.goodsDesc.specificationItems;
		var object=$scope.searchObjectByKey(items,"attributeName",specName)
		if(object==null){
			return false;
		}else{
            if(object.attributeValue.indexOf(optionName)>=0){
                return true;
            }else{
                return false;
            }
			return true;
		}
	}

    
});	
