let firebaseApp = null;
let firebaseDB = null;
let isFirebaseConnected = false;

/* =========================
LOAD CONFIG
========================= */

function loadFirebaseConfig() {
const config = JSON.parse(
    localStorage.getItem("firebase_config") || "{}"
);

document.getElementById("firebase-apiKey").value =
    config.apiKey || "";

document.getElementById("firebase-authDomain").value =
    config.authDomain || "";

document.getElementById("firebase-databaseURL").value =
    config.databaseURL || "";

document.getElementById("firebase-projectId").value =
    config.projectId || "";

document.getElementById("firebase-storageBucket").value =
    config.storageBucket || "";

if (config.apiKey && config.databaseURL) {
    connectFirebase();
}
}

/* =========================
SAVE CONFIG
========================= */

function saveFirebaseConfig() {
const config = {
    apiKey:
        document.getElementById("firebase-apiKey").value.trim(),

    authDomain:
        document.getElementById("firebase-authDomain").value.trim(),

    databaseURL:
        document.getElementById("firebase-databaseURL").value.trim(),

    projectId:
        document.getElementById("firebase-projectId").value.trim(),

    storageBucket:
        document.getElementById("firebase-storageBucket").value.trim()
};

localStorage.setItem(
    "firebase_config",
    JSON.stringify(config)
);

showToast(
    "Konfigurasi Firebase berhasil disimpan",
    "success"
);
}

/* =========================
CONNECT FIREBASE
========================= */

function connectFirebase() {
const config = {
    apiKey:
        document.getElementById("firebase-apiKey").value.trim(),

    authDomain:
        document.getElementById("firebase-authDomain").value.trim(),

    databaseURL:
        document.getElementById("firebase-databaseURL").value.trim(),

    projectId:
        document.getElementById("firebase-projectId").value.trim(),

    storageBucket:
        document.getElementById("firebase-storageBucket").value.trim()
};

console.log("Firebase Config:", config);

if (!config.apiKey || !config.databaseURL) {

    updateFirebaseStatus(
        "error",
        "API Key dan Database URL wajib diisi"
    );

    return;
}

try {

    if (typeof firebase === "undefined") {

        updateFirebaseStatus(
            "error",
            "Firebase SDK belum dimuat"
        );

        return;
    }

    if (!firebase.apps.length) {

        firebaseApp =
            firebase.initializeApp(config);

    } else {

        firebaseApp =
            firebase.app();
    }

    firebaseDB =
        firebase.database();

    firebaseDB
        .ref(".info/connected")
        .on("value", (snap) => {

            if (snap.val() === true) {

                isFirebaseConnected = true;

                updateFirebaseStatus(
                    "success",
                    "Terhubung ke Firebase"
                );

                loadCloudData();

            } else {

                isFirebaseConnected = false;

                updateFirebaseStatus(
                    "error",
                    "Koneksi Firebase terputus"
                );
            }
        });

} catch (error) {

    console.error(error);

    updateFirebaseStatus(
        "error",
        error.message
    );
}
}

/* =========================
STATUS
========================= */

function updateFirebaseStatus(type, message) {
const el =
    document.getElementById("firebase-status");

if (!el) return;

if (type === "success") {

    el.className =
        "mt-4 p-3 rounded bg-green-100 text-green-700";

} else {

    el.className =
        "mt-4 p-3 rounded bg-red-100 text-red-700";
}

el.innerHTML = message;
}

/* =========================
SAVE CLOUD
========================= */

function saveToCloud() {
if (!isFirebaseConnected) {

    alert(
        "Firebase belum terhubung"
    );

    return;
}

const title =
    document.getElementById(
        "cloud-save-title"
    ).value.trim();

const notes =
    document.getElementById(
        "cloud-save-notes"
    ).value.trim();

if (!title) {

    alert(
        "Masukkan judul penilaian"
    );

    return;
}

const saveData = {

    title,

    notes,

    data:
        getAllCurrentData(),

    createdBy:
        currentUser
            ? currentUser.username
            : "admin",

    createdAt:
        new Date().toISOString(),

    updatedAt:
        new Date().toISOString()
};

firebaseDB
    .ref("penilaian")
    .push(saveData)

    .then(() => {

        showToast(
            "Berhasil disimpan ke cloud",
            "success"
        );

        loadCloudData();
    })

    .catch((err) => {

        console.error(err);

        showToast(
            err.message,
            "error"
        );
    });
}

/* =========================
LOAD CLOUD
========================= */

function loadCloudData() {

    if (!isFirebaseConnected) return;

    const list =
        document.getElementById(
            "cloud-data-list"
        );

    if (!list) return;

    list.innerHTML =
        "<div class='text-center p-4'>Memuat data...</div>";

    firebaseDB
        .ref("penilaian")
        .once("value")

        .then((snapshot) => {

            const data =
                snapshot.val();

            if (!data) {

                list.innerHTML =
                    "<div class='text-center p-4'>Belum ada data</div>";

                return;
            }

            const items =
                Object.entries(data);

            list.innerHTML = "";

            items.reverse().forEach(
                ([key, item]) => {

                    const card =
                        document.createElement("div");

                    card.className =
                        "border rounded p-3 mb-3";

                    card.innerHTML = `
                        <h4 class="font-bold">
                            ${item.title}
                        </h4>

                        <p>
                            ${item.notes || "-"}
                        </p>

                        <button
                            onclick="loadDataToForm('${key}','cloud')"
                            class="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                        >
                            Load
                        </button>
                    `;

                    list.appendChild(card);
                }
            );
        })

        .catch((err) => {

            console.error(err);

            list.innerHTML =
                "<div class='text-red-500'>" +
                err.message +
                "</div>";
        });
}

/* =========================
LOAD FORM
========================= */

function loadDataToForm(id) {
    firebaseDB
        .ref("penilaian/" + id)
        .once("value")
        .then((snapshot) => {
            const item = snapshot.val();

            if (!item) return;

            applyDataToForm(item.data);

            showToast("Data berhasil dimuat", "success");

            switchView("calculator");
        });
}
