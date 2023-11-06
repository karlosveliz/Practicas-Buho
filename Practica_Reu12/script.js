const form = document.querySelector("form"),
fileInput = document.querySelector(".file-input"),
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area");

form.addEventListener("click", () =>{
  fileInput.click();
});

fileInput.onchange = ({target})=>{
  let file = target.files[0];
  if(file){
    let fileName = file.name;
    if(fileName.length >= 12){
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    uploadFile(fileName);
  }
}


function uploadFile(name){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "php/upload.php");
  xhr.upload.addEventListener("progress", ({loaded, total}) => {
    let fileLoaded = Math.floor((loaded / total) * 100);
    let fileTotal = Math.floor(total / 1000);
    let fileSize;
    (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB";
    let progressHTML = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <span class="name">${name} • Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;

    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;

    if (loaded == total) {
      progressArea.innerHTML = "";
      // Llamar a la función para agregar el archivo cargado
      addUploadedFile(name, fileSize);
      uploadedArea.classList.remove("onprogress");
    }
  });

  let data = new FormData(form);
  xhr.send(data);
}

function addUploadedFile(name, fileSize) {
  const uploadedFile = document.createElement("li");
  uploadedFile.className = "row";
  uploadedFile.innerHTML = `
    <i class="fas fa-file-alt"></i>
    <div class="content">
      <div class="details">
        <span class="name">${name} • Uploaded</span>
        <span class="size">${fileSize}</span>
      </div>
      <div class="file-actions">
        <button class="download-button">Descargar</button><br>
        <button class="delete-button">Eliminar</button>
      </div>
    </div>
  `;

  // Agregar eventos a los botones de Descargar y Eliminar
  const downloadButton = uploadedFile.querySelector(".download-button");
  const deleteButton = uploadedFile.querySelector(".delete-button");

  downloadButton.addEventListener("click", () => {
    // Lógica para descargar el archivo aquí
    window.location.href = "uploads/" + name;
  });

  deleteButton.addEventListener("click", () => {
    // Lógica para eliminar el archivo aquí
    fetch("php/delete.php", {
      method: "POST",
      body: JSON.stringify({ filename: name }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        uploadedArea.removeChild(uploadedFile);
      } else {
        console.error(data.message);
      }
    })
    .catch(error => {
      console.error("Error al eliminar el archivo:", error);
    });
  });

  uploadedArea.appendChild(uploadedFile);
}

