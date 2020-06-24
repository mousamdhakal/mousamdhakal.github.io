var numbers = [1, 2, 3, 4];

function transform(collection, tranFunc) {
   var newArray = [];
   collection.forEach(function(number){
     newArray.push(tranFunc(number));
   })
   return newArray;
  }

var output = transform(numbers, function(num) {
    return num * 3;
});
// output should be [2, 4, 6, 8]
console.log(output);
