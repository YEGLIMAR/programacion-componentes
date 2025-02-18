 export default class ImportExport extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
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
                .h1 {
                    font-size: 1.2em;
                    color: white;


                
                }

                button:hover {
                    opacity: 0.8;
                }
            </style>

            <div class="import-export">
                 <h1>The list </h1>
                <button id="importAudio">📂</button>
                <button id="exportAudio">📤</button>
               
                <input type="file" id="fileInput" accept="audio/*" hidden>
            </div>
        `;
    }

    addEventListeners() {
        this.shadowRoot.querySelector("#importAudio").addEventListener("click", () => {
            this.shadowRoot.querySelector("#fileInput").click();
        });

        this.shadowRoot.querySelector("#fileInput").addEventListener("change", (event) => this.importAudio(event));
        this.shadowRoot.querySelector("#exportAudio").addEventListener("click", () => this.exportSelectedAudios());
    }

    importAudio(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const audioData = {
                    id: Date.now().toString(),
                    title: file.name.split(".")[0], // Nombre sin extensión
                    src: e.target.result,
                    image: "assets/images/default.jpg",
                    duration: "Loading...",
                    type: "all"
                };

                document.dispatchEvent(new CustomEvent("audioImported", { detail: audioData }));
            };
            reader.readAsDataURL(file);
        }
    }

    exportSelectedAudios() {
        alert("Export function not implemented yet!");
    }
}

customElements.define("import-export", ImportExport);

