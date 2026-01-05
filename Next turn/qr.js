// 🔁 Google Form Prefilled URL (Turn ID field)
const FORM_BASE =
  "https://docs.google.com/forms/d/e/1FAIpQLScraFTx6Ep5NcTdbcddyCl-J53DaWg2dBmJ5oPsuETxEod9Jw/viewform?usp=pp_url";

function generateQR() {
  const turnId = "TURN-" + Date.now();
  const formURL = FORM_BASE + turnId;

  // Pre-create queue entry
  db.ref("queue/" + turnId).set({
    status: "waiting",
    createdAt: Date.now(),
    notified: false,
    completed: false
  });

  const qrDiv = document.getElementById("qrCode");
  qrDiv.innerHTML = "";

  new QRCode(qrDiv, {
    text: formURL,
    width: 180,
    height: 180
  });

  document.getElementById("formLink").href = formURL;
  document.getElementById("formLink").innerText = "Open Google Form";
}