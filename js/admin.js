const formulierenLijst = document.getElementById("form-list");
const medewerkerLijst = document.getElementById("medewerker-list");
const bedrijvenLijst = document.getElementById("bedrijven-list");
const formulierItem = document.querySelector(".list-group-item");
const formBody = document.getElementById("form-body");
const modalHeader = document.querySelector(".modal-title");
const klikbaarOogje = document.querySelector(".fa-eye");
const goedkeurKnopje = document.getElementById("goedkeuren");
const afkeurKnopje = document.getElementById("afkeuren");
const relatieAanmakenKnop = document.getElementById("knop-relatie-aanmaken");
const toevoegenGebruikerContainer = document.getElementById("toevoegen-gebruiker-container");
const selectTrainee = document.getElementById("trainee-select");
const selectContactPersoon = document.getElementById("contactpersoon-select");

const maandNummerNaarString = (maandNummer) => {
    switch (maandNummer) {
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

/*
FORMULIEREN
*/

const laatFormulierenZien = () => {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            deFormulieren = JSON.parse(this.responseText);
            let inTeVoegenHTML = ``;

            if (deFormulieren.length > 0) {
                deFormulieren.forEach((e) => {
                    e.maand = maandNummerNaarString(e.maand);

                    // inTeVoegenHTML = `<li data-toggle="modal" data-target="#staticBackdrop" href="./formulier.html?id=${e.id}" 
                    // class="list-group-item list-group-item-action" id="${e.id}">${e.naam} | ${e.maand} | ${e.jaar} | ${e.formulierstatus}</li>`;
                    inTeVoegenHTML = `<li data-toggle="modal" data-target="#staticBackdrop" 
                    class="list-group-item list-group-item-action d-flex justify-content-between" id="${e.id}"><span id="${e.id}">Rinse Willet</span><span id="${e.id}">${e.maand}</span><span id="${e.id}">${e.jaar}</span><span id="${e.id}">${e.formulierStatus}</span><i id="${e.id}" class="far fa-eye"></i></li>`;
                    formulierenLijst.insertAdjacentHTML('beforeend', inTeVoegenHTML);
                })
            } else {
                inTeVoegenHTML = `<div class="alert alert-danger" role="alert"><h4 class="alert-heading">Sapristi, geen formulieren!</h4>
                <p>tekst - veel plezier</p>
                <hr>
                <p class="mb-0">text - nog meer plezier.</p>
            </div>`;

                formulierenLijst.insertAdjacentHTML('beforeend', inTeVoegenHTML);
            }
        }
    }

    xhr.open("GET", "http://localhost:8082/api/formulier/all", true);
    xhr.send();
}

const genereerFormulier = (formulier) => {
    formulier.maand = maandNummerNaarString(formulier.maand);
    modalHeader.innerHTML = `Rinse Willet | ${formulier.maand}/${formulier.jaar}`
    for (let i = 0; i < formulier.werkDagen.length; i++) {
        formBody.insertAdjacentHTML("beforeend",
            `<tr id="dag-${i + 1}" class="formulier-rij">
            <th scope="row">${i + 1}</th>
            <td class="admin-opmaak" id="opdracht-uren-${i + 1}">${formulier.werkDagen[i].opdrachtUren}</td>
            <td class="admin-opmaak"id="overwerk-uren-${i + 1}">${formulier.werkDagen[i].overwerkUren}</td>
            <td class="admin-opmaak"id="verlof-uren-${i + 1}">${formulier.werkDagen[i].verlofUren}</td>
            <td class="admin-opmaak" id="ziekte-uren-${i + 1}">${formulier.werkDagen[i].ziekteUren}</td>
            <td class="admin-opmaak"id="training-uren-${i + 1}">${formulier.werkDagen[i].trainingsUren}</td>
            <td class="admin-opmaak"id="overig-uren-${i + 1}">${formulier.werkDagen[i].overigeUren}</td>
            <td class="admin-opmaak form-verklaring"><class="form-input" id="verklaring-overig-${i + 1}">${formulier.werkDagen[i].overigeUrenUitleg}</td>
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
    let id = target.id;
    let hetFormulier;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            hetFormulier = JSON.parse(this.responseText);
            verwijderFormulier();
            genereerFormulier(hetFormulier);
        }
    }

    xhr.open("GET", `http://localhost:8082/api/formulier/${id}`, true);
    xhr.send();

    goedkeurKnopje.addEventListener('click', () => {

        xhr.open("PUT", `http://localhost:8082/api/formulier/update/statusgoed/${id}`, true);
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                location.reload();
            }
        }
    })
    afkeurKnopje.addEventListener('click', () => {

        xhr.open("PUT", `http://localhost:8082/api/formulier/update/statusfout/${id}`, true);
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                location.reload();
            }
        }
    })




};

