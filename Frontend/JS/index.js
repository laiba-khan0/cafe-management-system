const API = "https://musical-robot-q7xpp4j9xjwxc4gjj-5000.app.github.dev";

fetch(API)
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch API");
        }
        return response.json();
    })
    .then(data => {
        console.log(data)
    })
    .catch(err => {
        console.log(err.message);
    });