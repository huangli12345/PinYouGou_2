// app.controller('contentController',function($scope,contentService){
//
// 	$scope.contentList=[];//广告列表
//
// 	$scope.findByCategoryId=function(categoryId){
// 		contentService.findByCategoryId(categoryId).success(
// 			function(response){
// 				$scope.contentList[categoryId]=response;
// 			}
// 		);
// 	}
//
// });

app.controller("contentController",function ($scope,contentService) {

	//广告集合
	$scope.contentList=[];
	$scope.findByCategoryId=function (categoryId) {
		contentService.findByCategoryId(categoryId).success(
			function (response) {
                $scope.contentList[categoryId]=response;
            }
		);
    }
});