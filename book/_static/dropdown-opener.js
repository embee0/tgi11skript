document.addEventListener("DOMContentLoaded", () => {
    // Header-Buttons-Container finden
    const headerButtonsContainer = document.querySelector(".article-header-buttons");
    // Alle Dropdowns erfassen
    const dropdowns = document.querySelectorAll(".dropdown.admonition");

    if (!headerButtonsContainer || dropdowns.length <= 0) {
      console.info("[dropdown-opener]: Keine Dropdowns gefunden oder Header-Container nicht vorhanden.");
      return
    }

    const oeffnenText = "Alles ausklappen";
    const schliessenText = "Alles einklappen";

    // Button erstellen
    const toggleButton = document.createElement("button");
    toggleButton.id = "toggle-all-dropdowns";
    toggleButton.className = "btn btn-sm";
    toggleButton.setAttribute("data-bs-toggle", "tooltip");
    toggleButton.setAttribute("data-bs-placement", "bottom");

    // Standard-SVG-Icon hinzufügen (Klammer nach unten)
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="tb-icon toggle-all-icon" id="toggle-all-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    `;
    
    // Button in den Header-Container einfügen
    console.info("[dropdown-opener]: Dropdown-Button wird hinzugefügt.");
    headerButtonsContainer.prepend(toggleButton);

    // Alle geöffneten Dropdowns finden
    const getOpenedDropdowns = dropdowns => {
      return Array.from(dropdowns).filter(dropdown => {
        const targetId = dropdown.id;
        const toggleButton = document.querySelector(`[data-target="${targetId}"]`);
        return !dropdown.classList.contains("toggle-hidden") && toggleButton;
      });
    };

    // Tooltip-Instanz speichern
    let tooltipInstance = null;

    // Tooltip-Instanz initialisieren
    const initializeTooltip = () => {
        tooltipInstance = new bootstrap.Tooltip(toggleButton, {
            trigger: "hover", // Tooltip bleibt aktiv, bis die Maus den Button verlässt
        });
    };

    // Tooltip aktualisieren
    const updateTooltip = () => {
        if (tooltipInstance) {
            // Tooltip-Text aktualisieren
            const newTitle = toggleButton.getAttribute("data-bs-original-title");
            tooltipInstance._element.setAttribute("data-bs-original-title", newTitle);

            // Tooltip sofort wieder anzeigen
            const tooltipElement = tooltipInstance.tip;
            if (tooltipElement) {
                const tooltipInner = tooltipElement.querySelector('.tooltip-inner');
                if (tooltipInner) {
                    tooltipInner.textContent = newTitle;
                }
            }

            // Tooltip bleibt sichtbar, wenn er bereits angezeigt wird
            tooltipInstance.show();
        }
    };

    // Button-Zustand aktualisieren
    const updateButtonState = (inital) => {
        const openDropdowns = getOpenedDropdowns(dropdowns);

        // Icon wechseln
        const icon = document.getElementById("toggle-all-icon");
        if (openDropdowns.length === dropdowns.length) {
            toggleButton.setAttribute("aria-label", schliessenText);
            toggleButton.setAttribute("data-bs-original-title", schliessenText);
            icon.innerHTML = `<polyline points="6 15 12 9 18 15"></polyline>`; // Klammer nach oben
        } else {
            toggleButton.setAttribute("aria-label", oeffnenText);
            toggleButton.setAttribute("data-bs-original-title", oeffnenText);
            icon.innerHTML = `<polyline points="6 9 12 15 18 9"></polyline>`; // Klammer nach unten
        }

        // Tooltip aktualisieren
        if (!inital) {
          updateTooltip();
        }
    };

    // Alle Dropdowns öffnen oder schließen
    const toggleAllDropdowns = () => {
        const openDropdowns = getOpenedDropdowns(dropdowns);
        const isOpening = openDropdowns.length < dropdowns.length;

        dropdowns.forEach(dropdown => {
            const targetId = dropdown.id;
            const toggleButton = document.querySelector(`[data-target="${targetId}"]`);

            if (toggleButton) {
                const isHidden = dropdown.classList.contains("toggle-hidden");

                // Öffnen oder Schließen basierend auf dem Zustand
                if (isOpening && isHidden) {
                    toggleButton.click(); // Öffnen
                } else if (!isOpening && !isHidden) {
                    toggleButton.click(); // Schließen
                }
            }
        });

        updateButtonState();
    };

    const monitorDropdownState = () => {
        dropdowns.forEach(dropdown => {
            const targetId = dropdown.id;
            const toggleButton = document.querySelector(`[data-target="${targetId}"]`);

            if (toggleButton) {
                toggleButton.addEventListener("click", () => {
                    setTimeout(updateButtonState, 50); // Warte kurz, bis das Dropdown seinen Zustand ändert
                });
            }
        });
    };

    initializeTooltip();

    // Event-Listener für den Button
    toggleButton.addEventListener("click", () => {
        toggleAllDropdowns();
    });

    // Initialen Zustand des Buttons setzen
    updateButtonState(true);

    // Überwache den Zustand der Dropdowns
    monitorDropdownState();
});


