import "./TabsNavigation.js";
import "./ImportExport.js";
import "./SoundList.js";
import "./PlayList.js";

export default class SoundBoard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        document.addEventListener("tabChanged", (event) => this.changeTab(event.detail.selectedTab));

    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 100vh;
                    overflow: hidden;
                }

                .soundboard {
                    display: flex;
                    flex-direction: column;
                    justify-content: start;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(45deg, #ff0080, #ffcc00, #ff4500);
                    background-size: cover;
                    padding-bottom: 20px;
                }

                .header {
                    width: 100%;
                    background:rgb(222, 95, 4);
                    padding: 20px 0;
                    text-align: center;
                    color: white;
                    font-size: 30px;
                    font-weight: bold;
                    text-transform: uppercase;
                }

                .content {
                    width: 100%;
                    max-width: 600px;
                    padding: 10px;
                }
            </style>

            <div class="soundboard">
                <div class="header">SOUNDBOARD <br> <span style="font-size:14px;">CLASSIC</span></div>
                <tabs-navigation></tabs-navigation>
                <import-export></import-export>
                <div class="content" id="content">
                    <sound-list></sound-list> <!-- Por defecto mostramos All Sounds -->
                   
            </div>
        `;

        document.addEventListener("tabChanged", (event) => this.changeTab(event.detail.selectedTab));
    }

    changeTab(selectedTab) {
        const content = this.shadowRoot.querySelector("#content");
        content.innerHTML = "";

        if (selectedTab === "playlist") {
            content.appendChild(document.createElement("playlist-view"));
        } else {
            content.appendChild(document.createElement("sound-list"));
        }
    }
}

customElements.define("sound-board", SoundBoard);

