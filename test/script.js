import { auth, onAuthStateChanged, sWGi as fbSWGi, sOG as fbSOG, GP as fbGP, RP as fbRP, RVS_C as fbRVS_C, CT10SMV as fbCT10SMV, DCW as fbDCW, fetchUserProgress } from './firebase_functions.js';

const gSI = document.getElementById('gsi'),sO = document.getElementById('so'),   
    EEL = document.getElementById('en-espanol'),CDL = document.getElementById('con-doblaje'),
    SDP1 = 'https://dl.dropbox.com/',SDP2 = 'scl/fi/q5gd1j2lor3fbe6dtv15c/series.json?rlkey=vpgalrx1bbqhjy513q9qr9jvp&dl=1',SDP3 = 'scl/fi/725dxvrb9i69xd4td620v/doblaje.json?rlkey=4elbmhb2ruq76jsi4ohfcp7we&dl=1',
    A = document.getElementById('ap'),MC_DIV = document.getElementById('mc'),M = document.getElementById("sM"),CBC = document.getElementById("cb"),PB = document.getElementById('ppb'),CS = document.getElementById('c'),LC = document.getElementById('lasc'),LS = document.getElementById('l'),CI = document.getElementById('ci'),TI = document.getElementById('ti'),CWL = document.getElementById('cwl'),TS = document.getElementById('t'),SEL_SER_DIV = document.getElementById('selector-series'),USAL = document.getElementById('usal'),REB = document.getElementById('reb'),
    T10L = document.getElementById('t10l');
    
let TII,IP = !1,CSD_L = [],CLI = 0,CCL = 0,CPT = 0,S,SD_J = SDP1 + SDP2,TS_C = [], VIEWED_IN_SESSION = new Set();

const GNB=snc=>snc.split(', temporada')[0].trim();
const MCGLTSL=(nbs,cgi,tasl)=>{const semsb=tasl.filter(s=>GNB(s.nombre)===nbs);const semsbo=OTS(semsb);let cgc=0;for(const stp of semsbo){const nce=stp.capitulos.length;if(cgi<cgc+nce){return{stp,ccl:cgi-cgc}}cgc+=nce}return semsbo.length>0?{stp:semsbo[0],ccl:0}:{stp:null,ccl:0}};
const MTSLCG=(ste,ccl,tasl)=>{const nbs=GNB(ste.nombre);const semsb=tasl.filter(s=>GNB(s.nombre)===nbs);const semsbo=OTS(semsb);let cgi=0;for(const stp of semsbo){if(stp.nombre===ste.nombre){cgi+=ccl;return cgi}if(stp.capitulos)cgi+=stp.capitulos.length}return ccl};

// Use imported Firebase auth functions
const handleSignIn = async () => {
    await fbSWGi();
    // UCW will be called by onAuthStateChanged
};

const handleSignOut = async () => {
    await fbSOG();
    VIEWED_IN_SESSION.clear(); // Managed locally after sign out
    // UCW will be called by onAuthStateChanged
};

onAuthStateChanged(auth, u => {
    const aST = document.querySelector('#as p');
    if (u) {
        gSI.classList.add('h');
        sO.classList.remove('h');
        if (aST) aST.textContent = `¡Hola de nuevo! Tu progreso se guardará automáticamente.`;
    } else {
        gSI.classList.remove('h');
        sO.classList.add('h');
        if (aST) aST.textContent = `¡Bienvenido/a! Puedes explorar y escuchar series sin iniciar sesión. Si deseas guardar tu progreso y continuar escuchando más tarde donde lo dejaste, por favor:`;
        VIEWED_IN_SESSION.clear(); // Clear session specific data on logout
    }
    UCW(); // Update Continue Watching section
});

gSI.addEventListener('click', handleSignIn);
sO.addEventListener('click', handleSignOut);

const FT=t=>{const m=Math.floor(t/60),s=Math.floor(t%60);return`${PZ(m)}:${PZ(s)}`},PZ=n=>(n<10?'0':'')+n;

// Use imported GP
const saveProgress = async () => {
    if (S && auth.currentUser) { // auth is imported
        await fbGP(S, A, CCL, CLI, TS_C, GNB, MTSLCG); // Pass necessary local vars/functions
        UCW(); // Refresh continue watching after saving progress
    }
};

