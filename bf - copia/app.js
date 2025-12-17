import { db, auth, googleProvider, collection, doc, setDoc, getDoc, query, where, getDocs, serverTimestamp, deleteDoc, updateDoc, increment, signInWithPopup, signOut, onAuthStateChanged } from './firebase-config.js';

    const gSI = document.getElementById('gsi'),sO = document.getElementById('so'),   
        A = document.getElementById('ap'),MC_DIV = document.getElementById('mc'),CBC = document.getElementById("cb"),PB = document.getElementById('ppb'),CS = document.getElementById('c'),LC = document.getElementById('lasc'),LS = document.getElementById('l'),CI = document.getElementById('ci'),TI = document.getElementById('ti'),CWL = document.getElementById('cwl'),TS = document.getElementById('t'),SEL_SER_DIV = document.getElementById('selector-series'),USAL = document.getElementById('usal'),REB = document.getElementById('reb'),
        T10L = document.getElementById('t10l'),ESD = "estadisticasSeries", CVD = "conteoVistasGlobal", ACCI = document.getElementById('acc-info'),
        listView = document.getElementById('list-view'), playerView = document.getElementById('player-view');

    const DATA_SOURCES = [
        { name: "Series en español original", path: "/series.json" },
        { name: "Series con doblaje", path: "/doblaje.json" }
    ];
        
    let TII,IP = !1,CSD_L = [],CLI = 0,CCL = 0,CPT = 0,S,SD_J = DATA_SOURCES[0].path,TS_C = [];
    let isUCWRunning = !1, isCSRSRunning = !1;
    let isManuallySwitchingChapter = false;
    let lastFocusedElement = null;
    let escuchaContada = false;
    const UMBRAL_ESCUCHA = 60; 

    const GNB=snc=>snc.split(', temporada')[0].trim();
    const slugify=text=>text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,'-').replace(/[^\w-]+/g,'').replace(/--+/g,'-');
    const MCGLTSL=(nbs,cgi,tasl)=>{const semsb=tasl.filter(s=>GNB(s.nombre)===nbs);const semsbo=OTS(semsb);let cgc=0;for(const stp of semsbo){const nce=stp.capitulos.length;if(cgi<cgc+nce){return{stp,ccl:cgi-cgc}}cgc+=nce}return semsbo.length>0?{stp:semsbo[0],ccl:0}:{stp:null,ccl:0}};
    const MTSLCG=(ste,ccl,tasl)=>{const nbs=GNB(ste.nombre);const semsb=tasl.filter(s=>GNB(s.nombre)===nbs);const semsbo=OTS(semsb);let cgi=0;for(const stp of semsbo){if(stp.nombre===ste.nombre){cgi+=ccl;return cgi}if(stp.capitulos)cgi+=stp.capitulos.length}return ccl};

    const sWGi=async()=>{try{await signInWithPopup(auth,googleProvider)}catch(e){}};
    const sOG=async()=>{try{await signOut(auth)}catch(e){}};
    onAuthStateChanged(auth,u=>{const aST=document.querySelector('#as p');if(u){gSI.classList.add('h');sO.classList.remove('h');if(aST)aST.textContent=`¡Hola de nuevo! Tu progreso se guardará automáticamente.`}else{gSI.classList.remove('h');sO.classList.add('h');if(aST)aST.textContent=`¡Bienvenido/a! Puedes explorar y escuchar series sin iniciar sesión. Si deseas guardar tu progreso y continuar escuchando más tarde donde lo dejaste, por favor:`}UCW()});
    gSI.addEventListener('click',sWGi);sO.addEventListener('click',sOG);
    
    const FT=t=>{const m=Math.floor(t/60),s=Math.floor(t%60);return`${PZ(m)}:${PZ(s)}`},PZ=n=>(n<10?'0':'')+n;

    const GP=async()=>{if(!S||!auth.currentUser)return;const t=A.currentTime;const nbs=GNB(S.nombre);const cgi=MTSLCG(S,CCL,TS_C);try{const u=auth.currentUser;const p={serieNombreBase:nbs,capituloGlobalIndex:cgi,tiempo:t,idiomaIndex:CLI,serieTemporadaActualNombre:S.nombre,userId:u.uid,ultimaActualizacion:serverTimestamp()};await setDoc(doc(db,"progresoSeries",`${u.uid}_${nbs}`),p);UCW()}catch(e){}};
    const RP=async nbs=>{if(!auth.currentUser||!TS_C||TS_C.length===0)return !1;try{const u=auth.currentUser;const dS=await getDoc(doc(db,"progresoSeries",`${u.uid}_${nbs}`));if(dS.exists()){const d=dS.data();const{stp,ccl}=MCGLTSL(nbs,d.capituloGlobalIndex,TS_C);if(stp){S=stp;CCL=ccl;A.currentTime=d.tiempo;CLI=d.idiomaIndex||0;if(document.getElementById('tasc').classList.contains('h')===!1&&TS.options.length>0){TS.value=S.nombre}CS.value=CCL;LS.value=CLI;UC();return!0}}}catch(e){}return!1};
    
    const showListView=()=>{S&&GP();playerView.classList.add('view-hidden');listView.classList.remove('view-hidden');listView.removeAttribute('inert');A.pause();A.src='';clearInterval(TII);IP=!1;PB.textContent='Reproducir';CPT=A.currentTime;CI.textContent='';TI.textContent='';if(ACCI)ACCI.textContent='';isManuallySwitchingChapter=false;window.scrollTo(0,0);if(lastFocusedElement){lastFocusedElement.focus()}};
    const showPlayerView=(s_i,clickedElement=null)=>{if(clickedElement){lastFocusedElement=clickedElement}const nbs=GNB(s_i.nombre);IP=!1;CLI=0;CCL=0;CPT=0;CSD_L=[];const lYC=async()=>{if(TS_C.length===0){TS_C=await FD()}const pL=await RP(nbs);if(pL){CPT=A.currentTime}else{S=s_i;CCL=0;CLI=0;if(S&&S.capitulos&&S.capitulos[CCL]){CPT=S.capitulos[CCL].inicio/1e3}else{CPT=0}if(document.getElementById('tasc').classList.contains('h')===!1&&TS.options.length>0&&Array.from(TS.options).some(opt=>opt.value===S.nombre)){TS.value=S.nombre}}LI(S);LL(S);LCF(S);A.play().catch(e=>{});IP=!0;PB.textContent='Pausar';PB.setAttribute('aria-label','Pausar (Alt + K)');UC()};lYC();listView.classList.add('view-hidden');listView.setAttribute('inert','');playerView.classList.remove('view-hidden');const url=new URL(window.location);url.searchParams.set('serie',slugify(GNB(s_i.nombre)));history.pushState({view:'player',serie:slugify(GNB(s_i.nombre))},'',url);CBC.focus();window.scrollTo(0,0);};
    
    const registrarVistaUnica=async()=>{if(!S||!auth.currentUser)return;const sNB=GNB(S.nombre);const u=auth.currentUser;const hoy=new Date().toISOString().split('T')[0];const vistaId=`${u.uid}_${sNB}_${hoy}`;try{const vistaRef=doc(db,"vistasDiarias",vistaId);const docSnap=await getDoc(vistaRef);if(!docSnap.exists()){await setDoc(vistaRef,{timestamp:serverTimestamp()});const conteoRef=doc(db,ESD,CVD);const cAI=`vistasPorSerie.${sNB.replace(/\./g,'_')}`;const conteoSnap=await getDoc(conteoRef);if(!conteoSnap.exists()){await setDoc(conteoRef,{vistasPorSerie:{[sNB.replace(/\./g,'_')]:1}})}else{await updateDoc(conteoRef,{[cAI]:increment(1)})}}}catch(e){}};
    
    const LCF=(s_d, srp = !1)=>{
        escuchaContada=false;
        CS.innerHTML='';
        CSD_L=s_d.capitulos;
        CSD_L.forEach((t,e)=>{const n=document.createElement('option');n.value=e,n.textContent=t.titulo,CS.appendChild(n)});
        CS.value=CCL;
        UC();
        A.src=s_d.enlaces[CLI].enlace;
        const CPTactual=CPT;
        const stcapin=()=>{A.currentTime=CPTactual;if(srp){A.play().catch(e=>{})}};
        A.onloadedmetadata=null; 
        A.addEventListener('canplay', stcapin, { once: true });
        A.load();
        clearInterval(TII);
        UT();
        TII=setInterval(UT,1e3);
    };

    const FD=async()=>{try{const t=await fetch(SD_J);if(!t.ok)throw new Error(`E!S:${t.status}`);const e=await t.json();return e.series||[]}catch(t){return[]}};
    const OTS=a=>([...a].sort((x,y)=>{const gtn=nm=>{const p=nm.split(', temporada ');if(p.length>1){const n=parseInt(p[1]);return isNaN(n)?Infinity:n}return 1};const nX=gtn(x.nombre),nY=gtn(y.nombre);return nX!==nY?nX-nY:x.nombre.localeCompare(y.nombre)})),
    RCAS=s_a=>{const t=document.getElementById('coc');t.innerHTML="";if(!s_a||s_a.length===0){t.innerHTML="<p>No hay series.</p>";return}
    const sAg={};s_a.forEach(sE=>{const nB=GNB(sE.nombre);sAg[nB]||(sAg[nB]=[]);sAg[nB].push(sE)});
    const pO_s=[...new Set(s_a.map(sE=>sE.pais_origen))].sort();
    pO_s.forEach(pO=>{const h2=document.createElement('h2');h2.textContent=pO;t.appendChild(h2);const ul=document.createElement('ul');ul.classList.add('sl');
    Object.keys(sAg).sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'})).forEach(nB=>{const sD=sAg[nB].filter(sE=>sE.pais_origen===pO);
    if(sD.length>0){const li=document.createElement('li'),btn=document.createElement('button');btn.textContent=nB;
    btn.addEventListener('click',(e)=>{const sOrds=OTS(sD);const pT=sOrds[0];showPlayerView(pT,e.currentTarget);sOrds.length>1?LT(sOrds,pT.nombre):document.getElementById('tasc').classList.add('h')});
    btn.setAttribute('tabindex','0');btn.classList.add('b');li.appendChild(btn);ul.appendChild(li)}});t.appendChild(ul)});UCW()},
    LUSA=sa=>{if(!USAL||!sa||sa.length===0){if(USAL)USAL.innerHTML="<li>No hay series nuevas.</li>";return}
    USAL.innerHTML='';const u20=sa.slice(-20).reverse();
    u20.forEach(s_i=>{const li=document.createElement('li');const btn=document.createElement('button');btn.textContent=s_i.nombre;btn.classList.add('b');
    btn.addEventListener('click',(e)=>{const nb=GNB(s_i.nombre);const sg=TS_C.filter(i=>GNB(i.nombre)===nb);showPlayerView(s_i,e.currentTarget);if(sg.length>1){const so=OTS(sg);LT(so,s_i.nombre)}else{document.getElementById('tasc').classList.add('h')}});
    li.appendChild(btn);USAL.appendChild(li)})},
    CT10SMV=async()=>{if(!T10L)return;T10L.innerHTML='<li>Cargando...</li>';try{const cDR=doc(db,ESD,CVD);const dSnp=await getDoc(cDR);if(!dSnp.exists()||!dSnp.data().vistasPorSerie){T10L.innerHTML="<li>Aún no hay datos.</li>";return}
    const vPSM=dSnp.data().vistasPorSerie;const sCA=Object.entries(vPSM).map(([nC,v])=>({n:nC.replace(/_/g,'.'),v})).sort((a,b)=>b.v-a.v).slice(0,10);
    if(sCA.length===0){T10L.innerHTML="<li>No hay series en el top.</li>";return}
    T10L.innerHTML='';if(!TS_C||TS_C.length===0){T10L.innerHTML="<li>Error: datos de series no disponibles para el Top 10.</li>";return}
    sCA.forEach(i=>{const sDO_arr=TS_C.filter(s=>GNB(s.nombre)===i.n);
    if(sDO_arr.length>0){const sDO=sDO_arr[0];const li=document.createElement('li'),btn=document.createElement('button');btn.textContent=`${i.n} (${i.v} ${i.v===1?'escucha':'escuchas'})`;btn.classList.add('b');
    btn.addEventListener('click',(e)=>{const sDMNB=TS_C.filter(s=>GNB(s.nombre)===i.n),sOPT=OTS(sDMNB);
    if(sOPT.length>0){showPlayerView(sOPT[0],e.currentTarget);if(sOPT.length>1){LT(sOPT,sOPT[0].nombre)}else{document.getElementById('tasc').classList.add('h')}}});li.appendChild(btn);T10L.appendChild(li)}});
    if(T10L.children.length===0&&sCA.length>0)T10L.innerHTML="<li>No se pudieron mostrar (datos no encontrados).</li>";
    if(T10L.children.length===0&&sCA.length===0)T10L.innerHTML="<li>No hay series en el top.</li>"}catch(e){T10L.innerHTML="<li>Error al cargar.</li>"}},
    LT=(s_a,stn)=>{TS.innerHTML='';document.getElementById('tasc').classList.remove('h');s_a.forEach(sE=>{const tN=sE.nombre.split(', temporada ')[1];const opt=document.createElement('option');opt.value=sE.nombre;opt.textContent=tN?`Temporada ${tN}`:sE.nombre;TS.appendChild(opt)});if(stn)TS.value=stn;TS.onchange=e=>{const sS=s_a.find(sE=>sE.nombre===e.target.value);if(sS){S=sS;CCL=0;CPT=0;A.currentTime=0;CLI=parseInt(LS.value)||0;LI(S);LL(S);LCF(S);A.play().catch(err=>{});IP=!0;PB.textContent='Pausar';PB.setAttribute('aria-label','Pausar (Alt + K)')}}},
    LI=s_d=>{const t=document.getElementById('si');let rH='';if(s_d.reparto){rH=`<div><strong>Reparto:</strong> ${s_d.reparto.join(", ")}</div>`}S=s_d;t.innerHTML=`<h2>${s_d.nombre}</h2><div><strong>Género:</strong> ${s_d.genero}</div><div><strong>Año:</strong> ${s_d.anio}</div>${rH}<div><strong>País:</strong> ${s_d.pais_origen}</div><div><strong>Episodios:</strong> ${s_d.cantidad_episodios}</div>${s_d.sinopsis?`<div><strong>Sinopsis:</strong> ${s_d.sinopsis}</div>`:''}`},
    LL=s_d=>{LS.innerHTML='';s_d.enlaces.length>1?(s_d.enlaces.forEach((t,e)=>{const n=document.createElement('option');n.value=e,n.textContent=t.idioma,LS.appendChild(n)}),LC.classList.remove('h')):LC.classList.add('h');LS.value=CLI},
    UC=()=>{if(CSD_L&&CSD_L[CCL]&&CSD_L[CCL].titulo){const nci=(IP?`Reproduciendo: ${CSD_L[CCL].titulo}`:`${CSD_L[CCL].titulo}`);if(CI.textContent!==nci)CI.textContent=nci}else{const nci="Cargando...";if(CI.textContent!==nci)CI.textContent=nci}},
    UT=()=>{
        if(!escuchaContada&&A.currentTime>UMBRAL_ESCUCHA){registrarVistaUnica();escuchaContada=true}
        const curT=A.currentTime;
        if(!CSD_L||CSD_L.length===0)return;
        const calCI=GCI(curT);
        if(calCI<0||calCI>=CSD_L.length||!CSD_L[calCI])return;
        const actualDisplayCap=CSD_L[calCI];
        if(actualDisplayCap&&typeof actualDisplayCap.inicio!=='undefined'&&typeof actualDisplayCap.fin!=='undefined'){const capS_ti=actualDisplayCap.inicio/1e3,capE_ti=actualDisplayCap.fin/1e3;if(!isNaN(capS_ti)&&!isNaN(capE_ti)&&!isNaN(curT)){const nti=`${FT(curT-capS_ti)} / ${FT(capE_ti-capS_ti)}`;if(TI.textContent!==nti)TI.textContent=nti}}
        if(isManuallySwitchingChapter){if(calCI===parseInt(CS.value)){isManuallySwitchingChapter=false;if(CCL!==calCI){CCL=calCI;UC()}}return}
        if(calCI!==CCL&&parseInt(CS.value)!==calCI){CCL=calCI;CS.value=CCL;UC();if(ACCI&&CSD_L[CCL]&&CSD_L[CCL].titulo)ACCI.textContent=CSD_L[CCL].titulo}else if(calCI!==CCL&&parseInt(CS.value)===calCI){CCL=calCI;UC()}
    },
    TP=()=>{IP?(A.pause(),IP=!1,PB.textContent='Reproducir',PB.setAttribute('aria-label','Reproducir (Alt + K)')):(A.play().catch(e=>{}),IP=!0,PB.textContent='Pausar',PB.setAttribute('aria-label','Pausar (Alt + K)'),UC())},
    F=()=>{A.currentTime+=15},
    B=()=>{if(S&&CSD_L&&typeof CCL!=='undefined'&&CSD_L[CCL]){const cS=CSD_L[CCL].inicio/1e3;let nT=A.currentTime-15;A.currentTime=nT<cS?cS:nT}else{A.currentTime-=15}},
    RE=()=>{if(S&&CSD_L&&typeof CCL!=='undefined'&&CSD_L[CCL]){isManuallySwitchingChapter=true;A.currentTime=CSD_L[CCL].inicio/1e3;if(!IP){A.play().catch(e=>{});IP=!0;PB.textContent='Pausar';PB.setAttribute('aria-label','Pausar (Alt + K)')}UC();PC(true,true)}},
    PC=(anC=!1,fS=!1)=>{CCL=parseInt(CS.value);if(CSD_L&&CSD_L[CCL]){A.currentTime=CSD_L[CCL].inicio/1e3;A.play().catch(e=>{});IP=!0;PB.textContent='Pausar';PB.setAttribute('aria-label','Pausar (Alt + K)');UC();if(ACCI){if(anC&&!fS&&CSD_L[CCL].titulo){ACCI.textContent=CSD_L[CCL].titulo}else if(fS){ACCI.textContent=''}}}},
    GCI=t=>{let e=0;if(!CSD_L||CSD_L.length===0)return 0;for(let i=0;i<CSD_L.length;i++){const n=CSD_L[i];if(n&&typeof n.inicio!=='undefined'&&typeof n.fin!=='undefined'){if(t>=n.inicio/1e3&&t<=n.fin/1e3){e=i;break}if(t<n.inicio/1e3){e=i>0?i-1:0;break}if(i===CSD_L.length-1&&t>n.fin/1e3){e=i;break}}}return e},
    PP=()=>{let t=CCL;t>0&&(t--,CS.value=t,isManuallySwitchingChapter=true,PC(true,true))},
    NP=()=>{let t=CCL;if(t<CSD_L.length-1){t++;CS.value=t;isManuallySwitchingChapter=true,PC(true,true)}else if(t===CSD_L.length-1){const nbs=GNB(S.nombre);const semsb=TS_C.filter(s=>GNB(s.nombre)===nbs);const semsbo=OTS(semsb);const cti=semsbo.findIndex(st=>st.nombre===S.nombre);if(cti>=0&&cti<semsbo.length-1){isManuallySwitchingChapter=true;showPlayerView(semsbo[cti+1])}else{}}},
    CLS=()=>{const wP=IP;CPT=A.currentTime;CLI=parseInt(LS.value);if(S){isManuallySwitchingChapter=true;LCF(S,wP)}},
    IV=()=>{A.volume=Math.min(1,A.volume+.05)},DV=()=>{A.volume=Math.max(0,A.volume-.05)},
    DCW=async s_nb=>{if(!auth.currentUser)return;try{const u=auth.currentUser;await deleteDoc(doc(db,"progresoSeries",`${u.uid}_${s_nb}`));UCW()}catch(e){}},
    UCW=async()=>{if(isUCWRunning)return;isUCWRunning=!0;CWL.innerHTML='';if(!auth.currentUser){document.getElementById('cw').classList.add('h');isUCWRunning=!1;return}
    document.getElementById('cw').classList.remove('h');try{const u=auth.currentUser;const q=query(collection(db,"progresoSeries"),where("userId","==",u.uid),where("tiempo",">",10));const qS=await getDocs(q);const c=[];qS.forEach(d=>{c.push({...d.data(),id:d.id})});
    if(c.length===0){CWL.innerHTML="<li>No tienes series para continuar.</li>";isUCWRunning=!1;return}
    if(TS_C.length===0){CWL.innerHTML="<li>Cargando lista de series para mostrar progreso...</li>";isUCWRunning=!1;return}
    const s_all=TS_C;let iA=0;
    for(const t of c){const{stp,ccl}=MCGLTSL(t.serieNombreBase,t.capituloGlobalIndex,s_all);
    if(stp&&stp.capitulos&&stp.capitulos[ccl]){const cap=stp.capitulos[ccl],fin=cap.fin/1e3,durR=FT(fin-t.tiempo),
    li=document.createElement('li'),btn=document.createElement('button');let tnm=stp.nombre.includes(', temporada ')?`, temporada ${stp.nombre.split(', temporada ')[1]}`:(t.serieNombreBase!==stp.nombre?`, ${stp.nombre}`:'');
    btn.textContent=`${t.serieNombreBase}${tnm}, ${cap.titulo}, Restante: ${durR}`;
    btn.addEventListener('click',(e)=>{showPlayerView(stp,e.currentTarget)});btn.classList.add('b');li.appendChild(btn);
    const delB=document.createElement('button');delB.textContent='Eliminar';delB.classList.add('b');delB.style.backgroundColor='#f44336';delB.addEventListener('click',e=>{e.stopPropagation();DCW(t.serieNombreBase)});li.appendChild(delB);CWL.appendChild(li);iA++}}
    if(iA===0&&c.length>0){CWL.innerHTML="<li>No hay progreso para las series actualmente seleccionadas.</li>"}else if(iA===0&&c.length===0){CWL.innerHTML="<li>No tienes series para continuar.</li>"}}catch(e){CWL.innerHTML="<li>Error al cargar progreso.</li>"}finally{isUCWRunning=!1}};
    CBC.addEventListener('click',()=>{history.back();});
    
    CS.addEventListener('change',()=>{S&&GP();isManuallySwitchingChapter=true;PC(true,true);});
    
    A.addEventListener('play',()=>{IP=!0;PB.textContent='Pausar';PB.setAttribute('aria-label','Pausar (Alt + K)');UC()});
    A.addEventListener('pause',()=>{IP=!1;PB.textContent='Reproducir';PB.setAttribute('aria-label','Reproducir (Alt + K)');UC();if(S&&!playerView.classList.contains('view-hidden')){GP()}});
    
    A.addEventListener('ended',()=>{NP()});
    LS.addEventListener('change',CLS);PB.addEventListener('click',TP);
    document.getElementById('fb').addEventListener('click',F);document.getElementById('bb').addEventListener('click',B);REB.addEventListener('click',RE);
    document.getElementById('pcb').addEventListener('click',PP);document.getElementById('ncb').addEventListener('click',NP);
    document.getElementById('ivb').addEventListener('click',IV);document.getElementById('dvb').addEventListener('click',DV);

    const buildDataSourceMenu = () => {
        const menuContainer = document.querySelector('#selector-series ul');
        if (!menuContainer) return;
        menuContainer.innerHTML = '';

        DATA_SOURCES.forEach(source => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = source.name;
            a.dataset.path = source.path;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                if (SD_J === source.path && TS_C.length > 0) return;
                SD_J = source.path;
                CSRS();
                document.querySelectorAll('#selector-series a').forEach(link => link.classList.remove('active'));
                e.target.classList.add('active');
            });
            li.appendChild(a);
            menuContainer.appendChild(li);
        });
    };

    const CSRS=async ()=>{if(isCSRSRunning)return;isCSRSRunning=!0;try{const s_d=await FD();TS_C=s_d;RCAS(TS_C);if(TS_C&&TS_C.length>0)LUSA(TS_C);await CT10SMV();await UCW();const params=new URLSearchParams(window.location.search);const serieParam=params.get('serie');if(serieParam){const serieToShow=TS_C.find(s=>slugify(GNB(s.nombre))===serieParam);if(serieToShow){showPlayerView(serieToShow);const allSeasons=OTS(TS_C.filter(s=>GNB(s.nombre)===GNB(serieToShow.nombre)));if(allSeasons.length>1){LT(allSeasons,serieToShow.nombre)}}}}catch(e){}finally{isCSRSRunning=!1}};
    
    window.addEventListener('popstate',(e)=>{if(!e.state||e.state.view==='list'){showListView()}});

    window.onload=()=>{
        history.replaceState({view:'list'},'','');
        buildDataSourceMenu();
        const firstLink = document.querySelector('#selector-series a');
        if (firstLink) {
            firstLink.classList.add('active');
        }
        CSRS();
    }; 
    
    setInterval(()=>{if(!playerView.classList.contains('view-hidden')&&S&&IP){GP()}},10000);

    document.addEventListener('keydown', function(event) {
        const playerIsVisible = !playerView.classList.contains('view-hidden');
        if (event.altKey && playerIsVisible) {
            if (event.key === 'ArrowLeft') { history.back(); event.preventDefault(); return; }
            const k = event.key.toLowerCase();
            let aT = false;
            switch (k) {
                case 'k': if (PB) { PB.click(); aT = true; } break;
                case 'j': { const btn = document.getElementById('bb'); if (btn) { btn.click(); if (TI && ACCI) { UT(); ACCI.textContent = TI.textContent; } aT = true; } break; }
                case 'l': { const btn = document.getElementById('fb'); if (btn) { btn.click(); if (TI && ACCI) { UT(); ACCI.textContent = TI.textContent; } aT = true; } break; }
                case 'u': { const btn = document.getElementById('dvb'); if (btn) { btn.click(); aT = true; } break; }
                case 'o': { const btn = document.getElementById('ivb'); if (btn) { btn.click(); aT = true; } break; }
                case 'r': if (REB) { REB.click(); aT = true; } break;
                case 'a': { const btn = document.getElementById('pcb'); if (btn) { btn.click(); aT = true; } break; } 
                case 's': { const btn = document.getElementById('ncb'); if (btn) { btn.click(); aT = true; } break; } 
                case 'i': if (S && CSD_L && typeof CCL !== 'undefined' && CSD_L[CCL] && TI && ACCI) { UT(); const nB = GNB(S.nombre); let sInf = nB; const tP = S.nombre.split(', temporada '); if (tP.length > 1) sInf += `. Temporada ${tP[1]}`; sInf += "."; const cTt = CSD_L[CCL].titulo; ACCI.textContent = `${sInf} ${cTt}. ${TI.textContent}.`; aT = true; } break;
                case 't': { const sel = TS; const el = document.getElementById('tasc'); if (sel && el && !el.classList.contains('h')) { sel.focus(); aT = true; } break; }
                case 'c': { const sel = CS; const el = document.getElementById('easc'); if (sel && el && !sel.classList.contains('h')) { sel.focus(); aT = true; } break; }
                case 'p': { const sel = LS; const el = document.getElementById('lasc'); if (sel && el && !el.classList.contains('h')) { sel.focus(); aT = true; } break; }
            }
            if (aT) { event.preventDefault(); }
        }
    });
