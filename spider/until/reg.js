export var baseReg=(v)=>{
  var g = /base64.\S+/
  v=v.replace("base64,","");
   return v.test(g)
} 