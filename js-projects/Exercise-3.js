const me = {
  name: 'Mousam',
  address: 'Madhyapur Thimi, Bhaktapur',
  emails: 'mousamdhakal7.md@gmail.com',
  interests: ['travelling','trekking'],
  education: [
    {
      name:'The Rising English Boarding School',
      enrolledDate: 2002   
    },
    {
      name:'Arniko Higher Secondary School',
      enrolledDate: 2015
    },
    {
      name:'Patan Multiple Campus',
      enrolledDate: 2018
    }
  ]
}

console.log(me);

  function printEducation(institution,index){
    console.log(institution.name,institution.enrolledDate);
  }  
  me.education.forEach(printEducation);