// Use imported RP
const restoreProgress = async nbs => {
    if (auth.currentUser && TS_C && TS_C.length > 0) { // auth is imported
        const progressData = await fbRP(nbs, TS_C, MCGLTSL); // Pass necessary local vars/functions
        if (progressData) {
            S = progressData.S;
            CCL = progressData.CCL;
            A.currentTime = progressData.tiempo;
            CLI = progressData.CLI;
            if (document.getElementById('tasc').classList.contains('h') === false && TS.options.length > 0) {
                 // Ensure the series name matches, as restoreProgress might return a different season if global index pointed there
                if (Array.from(TS.options).some(opt => opt.value === S.nombre)) {
                   TS.value = S.nombre;
                } else if (progressData.nombreOriginal && Array.from(TS.options).some(opt => opt.value === progressData.nombreOriginal) ) {
                    // Fallback to original name if current S.nombre (potentially different season) is not in options
                    TS.value = progressData.nombreOriginal; 
                    // We might need to reload S based on this original name if it's critical
                    const originalSeriesData = TS_C.find(series => series.nombre === progressData.nombreOriginal);
                    if (originalSeriesData) S = originalSeriesData;
                }
            }
            CS.value = CCL;
            LS.value = CLI;
            UC();
            return true;
        }
    }
    return false;
};

const C=()=>{S&&saveProgress();M.style.display="none";M.setAttribute("aria-hidden","true");A.pause();A.src='';MC_DIV.classList.remove('h');clearInterval(TII);IP=!1;PB.textContent='Reproducir';CPT=A.currentTime;dFT(M);SEL_SER_DIV.style.display="block";document.getElementById('as').style.display="block"};

// Use imported RVS_C
const recordView = async sNC => {
    await fbRVS_C(sNC, GNB, VIEWED_IN_SESSION); // VIEWED_IN_SESSION is managed locally
};

const O=s_i=>{recordView(s_i.nombre);const nbs=GNB(s_i.nombre);IP=!1;CLI=0;CCL=0;CPT=0;CSD_L=[];const lYC=async()=>{if(TS_C.length===0){await FD()}restoreProgress(nbs).then(pC=>{if(pC){CPT=A.currentTime}else{S=s_i;CCL=0;CPT=0;CLI=0;if(TS.options.length>0&&Array.from(TS.options).some(opt=>opt.value===S.nombre)){TS.value=S.nombre}}LI(S);LL(S);LCF(S);A.play().catch(e=>{});IP=!0;PB.textContent='Pausar'})};lYC();MC_DIV.classList.add('h');M.style.display="block";M.setAttribute("aria-hidden","false");document.querySelector('#sM .mc').focus();eFT(M);SEL_SER_DIV.style.display="none";document.getElementById('as').style.display="none"};

const FD=async()=>{try{const t=await fetch(SD_J);if(!t.ok)throw new Error(`E!S:${t.status}`);const e=await t.json();TS_C=e.series||[];return TS_C}catch(t){console.error("Error fetching series data (FD):", t);TS_C=[];return[]}};
const OTS=a=>([...a].sort((x,y)=>{const gtn=nm=>{const p=nm.split(', temporada ');if(p.length>1){const n=parseInt(p[1]);return isNaN(n)?Infinity:n}return 1};const nX=gtn(x.nombre),nY=gtn(y.nombre);return nX!==nY?nX-nY:x.nombre.localeCompare(y.nombre)})),
RCAS=s_a=>{const t=document.getElementById('coc');t.innerHTML="";if(!s_a||s_a.length===0){t.innerHTML="<p>No hay series.</p>";return}
const sAg={};s_a.forEach(sE=>{const nB=GNB(sE.nombre);sAg[nB]||(sAg[nB]=[]);sAg[nB].push(sE)});
const pO_s=[...new Set(s_a.map(sE=>sE.pais_origen))].sort();
pO_s.forEach(pO=>{const h2=document.createElement('h2');h2.textContent=pO;t.appendChild(h2);const ul=document.createElement('ul');ul.classList.add('sl');
Object.keys(sAg).sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'})).forEach(nB=>{const sD=sAg[nB].filter(sE=>sE.pais_origen===pO);
if(sD.length>0){const li=document.createElement('li'),btn=document.createElement('button');btn.textContent=nB;
btn.addEventListener('click',()=>{const sOrds=OTS(sD);const pT=sOrds[0];O(pT);sOrds.length>1?LT(sOrds,pT.nombre):document.getElementById('tasc').classList.add('h')});
btn.setAttribute('tabindex','0');btn.classList.add('b');li.appendChild(btn);ul.appendChild(li)}});t.appendChild(ul)});UCW()}, // UCW call here will use the global UCW
LUSA=sa=>{if(!USAL||!sa||sa.length===0){if(USAL)USAL.innerHTML="<li>No hay series nuevas.</li>";return}
USAL.innerHTML='';const u20=sa.slice(-20).reverse();
u20.forEach(s_i=>{const li=document.createElement('li');const btn=document.createElement('button');btn.textContent=s_i.nombre;btn.classList.add('b');
btn.addEventListener('click',()=>{const nb=GNB(s_i.nombre);const sg=TS_C.filter(i=>GNB(i.nombre)===nb);O(s_i);if(sg.length>1){const so=OTS(sg);LT(so,s_i.nombre)}else{document.getElementById('tasc').classList.add('h')}});
li.appendChild(btn);USAL.appendChild(li)})},

