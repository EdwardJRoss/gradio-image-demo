// Change this to your classification URL
const classificationEndpoint = "https://hf.space/embed/jph00/testing/+/api/predict/"

function dataUrlFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        reader.readAsDataURL(file);
    });
}

// Send the image to the server for classification
function classifyImage(dataUrl) {
    const jsonData = {"data": [dataUrl]}
    const jsonDataString = JSON.stringify(jsonData);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const request = new Request(classificationEndpoint, {
        method: 'POST',
        headers: headers,
        body: jsonDataString
    });
    return fetch(request).then(response => response.json());
}

function formatAsPercentage(number, digits) {
    return (number * 100).toFixed(digits) + "%";
}

function formatPredictionText(prediction) {
    const predictionData = prediction.data[0];
    const confidence = predictionData.confidences[0]['confidence']
    return `${predictionData.label}: ${formatAsPercentage(confidence, 2)} confidence`;
}

// When an image is selected, update the UI and get the prediction
const selectElement = document.getElementById('image-file');
selectElement.addEventListener('change', (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        const file = files[0];
        // Set image-preview to file data
        dataUrlFromFile(file).then((dataUrl) => {
            document.getElementById('image-preview').src = dataUrl;
            // Update the prediction text with the classification result
            classifyImage(dataUrl).then((prediction) => {
                console.log(prediction);
                document.getElementById('prediction-text').innerText = formatPredictionText(prediction);
            });
        });
    }
});
