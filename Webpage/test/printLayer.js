function updateStatus(account) {
  statusH2 = document.getElementById("status");
  if (account == null) {
      statusH2.innerText = "Not connected";
  } else {
      statusH2.innerText = "Connected " + account;
  }
}


function userConfirms(gasEstimate) {
  window.confirm("This tx will spend around "+gasEstimate+" gas. Send it?");
}