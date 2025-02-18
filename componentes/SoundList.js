import "./SoundItem.js";

export default class SoundList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.album = this.getAttribute("album"); // 📌 Playlist activa

        if (this.album) {
            let albums = JSON.parse(localStorage.getItem("albums")) || {};
            this.audios = albums[this.album] || [];
        } else {
            this.audios = JSON.parse(localStorage.getItem("customAudios")) || [];
        }
    }

    connectedCallback() {
        this.render();

        document.addEventListener("audioImported", (event) => this.addAudio(event.detail));
    }

    render() {
        let filteredAudios = this.audios;

        this.shadowRoot.innerHTML = `
            <style>
                .sound-list-container {
                    height: 400px;
                    overflow-y: auto;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
            </style>

            <div class="sound-list-container">
                ${filteredAudios.length > 0 ? 
                    filteredAudios.map(audio => `
                        <sound-item 
                            audio-id="${audio.id}" 
                            audio-src="${audio.src}"
                            image="${audio.image}" 
                            title="${audio.title}" 
                            duration="${audio.duration}">
                        </sound-item>
                    `).join("")
                    : "<p>No audios yet 😢</p>"
                }
            </div>
        `;
    }

    addAudio(audio) {
        if (this.album) {
            let albums = JSON.parse(localStorage.getItem("albums")) || {};
            albums[this.album] = albums[this.album] || [];

            if (!albums[this.album].some(a => a.id === audio.id)) { // Evitar duplicados
                albums[this.album].push(audio);
                localStorage.setItem("albums", JSON.stringify(albums));
            }
        } else {
            if (!this.audios.some(a => a.id === audio.id)) { // Evitar duplicados en "All Sounds"
                this.audios.push(audio);
                localStorage.setItem("customAudios", JSON.stringify(this.audios));
            }
        }
        this.render();
    }
}

customElements.define("sound-list", SoundList);

