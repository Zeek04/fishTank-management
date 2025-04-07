const submitButton = document.getElementById("information-button");
const tankContainer = document.querySelector(".tank-container");
const tankDropdown = document.getElementById("tank-selection");
const parameterSubmitButton = document.querySelector("#parameter-button");
const parameterContainer = document.querySelector(".tank_parameter_display");

window.addEventListener("load", () => {
    displaySavedTanks();
    updateParameterDisplay();
});

// Handle Adding a Tank
submitButton.addEventListener("click", () => {
    const gallon = document.getElementById("gallon-input").value.trim();
    const type = document.getElementById("water-option").value;
    const liveStock = document.getElementById("LiveStock-answer").value;

    if (!gallon || isNaN(gallon) || gallon <= 0) return alert("Enter valid gallons.");

    let savedTanks = JSON.parse(localStorage.getItem("fishTanks")) || [];
    const newTank = {
        id: Date.now(),
        name: `Fish Tank ${savedTanks.length + 1}`,
        gallon,
        type,
        liveStock,
        parameters: [] // Now an array
    };

    savedTanks.push(newTank);
    localStorage.setItem("fishTanks", JSON.stringify(savedTanks));

    addTankToDOM(newTank);
    addTankToDropdown(newTank);
    updateParameterDisplay();
});

// Display Saved Tanks
function displaySavedTanks() {
    const savedTanks = JSON.parse(localStorage.getItem("fishTanks")) || [];
    savedTanks.forEach((tank) => {
        addTankToDOM(tank);
        addTankToDropdown(tank);
    });
}

// Add Tank to DOM
function addTankToDOM(tank) {
    const tankDiv = document.createElement("div");
    tankDiv.classList.add("info-display");
    tankDiv.innerHTML = `
        <h2 class="tank-name">${tank.name}</h2>
        <img src='fishTank.png' alt="Fish Tank"/>
        <p><strong>Gallons:</strong> ${tank.gallon}</p>
        <p><strong>Type:</strong> ${tank.type}</p>
        <p><strong>LiveStock:</strong> ${tank.liveStock}</p>
        <button class="rename-button" data-id="${tank.id}">Rename</button>
        <button class="remove-button" data-id="${tank.id}">Remove</button>
    `;

    tankDiv.querySelector(".rename-button").addEventListener("click", () => renameTank(tank.id, tankDiv));
    tankDiv.querySelector(".remove-button").addEventListener("click", () => removeTank(tank.id, tankDiv));

    tankContainer.appendChild(tankDiv);
}

// Add Tank to Dropdown
function addTankToDropdown(tank) {
    const option = document.createElement("option");
    option.value = tank.id;
    option.textContent = tank.name;
    tankDropdown.appendChild(option);
}

// Remove Tank
function removeTank(id, tankDiv) {
    let savedTanks = JSON.parse(localStorage.getItem("fishTanks")) || [];
    savedTanks = savedTanks.filter((tank) => tank.id !== id);
    localStorage.setItem("fishTanks", JSON.stringify(savedTanks));

    tankDiv.remove();

    let dropdownOption = tankDropdown.querySelector(`option[value="${id}"]`);
    if (dropdownOption) {
        dropdownOption.remove();
    }

    updateParameterDisplay();
}

// Rename Tank
function renameTank(id, tankDiv) {
    let savedTanks = JSON.parse(localStorage.getItem("fishTanks")) || [];
    const tankIndex = savedTanks.findIndex((tank) => tank.id === id);

    if (tankIndex !== -1) {
        const newName = prompt("Enter a new name for your tank:", savedTanks[tankIndex].name);
        
        if (newName) {
            savedTanks[tankIndex].name = newName;
            localStorage.setItem("fishTanks", JSON.stringify(savedTanks));

            tankDiv.querySelector(".tank-name").innerText = newName;

            let dropdownOption = tankDropdown.querySelector(`option[value="${id}"]`);
            if (dropdownOption) {
                dropdownOption.textContent = newName;
            }

            updateParameterDisplay();
        }
    }
}

// Save Parameters (multiple entries)
parameterSubmitButton.addEventListener("click", () => {
    const dateValue = document.getElementById('date_selection').value;
    const phValue = document.getElementById("ph").value;
    const calValue = document.getElementById("cal").value;
    const alkValue = document.getElementById("alk").value;
    const phosValue = document.getElementById("phos").value;
    const nitrateValue = document.getElementById("nitrate").value;

    let savedTanks = JSON.parse(localStorage.getItem("fishTanks")) || [];
    let selectedTankId = tankDropdown.value;
    let selectedTank = savedTanks.find((tank) => tank.id == selectedTankId);

    if (!dateValue) {
        alert('Please enter a date');
        return;
    }

    if (selectedTank) {
        if (!Array.isArray(selectedTank.parameters)) {
            selectedTank.parameters = [];
        }

        const newParamEntry = {
            id: Date.now(),
            date: dateValue,
            ph: phValue,
            cal: calValue,
            alk: alkValue,
            phos: phosValue,
            nitrate: nitrateValue
        };

        selectedTank.parameters.push(newParamEntry);
        localStorage.setItem("fishTanks", JSON.stringify(savedTanks));

        updateParameterDisplay();
    }
});

// Display All Parameter Entries
function updateParameterDisplay() {
    parameterContainer.innerHTML = "";

    let savedTanks = JSON.parse(localStorage.getItem("fishTanks")) || [];
    let selectedTankId = tankDropdown.value;
    let selectedTank = savedTanks.find((tank) => tank.id == selectedTankId);

    if (selectedTank && Array.isArray(selectedTank.parameters)) {
        selectedTank.parameters.forEach((paramEntry) => {
            const parameterDiv = document.createElement('div');
            parameterDiv.classList.add('info-display');

            parameterDiv.innerHTML = `
                <h2>${selectedTank.name} - ${paramEntry.date}</h2>
                <p><strong>PH:</strong> ${paramEntry.ph || "N/A"}</p>
                <p><strong>CAL:</strong> ${paramEntry.cal || "N/A"}</p>
                <p><strong>ALK:</strong> ${paramEntry.alk || "N/A"}</p>
                <p><strong>PHOS:</strong> ${paramEntry.phos || "N/A"}</p>
                <p><strong>NITRATE:</strong> ${paramEntry.nitrate || "N/A"}</p>
                <button class="remove-button">Remove</button>
            `;

            parameterDiv.querySelector(".remove-button").addEventListener("click", () => {
                removeParameterEntry(selectedTankId, paramEntry.id);
            });

            parameterContainer.appendChild(parameterDiv);
        });
    }
}

// Remove one parameter entry
function removeParameterEntry(tankId, entryId) {
    let savedTanks = JSON.parse(localStorage.getItem("fishTanks")) || [];
    let selectedTank = savedTanks.find((tank) => tank.id == tankId);

    if (selectedTank && Array.isArray(selectedTank.parameters)) {
        selectedTank.parameters = selectedTank.parameters.filter(entry => entry.id !== entryId);
        localStorage.setItem("fishTanks", JSON.stringify(savedTanks));
        updateParameterDisplay();
    }
}

// Update display when selecting a different tank
tankDropdown.addEventListener("change", updateParameterDisplay);