// Use imported CT10SMV
CT10SMV=async()=>{
    if(!T10L) return;
    T10L.innerHTML='<li>Cargando...</li>';
    const result = await fbCT10SMV(FD, TS_C, GNB, OTS); // Pass FD, TS_C, GNB, OTS

    if (result.error) {
        T10L.innerHTML = `<li>${result.error}</li>`;
        return;
    }
    
    const { topSeriesDetails } = result;

    if (!topSeriesDetails || topSeriesDetails.length === 0) {
         T10L.innerHTML="<li>No hay series en el top.</li>";
         return;
    }

    T10L.innerHTML='';
    topSeriesDetails.forEach(item => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = item.displayName;
        btn.classList.add('b');
        btn.addEventListener('click', () => {
            if (item.seriesData) {
                O(item.seriesData);
                if (item.seriesOptions && item.seriesOptions.length > 1) {
                    LT(item.seriesOptions, item.seriesData.nombre);
                } else {
                    document.getElementById('tasc').classList.add('h');
                }
            }
        });
        li.appendChild(btn);
        T10L.appendChild(li);
    });
     if(T10L.children.length===0) T10L.innerHTML="<li>No se pudieron mostrar o no hay series en el top.</li>";
},
LT=(s_a,stn)=>{TS.innerHTML='';document.getElementById('tasc').classList.remove('h');s_a.forEach(sE=>{const tN=sE.nombre.split(', temporada ')[1];const opt=document.createElement('option');opt.value=sE.nombre;opt.textContent=tN?`Temporada ${tN}`:sE.nombre;TS.appendChild(opt)});if(stn)TS.value=stn;TS.onchange=e=>{const sS=s_a.find(sE=>sE.nombre===e.target.value);if(sS){S=sS;CCL=0;CPT=0;A.currentTime=0;CLI=parseInt(LS.value)||0;LI(S);LL(S);LCF(S);A.play().catch(err=>{console.error("Error playing audio on season change:", err)});IP=!0;PB.textContent='Pausar'}}},
LI=s_d=>{const t=document.getElementById('si');let rH='';if(SD_J===SDP1+SDP2&&s_d.reparto){rH=`<div><strong>Reparto:</strong> ${s_d.reparto.join(", ")}</div>`}S=s_d;t.innerHTML=`<h2>${s_d.nombre}</h2><div><strong>Género:</strong> ${s_d.genero}</div><div><strong>Año:</strong> ${s_d.anio}</div>${rH}<div><strong>País:</strong> ${s_d.pais_origen}</div><div><strong>Episodios:</strong> ${s_d.cantidad_episodios}</div>${s_d.sinopsis?`<div><strong>Sinopsis:</strong> ${s_d.sinopsis}</div>`:''}`},
LL=s_d=>{LS.innerHTML='';s_d.enlaces.length>1?(s_d.enlaces.forEach((t,e)=>{const n=document.createElement('option');n.value=e,n.textContent=t.idioma,LS.appendChild(n)}),LC.classList.remove('h')):LC.classList.add('h');LS.value=CLI},
LCF=s_d=>{CS.innerHTML='';CSD_L=s_d.capitulos;CSD_L.forEach((t,e)=>{const n=document.createElement('option');n.value=e,n.textContent=t.titulo,CS.appendChild(n)});CS.value=CCL;UC();A.src=s_d.enlaces[CLI].enlace;A.load();A.currentTime=CPT;if(IP)A.play().catch(e=>{console.error("Error playing audio in LCF:", e)});clearInterval(TII);UT();TII=setInterval(UT,1e3)},
UC=()=>{CI.textContent=(CSD_L&&CSD_L[CCL])?(IP?`Reproduciendo: ${CSD_L[CCL].titulo}`:`${CSD_L[CCL].titulo}`):"Cargando..."},
UT=()=>{const t=A.currentTime;if(!CSD_L||CSD_L.length===0)return;const e=GCI(t);if(e<0||e>=CSD_L.length||!CSD_L[e])return;const n=CSD_L[e],i=n.inicio/1e3,o=n.fin/1e3,r=FT(t-i),c=FT(o-i);if(CSD_L[CCL]){CI.textContent=IP?`Reproduciendo: ${CSD_L[CCL].titulo}`:`${CSD_L[CCL].titulo}`}TI.textContent=`${r} / ${c}`},
TP=()=>{IP?(A.pause(),IP=!1,PB.textContent='Reproducir',PB.setAttribute('aria-label','Reproducir')):(A.play().catch(e=>{console.error("Error in TP (play):", e)}),IP=!0,PB.textContent='Pausar',PB.setAttribute('aria-label','Pausar'),UC())},
F=()=>{A.currentTime+=15},B=()=>{A.currentTime-=15},
RE=()=>{if(S&&CSD_L&&typeof CCL!=='undefined'&&CSD_L[CCL]){A.currentTime=CSD_L[CCL].inicio/1e3;if(!IP){A.play().catch(e=>{console.error("Error in RE (play):",e)});IP=!0;PB.textContent='Pausar';PB.setAttribute('aria-label','Pausar')}UC()}},
PC=()=>{CCL=parseInt(CS.value);if(CSD_L&&CSD_L[CCL]){A.currentTime=CSD_L[CCL].inicio/1e3;A.play().catch(e=>{console.error("Error in PC (play):",e)});IP=!0;PB.textContent='Pausar';PB.setAttribute('aria-label','Pausar');UC()}else{console.warn("Capítulo no encontrado en PC", CCL, CSD_L)}},
GCI=t=>{let e=0;if(!CSD_L||CSD_L.length===0)return 0;CSD_L.forEach((n,i)=>{if(n&&typeof n.inicio!=='undefined'&&typeof n.fin!=='undefined'){if(t>=n.inicio/1e3&&t<=n.fin/1e3)e=i}});return e},
PP=()=>{let t=CCL;t>0&&(t--,CS.value=t,PC())},NP=()=>{let t=CCL;if(t<CSD_L.length-1){t++;CS.value=t;PC()}else if(t===CSD_L.length-1){const nbs=GNB(S.nombre);const semsb=TS_C.filter(s=>GNB(s.nombre)===nbs);const semsbo=OTS(semsb);const cti=semsbo.findIndex(st=>st.nombre===S.nombre);if(cti>=0&&cti<semsbo.length-1){O(semsbo[cti+1])}else{/* console.log("Último episodio de la última temporada") */}}},
CLS=()=>{CPT=A.currentTime;CLI=parseInt(LS.value);S&&LCF(S)},IV=()=>{A.volume=Math.min(1,A.volume+.05)},DV=()=>{A.volume=Math.max(0,A.volume-.05)},

