function printloops(iterationNumber){
  for(var i=0;i<iterationNumber;i++){
    var outputstring = '';
    for(var j=i;j<iterationNumber;j++){
      outputstring+='*';
    }
    console.log(outputstring)
  }
}

printloops(5);
printloops(3);