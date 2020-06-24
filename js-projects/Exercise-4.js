var fruits = [
  {id: 1, name: 'Banana', color: 'Yellow'},
  {id: 2, name: 'Apple', color: 'Red'}
]

function searchByName(arrayName,name){
  for (var i = 0; i < arrayName.length; i++) {
    if(arrayName[i].name == name )
      console.log(arrayName[i]);
  }
}
searchByName(fruits,'Apple');
searchByName(fruits,'Banana');

function searchByKey(arrayName,key,name){
  for (let i = 0; i < arrayName.length; i++){
    if(arrayName[i][key] == name){
      console.log(arrayName[i]);
    }
    
  }
}

searchByKey(fruits,'name','Banana');
searchByKey(fruits,'color','Red');