// Use imported DCW and fetchUserProgress for UCW
UCW=async()=>{
    CWL.innerHTML='';
    if (!auth.currentUser) { // auth is imported
        document.getElementById('cw').classList.add('h');
        return;
    }
    document.getElementById('cw').classList.remove('h');
    
    const result = await fetchUserProgress(); // Fetch progress data

    if (result.error || !result.progressData) {
        CWL.innerHTML = `<li>${result.error || 'Error al cargar progreso.'}</li>`;
        return;
    }

    const { progressData } = result;

    if (progressData.length === 0) {
        CWL.innerHTML = "<li>No tienes series para continuar.</li>";
        return;
    }

    let s_all = TS_C; // Use cached TS_C if available
    if (!s_all || s_all.length === 0) {
        s_all = await FD(); // Fetch if not available
    }
    
    if (s_all.length === 0) {
        CWL.innerHTML = "<li>Error al cargar datos de series para progreso.</li>";
        return;
    }

    for (const t of progressData) {
        const { stp, ccl } = MCGLTSL(t.serieNombreBase, t.capituloGlobalIndex, s_all);
        if (stp && stp.capitulos && stp.capitulos[ccl]) {
            const cap = stp.capitulos[ccl];
            const durR = FT( (cap.fin / 1e3) - t.tiempo);
            const li = document.createElement('li');
            const btn = document.createElement('button');
            let tnm = stp.nombre.includes(', temporada ') ? `, temporada ${stp.nombre.split(', temporada ')[1]}` : (t.serieNombreBase !== stp.nombre ? `, ${stp.nombre}` : '');
            btn.textContent = `${t.serieNombreBase}${tnm}, ${cap.titulo}, Restante: ${durR}`;
            btn.addEventListener('click', () => { O(stp) });
            btn.classList.add('b');
            li.appendChild(btn);
            
            const delB = document.createElement('button');
            delB.textContent = 'Eliminar';
            delB.classList.add('b');
            delB.style.backgroundColor = '#f44336';
            delB.addEventListener('click', async (e) => {
                e.stopPropagation();
                await fbDCW(t.serieNombreBase); // Use imported DCW
                UCW(); // Refresh the list
            });
            li.appendChild(delB);
            CWL.appendChild(li);
        }
    }
    if (CWL.children.length === 0) {
        CWL.innerHTML = "<li>No tienes series para continuar.</li>";
    }
};

