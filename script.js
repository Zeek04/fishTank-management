document.getElementById('information-button').addEventListener('click', () => {
    const inputs = {
        gallon: document.getElementById('gallon-input').value.trim(),
        type: document.getElementById('water-option').value,
        liveStock: document.getElementById('LiveStock-answer').value
    };

    // Validate gallon input (must be a positive number)
    if (!inputs.gallon || isNaN(inputs.gallon) || inputs.gallon <= 0) {
        return alert("Please enter a valid number of gallons.");
    }

    localStorage.setItem('fishTankData' , JSON.stringify(inputs));

    updateDisplay(inputs);
});

function updateDisplay(data){
    // Loop through keys and update corresponding elements
    Object.keys(data).forEach(key => {
        document.getElementById(key).innerText = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${data[key]}`;
    });
}

window.addEventListener('load', () => {
    const savedData = JSON.parse(localStorage.getItem('fishTankData'))
    if(savedData){
        updateDisplay(savedData);
    }
})