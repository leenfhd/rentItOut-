function datetime(){

  let dt=new Date();
  //current date
  let date=("0"+dt.getDate()).slice(-2);
  // let date=(int)(dt.getDate());
  
  // let date1=dt.getDate();
  //currnt month 
  let month =("0"+(dt.getMonth()+1)).slice(-2);
  // let month =((dt.getMonth()+1)).slice(-2);
  // let month=(int)(dt.getMonth());
  // let month1 =dt.getMonth();
  //currnt year 
  let year = dt.getFullYear();
  
  //currnt hours 
  let hours = dt.getHours();
  //currnt Minutes 
  let minutes = dt.getMinutes();
  
  //currnt second 
  let second = dt.getSeconds();
  var output=year+"-"+month+"-"+date+" "+hours+":"+minutes+":"+second;
  var outTime=dt.getTime();
  return {output,outTime,year,month,date};
   
  }
  module.exports={datetime}