CBC.addEventListener('click',C);
window.addEventListener('click',t=>{t.target===M&&C()});
CS.addEventListener('change',()=>{S&&saveProgress();PC()}); 
A.addEventListener('pause',()=>{if(S&&M.style.display==="block")saveProgress()}); 
A.addEventListener('play',()=>{IP=!0;PB.textContent='Pausar';PB.setAttribute('aria-label','Pausar');UC()});
A.addEventListener('ended',()=>{NP()});
LS.addEventListener('change',CLS);PB.addEventListener('click',TP);
document.getElementById('fb').addEventListener('click',F);
document.getElementById('bb').addEventListener('click',B);
REB.addEventListener('click',RE);
document.getElementById('pcb').addEventListener('click',PP);
document.getElementById('ncb').addEventListener('click',NP);
document.getElementById('ivb').addEventListener('click',IV);
document.getElementById('dvb').addEventListener('click',DV);

const CSRS=()=>{FD().then(s_d=>{RCAS(s_d);if(s_d&&s_d.length>0)LUSA(s_d);CT10SMV();UCW()}).catch(e=>{console.error("Error in CSRS initial data load:", e)})};

EEL.addEventListener('click',e=>{e.preventDefault();SD_J=SDP1+SDP2;CSRS()});
CDL.addEventListener('click',e=>{e.preventDefault();SD_J=SDP1+SDP3;CSRS()});

window.onload=()=>{
    VIEWED_IN_SESSION.clear(); 
    CSRS(); // Initial series load
}; 

setInterval(()=>{if(M.style.display==="block"&&S&&IP){saveProgress()}},10000); 

// Focus Trap Functions
let cFT=null;
function createFocusTrap(el){
    let fe=el.querySelectorAll('a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled])');
    if(fe.length===0)return{destroy:()=>{},update:()=>{}};
    let ffe=fe[0];
    let lfe=fe[fe.length-1];
    const kh=e=>{
        const iTP=e.key==='Tab'||e.keyCode===9;
        if(!iTP){return}
        if(e.shiftKey){
            if(document.activeElement===ffe){
                lfe.focus();
                e.preventDefault()
            }
        }else{
            if(document.activeElement===lfe){
                ffe.focus();
                e.preventDefault()
            }
        }
    };
    el.addEventListener('keydown',kh);
    return {
        destroy:()=>{el.removeEventListener('keydown',kh)},
        update:()=>{
            fe=el.querySelectorAll('a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled])');
            if(fe.length===0)return;
            ffe=fe[0];
            lfe=fe[fe.length-1]
        }
    }
};
function eFT(el){if(cFT){cFT.destroy()}cFT=createFocusTrap(el)};
function dFT(){if(cFT){cFT.destroy();cFT=null}};