/*
MEDEWERKERS
*/

const laatMedewerkersZien = () => {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            deMedewerkers = JSON.parse(this.responseText);
            let inTeVoegenHTML = ``;

            if (deMedewerkers.length > 0) {
                deMedewerkers.forEach((e) => {
                    // Als trainee geen opdrachtgever heeft dan veranderen naar "Niet geplaatst"
                    if (e.type === "Trainee" && e.opdrachtgever === null) {
                        e.opdrachtgever = {
                            "naam": "Niet geplaatst"
                        }
                    } else if (e.type === "InterneMedewerker") {
                        e.type = "Interne Medewerker";
                        e.opdrachtgever = {
                            "naam": "Qien"
                        }
                    }
                    inTeVoegenHTML = `<li data-toggle="modal" data-target="#staticBackdrop" 
                    class="list-group-item list-group-item-action d-flex justify-content-between" id="${e.id}"><span id="${e.id}">${e.naam}</span><span id="${e.id}">${e.opdrachtgever.naam}</span><span id="${e.id}">${e.type}</span><i id="${e.id}" class="far fa-eye"></i></li>`;
                    medewerkerLijst.insertAdjacentHTML('beforeend', inTeVoegenHTML);
                })

            } else {
                inTeVoegenHTML = `<div class="alert alert-danger" role="alert"><h4 class="alert-heading">Sapristi, geen medewerkers!</h4>
                <p>tekst - veel plezier</p>
                <hr>
                <p class="mb-0">text - nog meer plezier.</p>
            </div>`;

                medewerkerLijst.insertAdjacentHTML('beforeend', inTeVoegenHTML);
            }
        }
    }

    xhr.open("GET", "http://localhost:8082/api/admin/medewerker/all", true);
    xhr.send();
}

/*
BEDRIJVEN
*/

const laatBedrijvenZien = () => {
    let xhr = new XMLHttpRequest();


    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            deBedrijven = JSON.parse(this.responseText);
            let inTeVoegenHTML = ``;

            if (deBedrijven.length > 0) {
                deBedrijven.forEach((e) => {
                    // Als bedrijf geen contactpersoon heeft dan veranderen naar "Niet gekoppeld"
                    if (e.contactPersoon === null) {
                        e.contactPersoon = {
                            "naam": "Niet gekoppeld"
                        }
                    }


                    inTeVoegenHTML = `<li data-toggle="modal" data-target="#staticBackdrop" 
                    class="list-group-item list-group-item-action d-flex justify-content-between" id="${e.id}"><span id="${e.id}">${e.naam}</span><span id="${e.id}">${e.contactPersoon.naam}</span><i id="${e.id}" class="far fa-eye"></i></li>`;
                    bedrijvenLijst.insertAdjacentHTML('beforeend', inTeVoegenHTML);
                })

            } else {
                inTeVoegenHTML = `<div class="alert alert-danger" role="alert"><h4 class="alert-heading">Sapristi, geen bedrijven!</h4>
                <p>tekst - veel plezier</p>
                <hr>
                <p class="mb-0">text - nog meer plezier.</p>
            </div>`;

                bedrijvenLijst.insertAdjacentHTML('beforeend', inTeVoegenHTML);
            }
        }
    }

    xhr.open("GET", "http://localhost:8082/api/admin/bedrijf/all", true);
    xhr.send();
}

/*
RELATIE AANMAKEN
*/


const interneMedewerkerRadio = document.getElementById("radio-interne-mw");
const traineeRadio = document.getElementById("radio-trainee");
const bedrijfRadio = document.getElementById("radio-bedrijf");

const bedrijfNaam = document.getElementById("bedrijf-naam");
const bedrijfEmail = document.getElementById("bedrijf-email");
const bedrijfTelefoon = document.getElementById("bedrijf-telefoon");
const bedrijfStraatNaamEnNr = document.getElementById("bedrijf-straatnaamennummer");
const bedrijfPostCode = document.getElementById("bedrijf-postcode");
const bedrijfWoonplaats = document.getElementById("bedrijf-woonplaats");

const contactPersoonRadio = document.getElementById("radio-contactpersoon");

