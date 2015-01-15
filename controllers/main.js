var fs = require('fs');
var exec = require('child_process').exec;

angular.module('repl',[])
      .controller('mainCtrl', ['$scope',function mainCtrl($scope){
        //boolean, do we show the repl view?
        $scope.repling = false;
        //objects for supported languages
        $scope.langs = [
        {name:'Javscript', suffix:'.js',command:'node',url:'../img/javascript.png'},
        {name:'R',suffix:'.R', command:'Rscript',url:'../img/r.png'},
        {name:'Python', suffix:'.py', command:'python',url:'../img/python.png'},
        {name:'Ruby', suffix:'.rb', command:'ruby',url:'../img/ruby.png'}
        ];

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
          var fileName = 'scripts/myScript'+this.lang.suffix;
          var command = this.lang.command+' '+fileName;
          var input = $scope.mirror.getDoc().getValue();

          fs.writeFile(fileName,input,function(){
            var child = exec(command,function(err,res){
              $scope.output = 'RESPONSE: '+res;
              $scope.$apply();
            });
          });
        };

        $scope.gist = function(){
          var command = 'gist -c scripts/myScript'+this.lang.suffix;
          var child = exec(command, function(err,res){
            $scope.output = 'RESPONSE: '+res +" (Don't worry about copying the URL, it's on your clipboard.)";
            $scope.$apply();
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