// Create a span element with a given style
// TODO: conserve existing style attributes and 
//       ...possibly replace parent element.
function style(type, attr){
    document.execCommand( "copy", false, "" );
    var text = window.getSelection().toString();
    if(text){ 
        document.execCommand('insertHTML', false,`<${type} style="${attr}">${text}</${type}>`);
    }
}

// Same as above but div instead of span
function block(attr){
    document.execCommand( "copy", false, "" );
    var text = window.getSelection().toString();
    if(text){ 
        document.execCommand('insertHTML', false,`<div style="${attr}">${text}</div>`);
    }
}

$=(x)=>document.getElementById(x)
// https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
function chooseColor(){
  var mycolor = $("myColor").value;
  document.execCommand('foreColor', false, mycolor);
}

function justify(){
  var mysize = $("fontSize").value;
    style("span", `text-align: justify;`)
}

function columns(num){
  var mysize = $("fontSize").value; 
    style("div", `column-count: ${num}; display:inline-block; min-height:10px; column-gap: 40px;`)
}

function changeSize(){
  var mysize = $("fontSize").value;
    style("span", `font-size:${mysize}pt;`)
}

function changeFont(){
  var myFont = $("input-font").value;
  style("span", `font-family:${myFont};`)
}

// Not sure... maybe junk code.
function checkDiv(){
  var editorText = $("editor1").innerHTML;
  if(editorText === ''){
    $("editor1").style.border = '5px solid red';
  }
}








function removeBorder(){
  $("editor1").style.border = '1px solid transparent';
}

// let text = "";
// text.charCodeAt(0);