/* APSAN — Gestão de pedidos de consultas médicas */
(function(){
 "use strict";
 function waitFirebase(){return new Promise(function(resolve,reject){var n=0,t=setInterval(function(){if(window.apsanFirebase){clearInterval(t);resolve(window.apsanFirebase)}else if(++n>120){clearInterval(t);reject(new Error("Firebase indisponível"))}},100)})}
 function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
 var fb,records={};
 function field(label,value){return '<div style="padding:10px 12px;background:#f7faff;border:1px solid #e5edf7;border-radius:10px"><small style="display:block;color:#718096;font-weight:700;margin-bottom:4px">'+label+'</small><strong style="font-size:13px;white-space:pre-wrap;overflow-wrap:anywhere">'+esc(value||"Não indicado")+'</strong></div>'}
 function fileCard(id,kind,file,label){
  if(!file||!file.data)return '<div class="notice warn">'+label+': ficheiro não encontrado.</div>';
  var key=id+"_"+kind;
  return '<div style="border:1px solid #dce7f6;border-radius:13px;padding:14px;margin-top:10px"><b>'+label+'</b><p style="font-size:12px;color:#718096;margin:6px 0 10px">'+esc(file.fileName)+' · '+(Number(file.size||0)/1024/1024).toFixed(2)+' MB</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" data-preview-file="'+key+'">Pré-visualizar</button><button class="btn soft" data-download-file="'+key+'">⬇ Baixar documento</button></div></div>';
 }
 function open(){
  var v=document.getElementById("view");
  v.innerHTML='<div class="panel-head"><div><h3>Agendamentos de Consultas</h3><p>Solicitações enviadas pelos pacientes através do website APSAN.</p></div><button class="btn soft" id="apsAppointmentsRefresh">↻ Actualizar</button></div><div id="apsAppointmentsList">A carregar solicitações…</div>';
  document.getElementById("apsAppointmentsRefresh").onclick=load;
  load();
 }
 async function load(){
  var host=document.getElementById("apsAppointmentsList");if(!host)return;
  host.innerHTML="A carregar solicitações…";
  try{
   var snap=await fb.get(fb.ref(fb.db,"apsanMedicalAppointments"));
   var rows=Object.entries(snap.val()||{}).sort(function(a,b){return (b[1].createdAt||0)-(a[1].createdAt||0)});
   records={};rows.forEach(function(x){records[x[0]]=x[1]});
   if(!rows.length){host.innerHTML='<div class="empty">Ainda não existem pedidos de marcação de consultas.</div>';return}
   host.innerHTML='<div class="notice ok">'+rows.length+' solicitação(ões) de consulta registada(s).</div>'+rows.map(function(x){
    var id=x[0],p=x[1],date=p.createdAt?new Date(p.createdAt).toLocaleString("pt-AO"):"Data não disponível";
    return '<article class="panel" style="margin:12px 0;min-height:0;padding:17px"><div class="panel-head"><div><h3>Paciente: '+esc(p.name||"Sem nome")+'</h3><p>Pedido recebido em '+esc(date)+' · Referência: '+esc(id)+'</p></div><span class="badge">Novo pedido</span></div><h4 style="color:#0a2d62;margin:15px 0 9px">Dados do paciente</h4><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px">'+field("Nome completo",p.name)+field("Idade",p.age)+field("Sexo",p.sex)+field("WhatsApp",p.phone)+field("E-mail",p.email)+field("Província",p.province)+field("Município",p.municipality)+'</div><h4 style="color:#0a2d62;margin:17px 0 9px">Dados da consulta</h4><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px">'+field("Especialidade",p.specialist)+field("Data pretendida",p.date)+field("Período preferencial",p.period)+'</div><div style="margin-top:9px">'+field("Motivo da consulta",p.reason)+'</div><h4 style="color:#0a2d62;margin:17px 0 9px">Documentos enviados</h4>'+fileCard(id,"history",p.history,"Histórico médico")+fileCard(id,"proof",p.proof,"Comprovativo de pagamento")+'</article>';
   }).join("");
   host.querySelectorAll("[data-preview-file]").forEach(function(b){b.onclick=function(){var parts=b.dataset.previewFile.split("_"),p=records[parts[0]],file=p&&p[parts[1]];if(!file||!file.data)return;var w=window.open("about:blank","_blank");if(!w){alert("Permita janelas pop-up para pré-visualizar o documento.");return}w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>'+esc(file.fileName)+'</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#eef2f7;display:grid;place-items:center;min-height:100vh"><iframe title="Pré-visualização" src="'+file.data.replace(/"/g,"%22")+'" style="width:100%;height:100vh;border:0;background:white"></iframe></body></html>');w.document.close()}});
   host.querySelectorAll("[data-download-file]").forEach(function(b){b.onclick=function(){var parts=b.dataset.downloadFile.split("_"),p=records[parts[0]],file=p&&p[parts[1]];if(!file||!file.data)return;var a=document.createElement("a");a.href=file.data;a.download=file.fileName||"documento";document.body.appendChild(a);a.click();a.remove()}});
  }catch(e){host.innerHTML='<div class="notice error">Não foi possível carregar os agendamentos: '+esc(e.message)+'</div>'}
 }
 document.addEventListener("click",function(e){var b=e.target.closest('.navbtn[data-tab="appointments"]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();document.querySelectorAll(".navbtn").forEach(function(x){x.classList.toggle("active",x===b)});open()},true);
 waitFirebase().then(function(x){fb=x}).catch(function(e){console.error("[APSAN appointments]",e)});
})();