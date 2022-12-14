class agHandler extends Paged.Handler {
  constructor(chunker, polisher, caller) {
      super(chunker, polisher, caller);
  }

  beforeParsed(content) {

      let need_to_save = false;
      
      var date = content.querySelector('#date');
      if(date.childNodes.length === 0){
        need_to_save = true;
        var d = new Date();
        var options = {year: "numeric", month: "long", day: "numeric"};
        date.innerHTML = d.toLocaleDateString("fr-FR", options);
      }

      var title = document.querySelector('title');
      var id = parseInt(content.querySelector('#id').textContent);
      var year = new Date().getFullYear();
      title.textContent = `facture-${year}-${id}`;


      var trs = content.querySelectorAll("tbody tr"),
        total = content.querySelector('#total'),
        tt = 0,
        table = content.querySelector('#table'),
        main = content.querySelector('main');    
        trs.forEach((tr) => {
          let q_el = tr.querySelector('.q');
          let q = parseInt(q_el.textContent);
          let u_el = tr.querySelector('.u');
          let u = parseInt(u_el.textContent);
          let t_el = tr.querySelector('.t');
          let t = parseInt(t_el.textContent);
          if(isNaN(t) && (!isNaN(q) && !isNaN(u))){
            t = q * u;
            tr.querySelector('.t').innerHTML = t + "&#8239;€";
            need_to_save = true;
          }
          tt += t; 
          eurotypo([q_el, u_el, t_el]);
        })

        if(parseInt(total.textContent) != tt){
          total.innerHTML = tt + "&#8239;€";
          need_to_save = true;
        }
        
        eurotypo(total);
        if( need_to_save == true ){
          // main.classList.add('needupdate');
          document.onclick = () => {
            copyText(main.outerHTML);
          }          
        }
      
  }
  afterPageLayout(pageElement, page, breakToken){
      
      const notes = pageElement.querySelectorAll("a.ndt, a.fn");  
      notes.forEach((n) => {
          const note = pageElement.querySelector(n.getAttribute("href"));
          n.dataset.counter = note.dataset.counter;
      });
  }
  afterRendered(pages){
    window.print();
  }
}
Paged.registerHandlers(agHandler);


function eurotypo(element){
  if(Array.isArray(element)){
    element.forEach((el)=>{
      eurotypo(el);
    })
  } else {
    var html = element.innerHTML.replace(" €", "&#8239;€");
    element.innerHTML = html;
  }
}

function copyText(content) {
  var textBox = document.createElement("textarea");
  const searchRegExp = /data-ref="(.*?)"/g;
  const replaceWith = '';
  content = content.replace(searchRegExp, replaceWith);
  textBox.textContent = html_beautify(content);
  document.body.appendChild(textBox);
  textBox.select();
  document.execCommand('Copy');    
  document.body.removeChild(textBox);
}