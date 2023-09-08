/////////////////////////////////////////////////////////
// Function to create a JSON structure from a DOM node
/////////////////////////////////////////////////////////
const createJsonStructureFromNode = (node) => {
  if (node.nodeType === Node.TEXT_NODE) { 
    return node.textContent;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const jsonNode = {};
    // Mapping HTML tags to JSON attributes
    switch (node.tagName){
        case "BR": jsonNode.text = "\n"; break;
        case "B": jsonNode.bold = true; break;
        case "U": jsonNode.underline = true; break;
        case "I": jsonNode.italic = true; break;
        case "STRIKE": jsonNode.strike = true; break;
        case "TH": // take advantage of fallthrough...
        case "TABLE": 
        case "UL": 
        case "OL": 
        case "TR": 
            jsonNode.tag = node.tagName.toLowerCase(); break;
        default: break;
    }


    if (node.attributes.length > 0) {
      for (let i = 0; i < node.attributes.length; i++) {
        // Mapping HTML attributes to JSON attributes
        var val = node.attributes[i].value
        switch (node.attributes[i].name){
            case "color": jsonNode.color = val; break;
            case "size": jsonNode.fontSize = val; break;
            case "font-family": 
                jsonNode.font = val; break;
            case "style": 
                if(node.style.fontFamily){
                    jsonNode.font = node.style.fontFamily; }
                if(node.style.fontSize){
                    jsonNode.fontSize = node.style.fontSize.replace(/pt/g,''); }
                if(node.style.textAlign){
                    jsonNode.alignment = node.style.textAlign; }
                if(node.style.color){
                    console.log(node, node.style.color)
                    jsonNode.color = node.style.color; }                     
                break;
        }
      }
    }

    if (node.childNodes.length > 0) {
      jsonNode.children = [];
      for (let i = 0; i < node.childNodes.length; i++) {
        jsonNode.children.push(createJsonStructureFromNode(node.childNodes[i]));
      }
    }

    return jsonNode;
  }
};

/////////////////////////////////////////////////////////
// Utility functions
/////////////////////////////////////////////////////////
const property = (o, key) => o.hasOwnProperty(key);
const array = (a) => Array.isArray(a);
const keys = (o) => Object.keys(o).length;

const copyProperty = (obj, src, dest) => {
  if (obj.hasOwnProperty(src)) {
    obj[dest] = obj[src];
    delete obj[src];
  }
};






/////////////////////////////////////////////////////////
// Syntactic Sugar: aid readability and modularity
const isTextNode = (node) => node.nodeType === Node.TEXT_NODE;
const isSoleProperty = (node) => keys(node) === 1 && !array(node.text);
const nodeHasText = (node) => property(node, "text");
const isSoleChildArray = (children) => array(children) && children.length === 1;

/////////////////////////////////////////////////////////
// Transform the JSON structure into PDFmake consumable form.
/////////////////////////////////////////////////////////
const transformJson = (node) => {
  if(!node.children){ return; }

  node.children.forEach((child, index) => {
    transformJson(child);

    if (isTextNode(child) && isSoleProperty(child)) {
      node.children[index] = child.text;
    }
  });

  const firstChild = node.children[0];

  if (!nodeHasText(node) && isSoleChildArray(node.children) && node.children.length === 1) {
    processSoleChild(node, firstChild);
  }

  if (node.tag == "table" && nodeHasText(node)) {
    processTable(node);
  }

  if (node.children) {
    processChildren(node, firstChild);
  }
};


// The following functions have been extracted to make the 
/////////////////////////////////////////////////////////
// .
/////////////////////////////////////////////////////////
const processSoleChild = (node, child) => {
  if (typeof child === "object") {
    const tag = child.tag;
    Object.assign(node, child);
    if (tag) {
      node.tag = tag;
    }
  } else if (typeof child === "string") {
    node.text = child;
  } else {
    Object.assign(node, child);
  }
  delete node.children;
};

/////////////////////////////////////////////////////////
// .
/////////////////////////////////////////////////////////
const processTable = (node) => {
  node.layout = 'noBorders'; // invisible table.
  node.table = {
    body: [],
    widths: ['*', '*'],
  };

  for (let i = 0; i < node.text.length; i++) {
    node.table.body.push(node.text[i].tr);
  }

  delete node.tag;
  delete node.text;
};

/////////////////////////////////////////////////////////
// .
/////////////////////////////////////////////////////////
const processChildren = (node, firstChild) => {
  if (property(node, "tag") || property(firstChild, "tag")) {
    copyProperty(node, "children", node.tag);
    delete node.tag;
  } else if (!nodeHasText(node)) {
    if (!firstChild.ol || !firstChild.ul || !firstChild.tr || !firstChild.table || !firstChild.body) {
      copyProperty(node, "children", "text");
    } else {
      delete node.children;
    }
  }
};
