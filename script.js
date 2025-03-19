const submitButton = document.getElementById("information-button");
const tankContainer = document.querySelector(".tank-container");
const tankDropdown = document.getElementById("tank-selection");
const parameterSubmitButton = document.querySelector("#parameter-button");
const parameterContainer = document.querySelector(".tank_parameter_display");

// Load Tanks & Parameters on Page Load
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
    const newTank = { id: Date.now(), name: `Fish Tank ${savedTanks.length + 1}`, gallon, type, liveStock };

    savedTanks.push(newTank);
    localStorage.setItem("fishTanks", JSON.stringify(savedTanks));

    addTankToDOM(newTank);
    addTankToDropdown(newTank);
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

    // Rename & Remove Event Listeners
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

// Rename Tank
function renameTank(id, tankDiv) {
    let savedTanks = JSON.parse(localStorage.getItem("fishTanks")) || [];
    const tankIndex = savedTanks.findIndex((tank) => tank.id === id);

    if (tankIndex !== -1) {
        const newName = prompt("Enter a new name for your tank:", savedTanks[tankIndex].name);
        
        if (newName) {
            savedTanks[tankIndex].name = newName;
            localStorage.setItem("fishTanks", JSON.stringify(savedTanks));

            // Update name in DOM
            tankDiv.querySelector(".tank-name").innerText = newName;

            // Update name in dropdown
            let dropdownOption = tankDropdown.querySelector(`option[value="${id}"]`);
            if (dropdownOption) {
                dropdownOption.textContent = newName;
            }

            // Refresh parameter display with updated name
            updateParameterDisplay();
        }
    }
}

// Remove Tank
function removeTank(id, tankDiv) {
    let savedTanks = JSON.parse(localStorage.getItem("fishTanks")) || [];
    let savedParameters = JSON.parse(localStorage.getItem("tankParameters")) || {};

    // Remove tank from savedTanks and savedParameters
    savedTanks = savedTanks.filter((tank) => tank.id !== id);
    delete savedParameters[id];

    // Update localStorage
    localStorage.setItem("fishTanks", JSON.stringify(savedTanks));
    localStorage.setItem("tankParameters", JSON.stringify(savedParameters));

    // Remove tank div and dropdown option
    tankDiv.remove();
    let dropdownOption = tankDropdown.querySelector(`option[value="${id}"]`);
    if (dropdownOption) dropdownOption.remove();

    // Update parameter display after removal
    updateParameterDisplay();
}

// Handle Parameter Submission
parameterSubmitButton.addEventListener("click", () => {
    const selectedTank = tankDropdown.value;
    const date = document.getElementById("date_selection").value;
    const ph = document.getElementById('ph').value;
    const cal = document.getElementById('cal').value;
    const alk = document.getElementById('alk').value;
    const phos = document.getElementById('phos').value;
    const nitrate = document.getElementById('nitrate').value;
    
    if (!selectedTank || !date) return alert("Select a tank and date.");

    let savedParameters = JSON.parse(localStorage.getItem("tankParameters")) || {};
    
    if (!savedParameters[selectedTank]) {
        savedParameters[selectedTank] = [];
    }

    const newEntry = { date, ph, cal, alk, phos, nitrate };
    
    savedParameters[selectedTank].push(newEntry);
    localStorage.setItem("tankParameters", JSON.stringify(savedParameters));

    updateParameterDisplay();
});

// Update Parameter Display Based on Selected Tank
function updateParameterDisplay() {
    parameterContainer.innerHTML = "";
    const selectedTank = tankDropdown.value;
    let savedParameters = JSON.parse(localStorage.getItem("tankParameters")) || {};

    if (savedParameters[selectedTank]) {
        savedParameters[selectedTank].forEach((entry) => {
            displayParameterEntry(selectedTank, entry);
        });
    }
}

// Display Parameter Entry
function displayParameterEntry(tankId, entry) {
    const div = document.createElement("div");
    div.classList.add("info-display");
    div.innerHTML = `
        <h2>${getTankNameById(tankId)}</h2>
        <p><strong>Date:</strong> ${entry.date}</p>
        <p><strong>PH:</strong> ${entry.ph}</p>
        <p><strong>CAL:</strong> ${entry.cal}</p>
        <p><strong>ALK/DKH:</strong> ${entry.alk}</p>
        <p><strong>PHOS:</strong> ${entry.phos}</p>
        <p><strong>NITRATE:</strong> ${entry.nitrate}</p>
    `;
    parameterContainer.appendChild(div);
}

// Get Tank Name by ID
function getTankNameById(id) {
    const savedTanks = JSON.parse(localStorage.getItem("fishTanks")) || [];
    const tank = savedTanks.find((tank) => tank.id === parseInt(id));
    return tank ? tank.name : "Unknown Tank";
}
