export default class TabsNavigation extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Definir las pestañas disponibles
        this.tabs = [
            { id: "all", label: "All Sounds" },
            { id: "playlist", label: "Your Playlist" },
        ];

        this.activeTab = "all"; // Pestaña activa por defecto
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
            .tabs {
                display: flex;
                justify-content: space-around;
                padding: 30px 0;
            }

            button {
                border: none;
                background: none;
                font-size: 14px;
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s ease-in-out;
                margin: 0 20px; /* Añadir margen horizontal para más distancia */
            }

            button.active {
                border-bottom: 2px solid black;
            }
            </style>

            <nav class="tabs">
            ${this.tabs.map(tab => `
                <button class="${tab.id === this.activeTab ? "active" : ""}" data-tab="${tab.id}">
                ${tab.label}
                </button>
            `).join("")}
            </nav>
        `;
    }

    

    addEventListeners() {
        this.shadowRoot.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", (event) => this.changeTab(event));
        });
    }

    changeTab(event) {
        const selectedTab = event.target.getAttribute("data-tab");

        if (selectedTab !== this.activeTab) {
            this.activeTab = selectedTab;

            // Actualizar clases de los botones
            this.shadowRoot.querySelectorAll("button").forEach(button => {
                button.classList.toggle("active", button.getAttribute("data-tab") === this.activeTab);
            });

            // Emitir evento para que otros componentes (como sound-list) lo escuchen
            this.dispatchEvent(new CustomEvent("tabChanged", {
                detail: { selectedTab: this.activeTab },
                bubbles: true,
                composed: true
            }));
        }
    }
}

// Registrar el Web Component
customElements.define("tabs-navigation", TabsNavigation);
