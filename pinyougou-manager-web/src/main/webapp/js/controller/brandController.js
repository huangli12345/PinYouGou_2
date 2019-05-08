app.controller('brandController',function($scope,$http,$controller,brandService){
	
//	$controller('baseController',{$scope:$scope});
	$controller('baseController',{$scope:$scope});//继承
    	
    	//查询品牌列表
		$scope.findAll=function(){
			brandService.findAll().success(
				function(response){
					$scope.list=response;
				}		
			);				
		}
		
		//分页 
		$scope.findPage=function(page,rows){
			brandService.findPage(page,rows).success(
				function(response){
					$scope.list=response.rows;//显示当前页数据 	
					$scope.paginationConf.totalItems=response.total;//更新总记录数 
				}		
			);				
		}
		
		//保存
		$scope.save=function(){
			brandService.save().success(
				function(response){
					if(response.success){
						$scope.reloadList();//重新加载
					}else{
						alert(response.message);
					}
				}		
			);
		}
		
		
		//通过id查询实体
		$scope.findOne=function(id){
			brandService.findOne(id).success(
				function(response){
					$scope.entity= response;
				}
			);
		}
		
		
		//增加和修改
		$scope.save=function(){
			var object=null;
			if($scope.entity.id!=null){//如果有 ID
				object=brandService.update($scope.entity);
			}else{
				object=brandService.add($scope.entity);
			}
			object.success(
				function(response){
					if(response.success){
						//重新查询
						$scope.reloadList();//重新加载
					}else{
						alert(response.message);
					}
				}
			);
		}
		
		//批量删除
		$scope.dele=function(){
			//获取选中的复选框
			brandService.del($scope.selectIds).success(
				function(response){
					if(response.success){
						$scope.reloadList();//刷新列表
					}
				}
			);
		}
		
		
		//根据条件查询
		$scope.searchEntity={};//定义搜索对象
		$scope.search=function(page,rows){
			brandService.search(page,rows,$scope.searchEntity).success(
				function(response){
					$scope.paginationConf.totalItems=response.total;
					$scope.list=response.rows;
				}		
			);
		}
    	
    	
    });