const traineeNaam = document.getElementById("trainee-naam");
// window.onload = () => {
//     traineeNaamFunction();
//     console.log("onload");
// };
const traineeNaamFunction = () => {
    var urlString = window.location.href;
    var url = new URL(urlString);
    var urlId = url.searchParams.get("id");

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            trainee = JSON.parse(this.responseText);
            let welkomHtml = ``;
            traineeNaam.innerHTML = `Welkom, ${trainee.naam}!`;
        }
    }
    xhr.open("GET", `http://localhost:8082/api/trainee/${urlId}` , true);
    xhr.send();
}

traineeNaamFunction();