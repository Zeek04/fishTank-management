const submitButton = document.getElementById('information-button');
const tankContainer = document.querySelector('.tank-container');

// Retrieve stored data on page load
window.addEventListener('load', () => {
    tankContainer.innerHTML = ""; // Clear before adding
    const savedTanks = JSON.parse(localStorage.getItem('fishTanks')) || [];
    savedTanks.forEach(addTankToDOM);
});

// Items will be stored in users' local storage and displayed when the submit button is triggered.
submitButton.addEventListener('click', () => {
    const gallon = document.getElementById('gallon-input').value.trim();
    const type = document.getElementById('water-option').value;
    const liveStock = document.getElementById('LiveStock-answer').value;

    if (!gallon || isNaN(gallon) || gallon <= 0) {
        return alert("Please enter a valid number of gallons.");
    }

    const newTank = { gallon, type, liveStock, id: Date.now() };

    const savedTanks = JSON.parse(localStorage.getItem('fishTanks')) || [];
    savedTanks.push(newTank);
    localStorage.setItem('fishTanks', JSON.stringify(savedTanks));

    // Add to DOM
    addTankToDOM(newTank);

    // Clear input fields
    document.getElementById('gallon-input').value = "";
});

function addTankToDOM(tank) {
    const tankDiv = document.createElement('div');
    tankDiv.classList.add('info-display');
    tankDiv.innerHTML = `
        <h2>Fish Tank</h2>
        <img src="fishTank.png" alt="fish tank">
        <p><strong>Gallons:</strong> ${tank.gallon}</p>
        <p><strong>Type:</strong> ${tank.type}</p>
        <p><strong>LiveStock:</strong> ${tank.liveStock}</p>
        <button class="remove-button" data-id="${tank.id}">Remove</button>
    `;

    // Add event listener for remove button
    tankDiv.querySelector('.remove-button').addEventListener('click', () => removeTank(tank.id, tankDiv));

    tankContainer.appendChild(tankDiv);
}

// Function to remove tank info
function removeTank(id, tankElement) {
    let savedTanks = JSON.parse(localStorage.getItem('fishTanks')) || [];
    savedTanks = savedTanks.filter(tank => tank.id !== id); // Remove the selected tank
    localStorage.setItem('fishTanks', JSON.stringify(savedTanks));

    tankElement.remove(); // Remove from DOM
}