export let  Common  = {
  toPercent(str){
    return (Math.round(str * 10000)/100).toFixed(2) + '%';
  }
}
