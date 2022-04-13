import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

 
 

export default function App() {
 const[dat,setDat]=useState(false)



  const data1 = [
    ["Year", "Sales", "Expenses","mine"],
    ["2004", 10, 40,30],
    ["2005", 11, 41,21],
    ["2006", 34, 23,21],
    ["2007", 33, 13,24],
    ["2007", 33, 13,24],
    ["2007", 33, 13,24],
    
  
  ];

  const data2 = [
    ["Year", "Sales", "Expenses","mine"],
    ["2004", 0, 1,2],
    ["2005", 0, 1,2],
    ["2006", 0, 1,2],
    ["2007", 0, 1,2],
    ["2007", 0, 1,2],
    ["2007", 0, 1,2],
    
  
  ];



  
useEffect(()=>{
  setTimeout(() => {
    setDat(true)
  }, 5000);

},[])
  

  const options = {
    title: "",
    curveType: "function",
    legend: { position: "top" },
    backgroundColor:"",
    animation:{
      duration:2000,
      easing:"out"
    },
    vAxis:{minValue:0,maxValue:10}
  };






  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={dat?data1:data2}
      options={options}
    />
  );
}