relatieAanmakenKnop.addEventListener("click", () => {
    var xhr = new XMLHttpRequest();
    if (interneMedewerkerRadio.checked) {
        const interneMedewerkerNaam = document.getElementById("interne-mw-naam");
        const interneMedewerkerEmail = document.getElementById("interne-mw-email");
        const interneMedewerkerTelefoon = document.getElementById("interne-mw-telefoon");
        const interneMedewerkerStraatNaamEnNr = document.getElementById("interne-mw-straatnaamennummer");
        const interneMedewerkerPostcode = document.getElementById("interne-mw-postcode");
        const interneMedewerkerWoonPlaats = document.getElementById("interne-mw-woonplaats");
        const interneMedewerkerStartDatum = document.getElementById("interne-mw-startdatum");
        const interneMedewerkerEindDatum = document.getElementById("interne-mw-einddatum");

        let typeRelatie = interneMedewerkerRadio.value;
        let naam = interneMedewerkerNaam.value;
        let email = interneMedewerkerEmail.value;
        let tel = interneMedewerkerTelefoon.value;
        let straatNaamEnNr = interneMedewerkerStraatNaamEnNr.value;
        let postCode = interneMedewerkerPostcode.value;
        let woonPlaats = interneMedewerkerWoonPlaats.value;
        let startDatum = interneMedewerkerStartDatum.value;
        let eindDatum = interneMedewerkerEindDatum.value;

        let interneMedewerkerJSON = {};
        interneMedewerkerJSON.type = typeRelatie;
        interneMedewerkerJSON.naam = naam;
        interneMedewerkerJSON.emailadres = email;
        interneMedewerkerJSON.telefoonnr = tel;
        interneMedewerkerJSON.straatNaamNr = straatNaamEnNr;
        interneMedewerkerJSON.postcode = postCode;
        interneMedewerkerJSON.woonplaats = woonPlaats;
        interneMedewerkerJSON.startDatum = startDatum;
        interneMedewerkerJSON.eindDatum = eindDatum;


        xhr.open("POST", "http://localhost:8082/api/admin/internemedewerker/nieuw", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        console.log(interneMedewerkerNaam.value)
        console.log(interneMedewerkerJSON);
        console.log(JSON.stringify(interneMedewerkerJSON));

        xhr.send(JSON.stringify(interneMedewerkerJSON));
    }
    if (bedrijfRadio.checked) {

    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            location.reload();
        }
    }

})

const radios = document.querySelectorAll(".form-check-input")
var prev = null;
for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', function () {
        (prev) ? prev.value : null;
        if (this !== prev) {
            prev = this;
        }
        if (this.value == "Trainee") {
            toevoegenGebruikerContainer.innerHTML = `<h1>trainee</h1>`
        } else if (this.value == "Bedrijf") {
            toevoegenGebruikerContainer.innerHTML = `<div class="bedrijf-form">
            <div class="row">
                <div class="col-4">
                    <div class="form-group">
                        <label for="bedrijf-naam">Naam</label>
                        <input type="text" class="form-control" id="bedrijf-naam"
                            placeholder="Naam bedrijf">
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-group">
                        <label for="bedrijf-email">Email address</label>
                        <input type="email" class="form-control" id="bedrijf-email"
                            placeholder="info@bedrijf.nl">
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-group">
                        <label for="bedrijf-telefoon">Telefoonnummer</label>
                        <input type="telnum" class="form-control"
                            id="bedrijf-telefoon" placeholder="+31 6 00000000">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-4">
                    <div class="form-group">
                        <label for="bedrijf-straatnaamennummer">Adres</label>
                        <input type="text" class="form-control"
                            id="bedrijf-straatnaamennummer"
                            placeholder="Atoomweg 350B">
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-group">
                        <label for="bedrijf-postcode">Postcode</label>
                        <input type="text" class="form-control"
                            id="bedrijf-postcode" placeholder="3542AB">
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-group">
                        <label for="bedrijf-woonplaats">Woonplaats</label>
                        <input type="text" class="form-control"
                            id="bedrijf-woonplaats" placeholder="Utrecht">
                    </div>
                </div>
            </div>
        </div>`
        } else if (this.value == "ContactPersoon") {
            toevoegenGebruikerContainer.innerHTML = `<h1>contactpersoon</h1>`
        } else {
            toevoegenGebruikerContainer.innerHTML = `<div class="interne-mw-form">
            <div class="row">
                <div class="col-4">
                    <div class="form-group">
                        <label for="interne-mw-naam">Naam</label>
                        <input type="text" class="form-control"
                            id="interne-mw-naam"
                            placeholder="Naam medewerker">
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-group">
                        <label for="interne-mw-email">Email address</label>
                        <input type="email" class="form-control"
                            id="interne-mw-email"
                            placeholder="naam@qien.nl">
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-group">
                        <label
                            for="interne-mw-telefoon">Telefoonnummer</label>
                        <input type="telnum" class="form-control"
                            id="interne-mw-telefoon"
                            placeholder="+31 6 00000000">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-4">
                    <div class="form-group">
                        <label
                            for="interne-mw-straatnaamennummer">Adres</label>
                        <input type="text" class="form-control"
                            id="interne-mw-straatnaamennummer"
                            placeholder="Atoomweg 350B">
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-group">
                        <label for="interne-mw-postcode">Postcode</label>
                        <input type="text" class="form-control"
                            id="interne-mw-postcode" placeholder="3542AB">
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-group">
                        <label
                            for="interne-mw-woonplaats">Woonplaats</label>
                        <input type="text" class="form-control"
                            id="interne-mw-woonplaats"
                            placeholder="Utrecht">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-4">
                    <div class="form-group">
                        <label
                            for="interne-mw-startdatum">Startdatum</label>
                        <input type="date" class="form-control"
                            id="interne-mw-startdatum" min="01-01-2020">
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-group">
                        <label for="interne-mw-einddatum">Einddatum</label>
                        <input type="date" class="form-control"
                            id="interne-mw-einddatum" min="01-01-2020">
                    </div>
                </div>
            </div>
        </div>`
        }
    });
}

