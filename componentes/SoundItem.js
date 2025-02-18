export default class SoundItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Obtener atributos
        this.audioId = this.getAttribute("audio-id") || "";
        this.audioSrc = this.getAttribute("audio-src") || "";
        this.image = this.getAttribute("image") || "assets/images/default.jpg";
        this.title = this.getAttribute("title") || "";
        this.duration = "Loading..."; // Se actualizará cuando se cargue el audio

        // Crear instancia de Audio
        this.audio = new Audio(this.audioSrc);
    }

    connectedCallback() {
        this.loadAudioMetadata(); // Cargar duración real del audio
        this.render();
        this.addEventListeners();
    }

    render() {
        const favoriteClass = this.isFavorite ? "favorite" : "";

        this.shadowRoot.innerHTML = `
            <style>
                .sound-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: white;
                    border-radius: 15px;
                    padding: 10px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    margin-bottom: 12px;
                    width: 100%;
                }

                img {
                    width: 50px;
                    height: 50px;
                    border-radius: 10px;
                }

                .sound-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-grow: 1;
                }

                button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1.2em;
                }

                .favorite {
                    color: red;
                }

                .duration {
                    font-size: 0.9em;
                    color: #666;
                }
            </style>

            <div class="sound-item">
                <img src="${this.image}" alt="${this.title}">
                <div class="sound-info">
                    <button id="play">▶</button>
                    <span>${this.title}</span>
                </div>
                <span class="duration" id="duration">${this.duration}</span>
                <button id="favorite" class="${favoriteClass}">❤️</button>
            </div>
        `;
    }

    addEventListeners() {
        this.shadowRoot.querySelector("#play").addEventListener("click", () => this.togglePlay());
        this.audio.onloadedmetadata = () => {
            this.duration = `${Math.floor(this.audio.duration)}s`;
            this.shadowRoot.querySelector("#duration").textContent = this.duration;
        };
    }

    togglePlay() {
        if (this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
    }

    loadAudioMetadata() {
        this.audio.onloadedmetadata = () => {
            this.duration = `${Math.floor(this.audio.duration)}s`;
            if (this.shadowRoot.querySelector("#duration")) {
                this.shadowRoot.querySelector("#duration").textContent = this.duration;
            }
        };
    }
}

customElements.define("sound-item", SoundItem);

