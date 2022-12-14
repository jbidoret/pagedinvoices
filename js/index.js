function getQuarter(m) {
  return Math.ceil(m / 3)
}

function computeQuarter(tr, quarter){
  console.log("computeQuarter");
  var subtr = "<tr><td>trimestre " + quarter + "</td></tr>";
  tr.insertAdjacentHTML("beforebegin", subtr)
}

var tables = document.querySelectorAll('table');
tables.forEach( (table) => { 
  // let quarter = 1;
  let tt = 0;
  const trs = table.querySelectorAll('.tr');
  const total = table.querySelector('#total');
  trs.forEach( (tr) => {
    let subtr = tr.querySelector('.total');
    const subtotal = parseInt(subtr.textContent);
    tt += subtotal;
  });
  total.textContent = tt + " €";
  computeQuarters(table,trs);
})

function computeQuarters(table,trs){
  trsbyquarter = [];
  totalbyquarter = [];
  // regroup rows according quarters
  for(let quarter = 0; quarter<4; quarter ++){
    totalbyquarter[quarter] = 0;
    trsbyquarter[quarter] = [];
    trs.forEach( (tr) => {
      let month = parseInt(tr.dataset.month);
      let trquarter = getQuarter(month) - 1;
      if(trquarter == quarter){
        trsbyquarter[quarter].push(tr);
        totalbyquarter[quarter] += parseInt(tr.querySelector('.total').textContent);
      }
    });
  }
  console.log(trsbyquarter);
  // insert subtotal row by quarter
  trsbyquarter.forEach((quarter,index) => {
    console.log("Processing quarter " + (index +1));
    let insertPosition = "afterend";
    if(quarter.length){
      lasttr = quarter[quarter.length - 1];      
    } else {
      let quarterstrs = table.querySelectorAll(".quarter");
      lasttr = [...quarterstrs].pop();
      if(lasttr===undefined){
        insertPosition = "beforebegin";
        lasttr = table.querySelector('tr');
      }
    }
    var total = totalbyquarter[index];
    var cotisations =  Math.ceil(total * 22.2 / 100) + Math.ceil(total * 2.2 / 100) + Math.ceil(total * 0.2 / 100);
    console.log(cotisations);
    var subtr = "<tr class='quarter'><td colspan='3'><b>Trimestre " + (index + 1) + "</b></td><td class=''>(" + cotisations + " €)</td><td class='total'><b>" + total + " €</b></td></tr>";
    lasttr.insertAdjacentHTML(insertPosition, subtr);
  });
}



// new form

var nnew = document.querySelector('#new');
var h2 = nnew.querySelector('h2');
var create = document.querySelector('#create');

// show new
create.onclick = () => {
  nnew.classList.add('visible');
}

// duplicate form lines
var lines = document.querySelector('.lines');
var linesp = lines.querySelector('p');
for (let index = 1; index < 4; index++) {
  const clone = linesp.cloneNode(true);
  var inputs = clone.querySelectorAll('input');
  inputs.forEach(input => {
    input.value = "";
  });
  for (const child of clone.children) {
    child.id = child.id.replace('-0', '-' + index);
    child.name = child.name.replace('-0', '-' + index);
  }
  lines.appendChild(clone);
}

const all_lines = document.querySelectorAll('.line');
all_lines.forEach( (line) => {
  line.addEventListener("keyup", function(){
    processLines()
  })
})

document.querySelector('#cancel').onclick = (e) => {
  e.preventDefault();
  nnew.classList.remove('visible');  
}

// process form
var form = document.querySelector('#form');
form.onsubmit = (e) => {
  e.preventDefault();  
  submitForm();
}


function submitForm(){
  h2.className = "";
  
  // date
  const d = new Date();
  document.querySelector('#date').value = d.toLocaleDateString('fr-FR', {  year: 'numeric', month: 'long', day: 'numeric' });
  document.querySelector('#datadate').value = d.toLocaleDateString('fr-FR', {  year: 'numeric', month: 'numeric', day: 'numeric' });
  
  // id
  const els = document.querySelectorAll("table:first-of-type tbody tr:not(.quarter)");
  var last_tr = [].slice.call(els).pop();
  var last = last_tr.querySelector("td:first-child").textContent
  var new_id = last != "" ? parseInt( last ) + 1 : 1;
  document.querySelector('#id').value = new_id;

  // total
  processLines();
  
  // process
  var XHR = new XMLHttpRequest();
  var FD = new FormData(form);

  // Définissez ce qui se passe si la soumission s'est opérée avec succès
  XHR.addEventListener("load", function(event) {
    myObj = JSON.parse(this.responseText);
    if(myObj.status == 1) {
      h2.classList.add("ok");
      var inputs = form.querySelectorAll('input');
      inputs.forEach((input)=>{
        input.value = "";
      });
      var textareas = form.querySelectorAll('textarea');
      textareas.forEach((textarea)=>{
        textarea.value = "";
      });
      setTimeout(() => {
        nnew.classList.remove('visible');
        window.location.reload();
      }, 2000);
    }
  });

  // Definissez ce qui se passe en cas d'erreur
  XHR.addEventListener("error", function(event) {
    console.log('Oups! Quelque chose s\'est mal passé.');
  });

  // Configurez la requête
  XHR.open("POST", "create.php");

  // Les données envoyées sont ce que l'utilisateur a mis dans le formulaire
  XHR.send(FD);
  
}

function processLines(){
  const lines = form.querySelectorAll('.line');
  let tt = 0
  lines.forEach( (line) => {
    const desc = line.querySelector('.desc').value;
    if(desc != "") {
      const amount = line.querySelector('.amount').value ?? 0;
      const quantity = line.querySelector('.quantity').value ?? 0;
      let total = line.querySelector('.total').value ?? 0;
      if((isNaN(parseInt(total)) && !(isNaN(parseFloat(amount)) || isNaN(parseInt(quantity)))) ){
        total = parseFloat(amount) * parseInt(quantity);
        console.log(parseFloat(amount), parseInt(quantity));
        line.querySelector('.total').value = total;
      }
      tt += parseInt(total);
    }
  })
  
  document.querySelector('#newtotal').value = parseInt(tt) + " €";
  document.querySelector('#newtotaldisplay').textContent = parseInt(tt) + " €";
}

