class PlaylistView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.albums = JSON.parse(localStorage.getItem("albums")) || {};
        this.currentAlbum = null; // Controla si estamos dentro de una playlist
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = "";

        if (this.currentAlbum) {
            this.renderAlbum();
        } else {
            this.renderAlbumList();
        }
    }

    renderAlbumList() {
        this.shadowRoot.innerHTML = `
            <style>
                .playlist-container {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    padding: 10px;
                }
                .album {
                    padding: 10px;
                    background: white;
                    border-radius: 10px;
                    cursor: pointer;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    font-weight: bold;
                }
                .album:hover {
                    background: #ffcc80;
                }
                .create-playlist {
                    display: flex;
                    gap: 5px;
                }
                input {
                    flex: 1;
                    padding: 5px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                button {
                    background: #4caf50;
                    border: none;
                    padding: 5px 10px;
                    color: white;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                }
            </style>

            <div class="playlist-container">
                <div class="create-playlist">
                    <input type="text" id="playlistName" placeholder="New Playlist Name">
                    <button id="createPlaylist">➕ Create</button>
                </div>
                ${Object.keys(this.albums).length === 0 
                    ? "<p>No playlists yet 😢</p>"
                    : Object.keys(this.albums)
                        .map(album => `<div class="album" data-album="${album}">${album}</div>`)
                        .join("")}
            </div>
        `;

        this.shadowRoot.querySelector("#createPlaylist").addEventListener("click", () => this.createPlaylist());

        this.shadowRoot.querySelectorAll(".album").forEach(albumElement => {
            albumElement.addEventListener("click", (event) => {
                this.currentAlbum = event.target.dataset.album;
                this.notifyPlaylistChange(); // 🔹 Notificar a ImportExport.js sobre la playlist seleccionada
                this.render();
            });
        });
        
    }

    notifyPlaylistChange() {
        console.log(`Cambiando a la playlist: ${this.currentAlbum}`); // 🔹 Verificar en la consola
        document.dispatchEvent(new CustomEvent("playlistChanged", { 
            detail: { album: this.currentAlbum } 
        }));
    }
    
    

    renderAlbum() {
        this.notifyPlaylistChange(); // 🔹 Notificar la playlist seleccionada
    
        this.shadowRoot.innerHTML = `
            <div class="album-view">
                <button class="back-button">⬅️ Back</button>
                <sound-list album="${this.currentAlbum}"></sound-list>
            </div>
        `;
    
        this.shadowRoot.querySelector(".back-button").addEventListener("click", () => {
            this.currentAlbum = null;
            this.render();
        });
    }
    
            
    createPlaylist() {
        const input = this.shadowRoot.querySelector("#playlistName");
        const playlistName = input.value.trim();
        if (playlistName && !this.albums[playlistName]) {
            this.albums[playlistName] = [];
            localStorage.setItem("albums", JSON.stringify(this.albums));
            this.render();
        }
    }
}

customElements.define("playlist-view", PlaylistView);



