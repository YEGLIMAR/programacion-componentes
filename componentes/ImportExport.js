export default class ImportExport extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.selectedAudios = [];
        this.currentAudio = null;
        this.currentAlbum = null; // Para saber si estamos en una playlist
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();

        document.addEventListener("playlistChanged", (event) => {
            this.currentAlbum = event.detail.album; // Guardar el álbum actual
        });

        document.addEventListener("audioSelectionChanged", (event) => {
            const { id, selected, src, title } = event.detail;
            if (selected) {
                this.selectedAudios.push({ id, src, title });
            } else {
                this.selectedAudios = this.selectedAudios.filter(audio => audio.id !== id);
            }
        });
        
    }
    notifyPlaylistChange() {
        document.dispatchEvent(new CustomEvent("playlistChanged", { detail: { album: this.currentAlbum } }));
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .import-export {
                    display: flex;
                    gap: 5px;
                    justify-content: right;
                }
                button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1.2em;
                }
                button:hover {
                    opacity: 0.8;
                }
                .image-preview {
                    max-width: 100px;
                    max-height: 100px;
                    display: none;
                    margin-top: 10px;
                }
            </style>

            <div class="import-export">
                <button id="importAudio">📂</button>
                <button id="exportAudio">📤</button>
                <button id="deleteAudio">🗑️</button>
                <input type="file" id="fileInput" accept="audio/*" hidden>
                <input type="file" id="imageInput" accept="image/*" hidden>
                <img id="imagePreview" class="image-preview">
                <button id="confirmAudio" style="display: none;">✅ Confirm</button>
            </div>
        `;
    }

    addEventListeners() {
        this.shadowRoot.querySelector("#importAudio").addEventListener("click", () => {
            this.shadowRoot.querySelector("#fileInput").click();
        });
    
        this.shadowRoot.querySelector("#fileInput").addEventListener("change", (event) => this.importAudio(event));
        this.shadowRoot.querySelector("#imageInput").addEventListener("change", (event) => this.selectImage(event));
        this.shadowRoot.querySelector("#confirmAudio").addEventListener("click", () => this.confirmAudio());
        this.shadowRoot.querySelector("#deleteAudio").addEventListener("click", () => this.deleteSelectedAudios());
    
        // Corregir el binding de la función para evitar errores
        this.shadowRoot.querySelector("#exportAudio").addEventListener("click", () => this.exportSelectedAudios());
    }

    deleteSelectedAudios() {
        if (this.selectedAudios.length === 0) {
            alert("No audios selected for deletion!");
            return;
        }
    
        this.selectedAudios.forEach(audio => {
            document.dispatchEvent(new CustomEvent("audioDeleted", { detail: { id: audio.id } }));
        });
    
        this.selectedAudios = []; // Vaciar la lista de seleccionados
        alert("Selected audios deleted successfully!");
    }
    
    
    

    exportSelectedAudios() {
        let audiosToExport = [];
    
        if (this.currentAlbum) {
            // Exportar todos los audios del álbum actual
            let albums = JSON.parse(localStorage.getItem("albums")) || {};
            if (albums[this.currentAlbum]) {
                audiosToExport = albums[this.currentAlbum];
            }
        } else {
            // Exportar solo los audios seleccionados en "All Sounds"
            audiosToExport = this.selectedAudios;
        }
    
        if (audiosToExport.length === 0) {
            alert("No audios available for export!");
            return;
        }
    
        const blob = new Blob([JSON.stringify(audiosToExport, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = this.currentAlbum ? `${this.currentAlbum}.json` : "exported_audios.json";
        a.click();
    }
    

    importAudio(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.currentAudio = {
                    id: Date.now().toString(),
                    title: file.name.split(".")[0], 
                    src: e.target.result,
                    image: null, // Se seleccionará después
                    duration: "Loading..."
                };

                // Pedir al usuario que seleccione una imagen
                this.shadowRoot.querySelector("#imageInput").click();
            };
            reader.readAsDataURL(file);
        }
    }

    selectImage(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imagePreview = this.shadowRoot.querySelector("#imagePreview");
                imagePreview.src = e.target.result;
                imagePreview.style.display = "block";

                this.currentAudio.image = e.target.result;
                this.shadowRoot.querySelector("#confirmAudio").style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    }

    confirmAudio() {
        if (this.currentAudio && this.currentAudio.image) {
            if (this.currentAlbum) {
                document.dispatchEvent(new CustomEvent("audioImported", { 
                    detail: { ...this.currentAudio, album: this.currentAlbum } // 🔹 Enviar el nombre de la playlist
                }));
            } else {
                document.dispatchEvent(new CustomEvent("audioImported", { detail: this.currentAudio }));
            }
    
            // Ocultar la imagen y el botón de confirmación después de importar
            this.shadowRoot.querySelector("#imagePreview").style.display = "none";
            this.shadowRoot.querySelector("#confirmAudio").style.display = "none";
    
            alert(`Audio importado en ${this.currentAlbum || "All Sounds"} con éxito!`);
        }
    }
    
    
}

customElements.define("import-export", ImportExport);
