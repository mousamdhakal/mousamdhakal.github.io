var arr = [{
    id: 1,
    name: 'John',
}, {
    id: 2,
    name: 'Mary',
}, {
    id: 3,
    name: 'Andrew',
}];

function sortBy(array, key) {
    var newArray = array.sort(function(a,b){
      if(a[key]<b[key]) return -1;
      else if (b[key] < a[key]) return 1;
      else return 0;
    });
    return newArray
}

var sorted = sortBy(arr, 'name');


