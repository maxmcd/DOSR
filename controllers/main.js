angular.module('repl',[])
      .controller('mainCtrl', ['$scope',function mainCtrl($scope){
        //boolean, do we show the repl view?
        $scope.repling = false;
        //objects for supported languages
        $scope.langs = [{name:'Javscript', suffix:'.js',command:'node'},{name:'R',suffix:'.R', command:'Rscript'}, {name:'Python', suffix:'.py', command:'python'}];

        //function to select language
        $scope.chooseLang = function(arg){
          $scope.lang = this.langs[arg];
          $scope.mirror = CodeMirror(document.getElementById('input'), {
            lineNumbers:true,
            mode: $scope.lang.name.toLowerCase()
          });
          $scope.repling = true;
        };

        $scope.back = function(){
          $scope.output = '';
          $scope.repling = false;
          //remove the mirror from the DOM instead
          $scope.mirror.getWrapperElement().remove()
        };

        $scope.submit = function(){
          var fs = require('fs');
          var exec = require('child_process').exec;

          var fileName = 'scripts/myScript'+this.lang.suffix;
          var command = this.lang.command+' '+fileName;
          var input = $scope.mirror.getDoc().getValue();

          fs.writeFile(fileName,input,function(){
            var child = exec(command,function(err,res){
              $scope.output = 'RESPONSE: '+res+'\n'+'ERROR: '+err;
              $scope.$apply();
            });
          });
        };
      }])
      .directive('home',function(){
        return {
          templateUrl: 'home.html'
        };
      })
      .directive('repl',function(){
        return {
          templateUrl: 'repl.html'
        }
      });