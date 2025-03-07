const infoContainer = document.querySelector('.info-display');
const removeButton = document.getElementById('remove');
const submitButton = document.getElementById('information-button');

//Items will be stored in users local storage and be displayed when the submit button is triggered.
submitButton.addEventListener('click', () => {
    const inputs = {
        gallon: document.getElementById('gallon-input').value.trim(),
        type: document.getElementById('water-option').value,
        liveStock: document.getElementById('LiveStock-answer').value
    };

    if (!inputs.gallon || isNaN(inputs.gallon) || inputs.gallon <= 0) {
        return alert("Please enter a valid number of gallons.");
    }

    localStorage.setItem('fishTankData', JSON.stringify(inputs));

    updateDisplay(inputs);
});

// Function to update the display
function updateDisplay(data) {
    Object.keys(data).forEach(key => {
        document.getElementById(key).innerText = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${data[key]}`;
    });

    infoContainer.style.display = 'flex';
}

// Function to remove tank info
function removeTank() {
    removeButton.addEventListener('click', () => {
        localStorage.removeItem('fishTankData'); // Clear stored data
        infoContainer.style.display = 'none'; // Hide display
    });
}

// Retrieve stored data on page load
window.addEventListener('load', () => {
    const savedData = JSON.parse(localStorage.getItem('fishTankData'));
    if (savedData) {
        updateDisplay(savedData);
    }
});

// Set up remove button event listener once
removeTank();