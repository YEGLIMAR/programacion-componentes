import "./SoundItem.js";

export default class SoundList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.album = this.getAttribute("album"); // Detecta si estamos en una playlist

        if (this.album) {
            let albums = JSON.parse(localStorage.getItem("albums")) || {};
            this.audios = albums[this.album] || []; // Solo cargar audios de esta playlist
        } else {
            this.audios = JSON.parse(localStorage.getItem("customAudios")) || []; // All Sounds
        }
    }
    connectedCallback() {
        this.render();
        document.addEventListener("audioImported", (event) => this.addAudio(event.detail));
        document.addEventListener("deleteAudios", (event) => this.removeAudios(event.detail));
        document.addEventListener("audioDeleted", (event) => this.removeAudios([event.detail.id]));
    }
    

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .sound-list-container {
                    height: 300px;
                    overflow-x: hidden;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }
            </style>

            <div class="sound-list-container">
                ${this.audios.length > 0 ? 
                    this.audios.map(audio => `
                        <sound-item 
                            audio-id="${audio.id}" 
                            audio-src="${audio.src}"
                            image="${audio.image}" 
                            title="${audio.title}">
                        </sound-item>
                    `).join("")
                    : "<p>No audios yet 😢</p>"
                }
            </div>
        `;
    }

    addAudio(audio) {
        let albums = JSON.parse(localStorage.getItem("albums")) || {};
    
        if (this.album) {
            // Si estamos en una playlist específica, agregar el audio solo a esa playlist
            if (!albums[this.album]) {
                albums[this.album] = [];
            }
    
            if (!albums[this.album].some(a => a.id === audio.id)) { // Evitar duplicados
                albums[this.album].push(audio);
                localStorage.setItem("albums", JSON.stringify(albums));
            }
        } else {
            // Si estamos en "All Sounds", agregamos el audio globalmente
            let allAudios = JSON.parse(localStorage.getItem("customAudios")) || [];
    
            if (!allAudios.some(a => a.id === audio.id)) { // Evitar duplicados
                allAudios.push(audio);
                localStorage.setItem("customAudios", JSON.stringify(allAudios));
            }
        }
    
        this.render();
    }
    
    removeAudios(audioIds) {
        if (this.album) {
            let albums = JSON.parse(localStorage.getItem("albums")) || {};
            if (albums[this.album]) {
                albums[this.album] = albums[this.album].filter(audio => !audioIds.includes(audio.id));
                localStorage.setItem("albums", JSON.stringify(albums));
            }
        } else {
            this.audios = this.audios.filter(audio => !audioIds.includes(audio.id));
            localStorage.setItem("customAudios", JSON.stringify(this.audios));
        }
    
        this.render(); // Refrescar la UI después de eliminar los audios
    }
}    
customElements.define("sound-list", SoundList);
