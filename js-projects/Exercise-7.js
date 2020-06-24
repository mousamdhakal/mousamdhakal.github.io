
//Incomplete


// From this
var input = {
  '1': {
    id: 1,
    name: 'John',
    children: [
      { id: 2, name: 'Sally' },
      { id: 3, name: 'Mark', children: [{ id: 4, name: 'Harry' }] }
    ]
  },
  '5': {
    id: 5,
    name: 'Mike',
    children: [{ id: 6, name: 'Peter' }]
  }
};

console.log(Object.keys(input));
var newObj= {};
for (var i = 0; i < Object.keys(input).length; i++) {
  key = Object.keys(input)[i];
  newObj[i+1]={
    id: input[key].id,
    name: input[key].name
  }
  if(Object.keys(input[key]).length>2){
    var childrens = Object.keys(input[key].children);
    console.log(childrens.length);
    newObj.children=[];
    var idcount = 1;
    while(childrens>0){
      newObj[i+1]['children'].push(input[key].id+idcount);
      idcount++;
      childrens--
    }
    
  }
}
console.log(newObj);

// To this
var output = {
  '1': { id: 1, name: 'John', children: [2, 3] },
  '2': { id: 2, name: 'Sally' },
  '3': { id: 3, name: 'Mark', children: [4] },
  '4': { id: 4, name: 'Harry' },
  '5': { id: 5, name: 'Mike', children: [6] },
  '6': { id: 6, name: 'Peter' }
};