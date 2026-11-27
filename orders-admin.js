/* APSAN order management */
(function(){
function wait(){return new Promise(function(ok,no){var n=0,t=setInterval(function(){if(window.apsanFirebase){clearInterval(t);ok(window.apsanFirebase)}else if(++n>100){clearInterval(t);no(Error("Firebase indisponível"))}},100)})}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
var fb;
async function open(){var v=document.getElementById("view");v.innerHTML='<div class="panel-head"><div><h3>Encomendas do site oficial</h3><p>Pedidos e comprovativos enviados pelos clientes.</p></div><button class="btn soft" id="apsOrdersRefresh">↻ Actualizar</button></div><div id="apsOrdersList">A carregar encomendas…</div>';document.getElementById("apsOrdersRefresh").onclick=load;await load()}
async function load(){
 var h=document.getElementById("apsOrdersList");if(!h)return;
 try{
  var snap=await fb.get(fb.ref(fb.db,"apsanOrders"));
  var rows=Object.entries(snap.val()||{}).sort(function(a,b){return (b[1].createdAt||0)-(a[1].createdAt||0)});
  if(!rows.length){h.innerHTML='<div class="empty">Ainda não existem encomendas.</div>';return}
  h.innerHTML=rows.map(function(x){var id=x[0],o=x[1];return '<article class="panel" style="margin:12px 0"><div class="panel-head"><div><h3>'+esc(o.productName||"Produto")+' · '+esc(o.quantity||1)+' unidade(s)</h3><p>Referência: '+esc(id)+' · '+new Date(o.createdAt||Date.now()).toLocaleString("pt-AO")+'</p></div><span class="badge">'+esc(o.status||"pending_payment")+'</span></div><p><b>Cliente:</b> '+esc(o.buyerName)+' · '+esc(o.buyerPhone)+'</p><p><b>Entrega:</b> '+esc(o.deliveryCountry)+' · '+esc(o.deliveryProvince)+', '+esc(o.deliveryMunicipality)+' · '+esc(o.deliveryAddress)+'</p><p><b>Total:</b> '+esc(o.paymentAmount)+' '+esc(o.currency)+' · <b>Pagamento:</b> '+esc(o.paymentMethod)+'</p><div id="apsProof_'+esc(id)+'">A carregar comprovativo…</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn primary" data-apsorder="'+esc(id)+'" data-state="confirmed">Confirmar pagamento</button><button class="btn soft" data-apsorder="'+esc(id)+'" data-state="rejected">Rejeitar comprovativo</button><button class="btn soft" data-apsorder="'+esc(id)+'" data-state="processing">Marcar em preparação</button><button class="btn soft" data-apsorder="'+esc(id)+'" data-state="completed">Concluir encomenda</button></div></article>'}).join("");
  for(var x of rows){
   var id=x[0],ps=await fb.get(fb.ref(fb.db,"apsanPaymentProofs/"+id)),p=ps.val(),box=document.getElementById("apsProof_"+id);
   if(!box)continue;
   if(!p){box.innerHTML="<p>Comprovativo não encontrado.</p>";continue}
   box.innerHTML='<p><b>Comprovativo:</b> '+esc(p.fileName||"ficheiro")+'</p>'+(String(p.mimeType||"").indexOf("image/")===0?'<a href="'+p.data+'" target="_blank"><img src="'+p.data+'" style="max-width:260px;max-height:190px;object-fit:contain;border-radius:9px"></a>':'<a href="'+p.data+'" download="'+esc(p.fileName||"comprovativo.pdf")+'">Abrir / descarregar comprovativo</a>');
  }
  h.querySelectorAll("[data-apsorder]").forEach(function(b){b.onclick=async function(){var id=b.dataset.apsorder,state=b.dataset.state,label={confirmed:"Pagamento confirmado",rejected:"Comprovativo rejeitado",processing:"Encomenda em preparação",completed:"Encomenda concluída"}[state];if(!confirm(label+"?"))return;try{var patch={status:state,adminUpdatedAt:Date.now(),adminNote:label};if(state==="confirmed")patch.paymentStatus="confirmed";if(state==="rejected")patch.paymentStatus="rejected";await fb.update(fb.ref(fb.db,"apsanOrders/"+id),patch);await load()}catch(e){alert("Não foi possível actualizar: "+e.message)}}});
 }catch(e){h.textContent="Erro ao carregar encomendas: "+e.message}
}
document.addEventListener("click",function(e){var b=e.target.closest(".navbtn[data-tab='orders']");if(!b)return;e.preventDefault();e.stopImmediatePropagation();document.querySelectorAll(".navbtn").forEach(function(x){x.classList.toggle("active",x===b)});var home=document.getElementById("homeScreen"),workspace=document.getElementById("workspace"),labelNode=document.getElementById("workspaceLabel");if(home)home.hidden=true;if(workspace)workspace.hidden=false;if(labelNode)labelNode.textContent="Encomendas / Pedidos";var menu=document.getElementById("adminSideMenu"),backdrop=document.getElementById("adminMenuBackdrop"),toggle=document.getElementById("adminMenuToggle");if(menu)menu.classList.remove("open");if(backdrop)backdrop.classList.remove("open");if(toggle)toggle.setAttribute("aria-expanded","false");open()},true);
wait().then(function(x){fb=x}).catch(console.error);
})();