const submitButton = document.getElementById("information-button");
const tankContainer = document.querySelector(".tank-container");
const tankDropdown = document.getElementById("tank-selection"); 

// Retrieve stored data on page load
window.addEventListener("load", () => {
  tankContainer.innerHTML = ""; // Clear before adding
  tankDropdown.innerHTML = '<option value="">Select a Tank</option>'; // Reset dropdown
  
  const savedTanks = JSON.parse(localStorage.getItem("fishTanks")) || [];
  savedTanks.forEach((tank) => {
    addTankToDOM(tank);
    addTankToDropdown(tank);
  });
});

// Get the last used tank ID, default to 0 if not set
let lastTankId = parseInt(localStorage.getItem("lastTankId")) || 0;

// Items will be stored in users' local storage and displayed when the submit button is triggered.
submitButton.addEventListener("click", () => {
  const gallon = document.getElementById("gallon-input").value.trim();
  const type = document.getElementById("water-option").value;
  const liveStock = document.getElementById("LiveStock-answer").value;

  if (!gallon || isNaN(gallon) || gallon <= 0) {
    return alert("Please enter a valid number of gallons.");
  }

  lastTankId++;
  localStorage.setItem("lastTankId", lastTankId); // Save updated ID

  const newTank = { id: lastTankId, name: `Fish Tank ${lastTankId}`, gallon, type, liveStock };

  const savedTanks = JSON.parse(localStorage.getItem("fishTanks")) || [];
  savedTanks.push(newTank);
  localStorage.setItem("fishTanks", JSON.stringify(savedTanks));

  // Add to DOM & dropdown
  addTankToDOM(newTank);
  addTankToDropdown(newTank);

  document.getElementById("gallon-input").value = "";
});

// Function to add tank to the DOM
function addTankToDOM(tank) {
  const tankDiv = document.createElement("div");
  tankDiv.classList.add("info-display");
  tankDiv.innerHTML = `
        <h2 class="tank-name">${tank.name}</h2>
        <img src="fishTank.png" alt="fish tank">
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

// Function to add tank to dropdown
function addTankToDropdown(tank) {
  const option = document.createElement("option");
  option.value = tank.id;
  option.textContent = tank.name;
  tankDropdown.appendChild(option);
}

// Function to rename a tank
function renameTank(id, tankDiv) {
  let savedTanks = JSON.parse(localStorage.getItem("fishTanks")) || [];
  const tankIndex = savedTanks.findIndex((tank) => tank.id === id);

  if (tankIndex !== -1) {
    const newName = prompt("Enter a new name for your tank:", savedTanks[tankIndex].name);
    
    if (newName) {
      savedTanks[tankIndex].name = newName;
      localStorage.setItem("fishTanks", JSON.stringify(savedTanks));

      // ✅ Update name in the DOM
      tankDiv.querySelector(".tank-name").innerText = newName;

      // ✅ Update the dropdown selection
      let dropdownOption = tankDropdown.querySelector(`option[value="${id}"]`);
      if (dropdownOption) {
        dropdownOption.textContent = newName;
      }
    }
  }
}

// Function to remove a tank
function removeTank(id, tankElement) {
  let savedTanks = JSON.parse(localStorage.getItem("fishTanks")) || [];
  savedTanks = savedTanks.filter((tank) => tank.id !== id); // Remove the selected tank
  localStorage.setItem("fishTanks", JSON.stringify(savedTanks));

  tankElement.remove(); // Remove from DOM

  // Remove from dropdown
  let dropdownOption = tankDropdown.querySelector(`option[value="${id}"]`);
  if (dropdownOption) {
    dropdownOption.remove();
  }
}
