

var names = ["Andre"];

function addName(name){
  var nameExist = false;
  for(n in names){
    var theName = names[n];
    if (theName === name){
      nameExist = true;
      break;
    }
  }

  if (!nameExist){
      names.push(name)
  }

}

addName("Andre");
addName("Vaz");
addName("Andre");

console.log(names.length);
