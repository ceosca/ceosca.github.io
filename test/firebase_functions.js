import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc, query, where, getDocs, serverTimestamp, deleteDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

const fC = { apiKey: "AIzaSyAGzPA5b5P1NofFZtbBvGpuYE3tVR-JaS0", authDomain: "pfdsuaaug.firebaseapp.com", projectId: "pfdsuaaug", storageBucket: "pfdsuaaug.firebasestorage.app", messagingSenderId: "701797222900", appId: "1:701797222900:web:01836d45db1b35be2bd1a1" };

const app = initializeApp(fC);
const db = getFirestore(app);
const auth = getAuth(app);
const gP = new GoogleAuthProvider();

const sWGi = async () => {
    try {
        await signInWithPopup(auth, gP);
    } catch (e) {
        console.error("Error during sign-in:", e);
    }
};

const sOG = async () => {
    try {
        await signOut(auth);
        // VIEWED_IN_SESSION.clear() should be handled in the main script after signOut
    } catch (e) {
        console.error("Error during sign-out:", e);
    }
};

// onAuthStateChanged will be handled in the main script as it directly manipulates DOM elements.
// We will export 'auth' and 'onAuthStateChanged' from firebase/auth to be used in the main script.

const GP = async (S, A, CCL, CLI, TS_C, GNB, MTSLCG) => { // Added dependencies as parameters
    if (!S || !auth.currentUser) return;
    const t = A.currentTime;
    const nbs = GNB(S.nombre);
    const cgi = MTSLCG(S, CCL, TS_C);
    try {
        const u = auth.currentUser;
        const p = {
            serieNombreBase: nbs,
            capituloGlobalIndex: cgi,
            tiempo: t,
            idiomaIndex: CLI,
            serieTemporadaActualNombre: S.nombre,
            userId: u.uid,
            ultimaActualizacion: serverTimestamp()
        };
        await setDoc(doc(db, "progresoSeries", `${u.uid}_${nbs}`), p);
        // UCW() should be called from the main script after this, if needed.
    } catch (e) {
        console.error("Error saving progress:", e);
    }
};

const RP = async (nbs, TS_C, MCGLTSL) => { // Added dependencies as parameters
    if (!auth.currentUser || !TS_C || TS_C.length === 0) return false;
    try {
        const u = auth.currentUser;
        const dS = await getDoc(doc(db, "progresoSeries", `${u.uid}_${nbs}`));
        if (dS.exists()) {
            const d = dS.data();
            const { stp, ccl } = MCGLTSL(nbs, d.capituloGlobalIndex, TS_C); // MCGLTSL needs to be passed or defined
            if (stp) {
                // Returns data to be used in the main script
                return { S: stp, CCL: ccl, tiempo: d.tiempo, CLI: d.idiomaIndex || 0, nombreOriginal: d.serieTemporadaActualNombre };
            }
        }
    } catch (e) {
        console.error("Error restoring progress:", e);
    }
    return false;
};

const RVS_C = async (sNC, GNB, VIEWED_IN_SESSION) => { // Added GNB and VIEWED_IN_SESSION as parameters
    if (!sNC) return;
    const sNB = GNB(sNC);
    if (!sNB || VIEWED_IN_SESSION.has(sNB)) return;
    try {
        const cDR = doc(db, "estadisticasSeries", "conteoVistasGlobal");
        const cAI = `vistasPorSerie.${sNB.replace(/\./g, '_')}`;
        const dSnp = await getDoc(cDR);
        if (dSnp.exists()) {
            await updateDoc(cDR, { [cAI]: increment(1) });
        } else {
            await setDoc(cDR, { vistasPorSerie: { [sNB.replace(/\./g, '_')]: 1 } });
        }
        VIEWED_IN_SESSION.add(sNB); // VIEWED_IN_SESSION is managed here now or pass it back
    } catch (e) {
        console.error("Error recording series view:", e);
    }
};

const CT10SMV = async (FD, TS_C, GNB, OTS) => { // Added FD, TS_C, GNB, OTS as parameters
    // This function fetches data and prepares it for display.
    // DOM manipulation should be done in the main script.
    try {
        const cDR = doc(db, "estadisticasSeries", "conteoVistasGlobal");
        const dSnp = await getDoc(cDR);
        if (!dSnp.exists() || !dSnp.data().vistasPorSerie) {
            return { error: "Aún no hay datos." };
        }
        const vPSM = dSnp.data().vistasPorSerie;
        const sCA = Object.entries(vPSM).map(([nC, v]) => ({ n: nC.replace(/_/g, '.'), v })).sort((a, b) => b.v - a.v).slice(0, 10);

        if (sCA.length === 0) {
            return { error: "No hay series en el top." };
        }
        
        // Ensure series data is available
        let currentTS_C = TS_C;
        if (!currentTS_C || currentTS_C.length === 0) {
            currentTS_C = await FD(); // FD needs to be passed or defined
            if (!currentTS_C || currentTS_C.length === 0) {
                 return { error: "Error: datos de series no disponibles." };
            }
        }
        
        const topSeriesDetails = [];
        sCA.forEach(i => {
            const sDO_arr = currentTS_C.filter(s => GNB(s.nombre) === i.n); // GNB needs to be passed or defined
            if (sDO_arr.length > 0) {
                // const sDO = sDO_arr[0]; // This was unused
                const sDMNB = currentTS_C.filter(s => GNB(s.nombre) === i.n);
                const sOPT = OTS(sDMNB); // OTS needs to be passed or defined
                if (sOPT.length > 0) {
                    topSeriesDetails.push({
                        displayName: `${i.n} (${i.v} ${i.v === 1 ? 'reproducción' : 'reproducciones'})`,
                        seriesData: sOPT[0], // Data to open the series
                        seriesOptions: sOPT // Data for season selection
                    });
                }
            }
        });
        if (topSeriesDetails.length === 0 && sCA.length > 0) {
            return { error: "No se pudieron mostrar (datos no encontrados)." };
        }
         if (topSeriesDetails.length === 0 && sCA.length === 0) {
            return { error: "No hay series en el top." };
        }
        return { topSeriesDetails };

    } catch (e) {
        console.error("Error fetching top 10 series:", e);
        return { error: "Error al cargar." };
    }
};

const DCW = async (s_nb) => {
    if (!auth.currentUser) return;
    try {
        const u = auth.currentUser;
        await deleteDoc(doc(db, "progresoSeries", `${u.uid}_${s_nb}`));
        // UCW() should be called from the main script after this to update UI
    } catch (e) {
        console.error("Error deleting user progress:", e);
    }
};

const fetchUserProgress = async () => { // Renamed from UCW part, to only fetch data
    if (!auth.currentUser) return { error: "User not authenticated" };
    try {
        const u = auth.currentUser;
        const q = query(collection(db, "progresoSeries"), where("userId", "==", u.uid), where("tiempo", ">", 10));
        const qS = await getDocs(q);
        const progressData = [];
        qS.forEach(d => {
            progressData.push({ ...d.data(), id: d.id });
        });
        return { progressData };
    } catch (e) {
        console.error("Error fetching user progress:", e);
        return { error: "Error al cargar progreso." };
    }
};

export {
    db,
    auth,
    gP,
    sWGi,
    sOG,
    onAuthStateChanged, // Exporting the function itself from firebase/auth
    GP,
    RP,
    RVS_C,
    CT10SMV,
    DCW,
    fetchUserProgress // Exporting the data fetching part of UCW
};