/*
trainees laden selectorknop relatie koppelen
*/



const updateTraineeSelector = () => {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            deTrainees = JSON.parse(this.responseText);
            let inTeVoegenHTML = ``;
            console.log(deTrainees);


            if (deTrainees.length > 0) {
                console.log("in de if");
                deTrainees.forEach((e) => {

                    // inTeVoegenHTML = `<li data-toggle="modal" data-target="#staticBackdrop" href="./formulier.html?id=${e.id}" 
                    // class="list-group-item list-group-item-action" id="${e.id}">${e.naam} | ${e.maand} | ${e.jaar} | ${e.formulierstatus}</li>`;
                    inTeVoegenHTML = `<option id=${e.id}>${e.naam}</option>`;
                    selectTrainee.insertAdjacentHTML('beforeend', inTeVoegenHTML);
                })
            } else {
                console.log("in de else");
                inTeVoegenHTML = `<div class="alert alert-danger" role="alert"><h4 class="alert-heading">Sapristi, geen formulieren!</h4>
                <p>tekst - veel plezier</p>
                <hr>
                <p class="mb-0">text - nog meer plezier.</p>
            </div>`;
            }


            //     console.log(inTeVoegenHTML);
            //     formulierenLijst.insertAdjacentHTML('beforeend', inTeVoegenHTML);
            // }
            // <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#staticBackdrop">
            //             Launch static backdrop modal
            //         </button>
        }
    }

    xhr.open("GET", "http://localhost:8082/api/admin/trainee/all", true);
    xhr.send();
}

/*
contactpersonen laden selectorknop relatie koppelen
*/

const updateContactPersoonSelector = () => {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            deContactPersonen = JSON.parse(this.responseText);
            let inTeVoegenHTML = ``;
            console.log(deContactPersonen);


            if (deContactPersonen.length > 0) {
                console.log("in de if");
                deContactPersonen.forEach((e) => {
                    
                    // inTeVoegenHTML = `<li data-toggle="modal" data-target="#staticBackdrop" href="./formulier.html?id=${e.id}" 
                    // class="list-group-item list-group-item-action" id="${e.id}">${e.naam} | ${e.maand} | ${e.jaar} | ${e.formulierstatus}</li>`;
                    inTeVoegenHTML = `<option id=${e.id}>${e.naam}</option>`;
                    selectContactPersoon.insertAdjacentHTML('beforeend', inTeVoegenHTML);
                })
            } else {
                console.log("in de else");
                inTeVoegenHTML = `<div class="alert alert-danger" role="alert"><h4 class="alert-heading">Sapristi, geen formulieren!</h4>
                <p>tekst - veel plezier</p>
                <hr>
                <p class="mb-0">text - nog meer plezier.</p>
            </div>`;
            }


            //     console.log(inTeVoegenHTML);
            //     formulierenLijst.insertAdjacentHTML('beforeend', inTeVoegenHTML);
            // }
            // <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#staticBackdrop">
            //             Launch static backdrop modal
            //         </button>
        }
    }

    xhr.open("GET", "http://localhost:8082/api/admin/klantcontactpersoon/all", true);
    xhr.send();
}


/*
AANROEPEN VAN METHODES BIJ OPENEN PAGINA
*/

laatFormulierenZien();
laatMedewerkersZien();
laatBedrijvenZien();
updateTraineeSelector();
updateContactPersoonSelector();
