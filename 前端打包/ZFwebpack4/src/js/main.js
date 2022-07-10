import '../css/index.css'
import '../scss/index.scss'
// import $ from 'expose-loader?$!jquery'
// import $ from 'jquery'
// console.log('$',$,window.$);
console.log("ddd");
import logo from '../images/big.png';
var img = new Image();
img.src = logo;
console.log('logo',logo);
document.body.appendChild(img);