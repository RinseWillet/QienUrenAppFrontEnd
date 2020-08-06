const formulierenLijst = document.getElementById("form-list");
const formulierItem = document.querySelector(".list-group-item");
const formBody = document.getElementById("form-body");
const modalHeader = document.querySelector(".modal-title");
const klikbaarOogje = document.querySelector(".fa-eye");

const maandNummerNaarString = (maandNummer) => {
    switch(maandNummer) {
        case 0:
            return "Januari";
        case 1:
            return "Februari";
        case 2: 
            return "Maart";
        case 3:
            return "April";
        case 4:
            return "Mei";
        case 5:
            return "Juni";
        case 6:
            return "Juli";
        case 7:
            return "Augustus";
        case 8:
            return "September";
        case 9:
            return "Oktober";
        case 10:
            return "November";
        case 11:
            return "December";
    }
}

const laatFormulierenZien = () => {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        deFormulieren = JSON.parse(this.responseText);
        let inTeVoegenHTML = ``;
        if (xhr.readyState == 4) {
            if (deFormulieren.length > 0) {
                console.log("in de if");
                deFormulieren.forEach((e) => {
                    e.maand = maandNummerNaarString(e.maand);
                    
                    // inTeVoegenHTML = `<li data-toggle="modal" data-target="#staticBackdrop" href="./formulier.html?id=${e.id}" 
                    // class="list-group-item list-group-item-action" id="${e.id}">${e.naam} | ${e.maand} | ${e.jaar} | ${e.formulierstatus}</li>`;
                    inTeVoegenHTML = `<li data-toggle="modal" data-target="#staticBackdrop" 
                    class="list-group-item list-group-item-action d-flex justify-content-between"><span>Rinse Willet</span><span>${e.maand}</span><span>${e.jaar}</span><span>${e.formulierstatus}</span><i id="${e.id}" class="far fa-eye"></i></li>`;
                    formulierenLijst.insertAdjacentHTML('beforeend', inTeVoegenHTML);
                })
  
            } else {
                console.log("in de else");
            inTeVoegenHTML = `<div class="alert alert-danger" role="alert"><h4 class="alert-heading">Sapristi, geen formulieren!</h4>
                <p>tekst - veel plezier</p>
                <hr>
                <p class="mb-0">text - nog meer plezier.</p>
            </div>`;


              console.log(inTeVoegenHTML);
              formulierenLijst.insertAdjacentHTML('beforeend', inTeVoegenHTML);
            }
            // <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#staticBackdrop">
            //             Launch static backdrop modal
            //         </button>
        }
    }

    xhr.open("GET", "http://localhost:8082/api/formulier/all", true);
    xhr.send();
}

const genereerFormulier = (formulier) => {
    console.log(formulier.werkDagen)
    modalHeader.innerHTML = `Sjarl | ${formulier.maand}/${formulier.jaar}`
    for (let i = 0; i < formulier.werkDagen.length; i++) {
        formBody.insertAdjacentHTML("beforeend",
            `<tr id="dag-${i + 1}" class="formulier-rij">
            <th scope="row">${i + 1}</th>
            <td><class="form-input" id="opdracht-uren-${i + 1}">${formulier.werkDagen[i].opdrachtUren}</td>
            <td><class="form-input" id="overwerk-uren-${i + 1}">${formulier.werkDagen[i].overwerkUren}</td>
            <td><class="form-input" id="verlof-uren-${i + 1}">${formulier.werkDagen[i].verlofUren}</td>
            <td><class="form-input" id="ziekte-uren-${i + 1}">${formulier.werkDagen[i].ziekteUren}</td>
            <td><class="form-input" id="training-uren-${i + 1}">${formulier.werkDagen[i].trainingsUren}</td>
            <td><class="form-input" id="overig-uren-${i + 1}">${formulier.werkDagen[i].overigeUren}</td>
            <td class="form-verklaring"><class="form-input" id="verklaring-overig-${i + 1}">${formulier.werkDagen[i].overigeUrenUitleg}</td>
        </tr>`)
    }
}

const verwijderFormulier = () => {
    formBody.innerHTML = "";
}

function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}

formulierenLijst.onclick = function (event) {
    var target = getEventTarget(event);
    console.log(event.target);
    let id = target.id;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        let hetFormulier = JSON.parse(this.responseText);
        console.log(hetFormulier);
        if (xhr.readyState == 4) {
            verwijderFormulier();
            genereerFormulier(hetFormulier);
            console.log(hetFormulier)
        }
    }

    xhr.open("GET", `http://localhost:8082/api/formulier/${id}`, true);
    xhr.send();


};

// document.querySelectorAll('.list-group-item')
//         .forEach(el => el.attributes.href.value += window.location.search);

laatFormulierenZien();

