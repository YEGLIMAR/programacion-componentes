export default class SoundItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.audioId = this.getAttribute("audio-id") || "";
        this.audioSrc = this.getAttribute("audio-src") || "";
        this.image = this.getAttribute("image") || "assets/images/default.jpg";
        this.title = this.getAttribute("title") || "";
        this.duration = "Loading...";
        this.audio = new Audio(this.audioSrc);
        this.isPlaying = false;
    }

    connectedCallback() {
        this.loadAudioMetadata();
        this.render();
        this.addEventListeners();
    }

    render() {
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
                .duration {
                    font-size: 0.9em;
                    color: #666;
                }
                button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1.2em;
                }
                input[type="checkbox"] {
                    transform: scale(1.5);
                    margin-left: 20px;
                   
                }
            </style>

            <div class="sound-item">
                <input type="checkbox" class="select-audio">
                <img src="${this.image}" alt="${this.title}">
                <div class="sound-info">
                    <button id="play">▶</button>
                    <span>${this.title}</span>
                </div>
                <span class="duration" id="duration">${this.duration}</span>
            </div>
        `;
    }

    addEventListeners() {
        const playButton = this.shadowRoot.querySelector("#play");

        playButton.addEventListener("click", () => this.togglePlay());

        this.audio.onloadedmetadata = () => {
            this.duration = `${Math.floor(this.audio.duration)}s`;
            this.shadowRoot.querySelector("#duration").textContent = this.duration;
        };

        this.audio.onended = () => {
            this.isPlaying = false;
            playButton.textContent = "▶";
        };

        document.addEventListener("stopAllAudios", (event) => {
            if (event.detail !== this.audioId) {
                this.audio.pause();
                this.isPlaying = false;
                playButton.textContent = "▶";
            }
        });

        this.shadowRoot.querySelector(".select-audio").addEventListener("change", (event) => {
            document.dispatchEvent(new CustomEvent("audioSelectionChanged", {
                detail: { 
                    id: this.audioId, 
                    selected: event.target.checked, 
                    src: this.audioSrc,
                    title: this.title
                }
            }));
        });
    }

    togglePlay() {
        const playButton = this.shadowRoot.querySelector("#play");

        if (this.audio.paused) {
            document.dispatchEvent(new CustomEvent("stopAllAudios", { detail: this.audioId }));
            this.audio.play();
            this.isPlaying = true;
            playButton.textContent = "⏹"; // Cambia a icono de stop
        } else {
            this.audio.pause();
            this.isPlaying = false;
            playButton.textContent = "▶"; // Cambia a icono de play
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


