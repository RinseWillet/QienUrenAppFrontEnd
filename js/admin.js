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
                    class="list-group-item list-group-item-action d-flex justify-content-between" id="${e.id}"><span id="${e.id}">${e.naam}</span><span id="${e.id}">${e.contactPersoon}</span><i id="${e.id}" class="far fa-eye"></i></li>`;
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

// RADIO buttons ophalen
const interneMedewerkerRadio = document.getElementById("radio-interne-mw");
const traineeRadio = document.getElementById("radio-trainee");
const bedrijfRadio = document.getElementById("radio-bedrijf");
const contactPersoonRadio = document.getElementById("radio-contactpersoon");

relatieAanmakenKnop.addEventListener("click", () => {
    var xhr = new XMLHttpRequest();
    if (interneMedewerkerRadio.checked) {
        const interneMedewerkerType = interneMedewerkerRadio.value;
        const interneMedewerkerNaam = document.getElementById("interne-mw-naam").value;
        const interneMedewerkerEmail = document.getElementById("interne-mw-email").value;
        const interneMedewerkerTelefoon = document.getElementById("interne-mw-telefoon").value;
        const interneMedewerkerStraatNaamEnNr = document.getElementById("interne-mw-straatnaamennummer").value;
        const interneMedewerkerPostcode = document.getElementById("interne-mw-postcode").value;
        const interneMedewerkerWoonPlaats = document.getElementById("interne-mw-woonplaats").value;
        const interneMedewerkerStartDatum = document.getElementById("interne-mw-startdatum").value;
        const interneMedewerkerEindDatum = document.getElementById("interne-mw-einddatum").value;

        let interneMedewerkerJSON = {};
        interneMedewerkerJSON.type = interneMedewerkerType;
        interneMedewerkerJSON.naam = interneMedewerkerNaam;
        interneMedewerkerJSON.emailadres = interneMedewerkerEmail;
        interneMedewerkerJSON.telefoonnr = interneMedewerkerTelefoon;
        interneMedewerkerJSON.straatNaamNr = interneMedewerkerStraatNaamEnNr;
        interneMedewerkerJSON.postcode = interneMedewerkerPostcode;
        interneMedewerkerJSON.woonplaats = interneMedewerkerWoonPlaats;
        interneMedewerkerJSON.startDatum = interneMedewerkerStartDatum;
        interneMedewerkerJSON.eindDatum = interneMedewerkerEindDatum;


        xhr.open("POST", "http://localhost:8082/api/admin/internemedewerker/nieuw", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(JSON.stringify(interneMedewerkerJSON));
    }
    if (bedrijfRadio.checked) {
        const bedrijfNaam = document.getElementById("bedrijf-naam").value;
        const bedrijfEmail = document.getElementById("bedrijf-email").value;
        const bedrijfTelefoon = document.getElementById("bedrijf-telefoon").value;
        const bedrijfStraatNaamEnNr = document.getElementById("bedrijf-straatnaamennummer").value;
        const bedrijfPostCode = document.getElementById("bedrijf-postcode").value;
        const bedrijfWoonplaats = document.getElementById("bedrijf-woonplaats").value;

        let bedrijfJSON = {};
        bedrijfJSON.naam = bedrijfNaam;
        bedrijfJSON.emailadres = bedrijfEmail;
        bedrijfJSON.telefoonnr = bedrijfTelefoon;
        bedrijfJSON.straatNaamNr = bedrijfStraatNaamEnNr;
        bedrijfJSON.postcode = bedrijfPostCode;
        bedrijfJSON.woonplaats = bedrijfWoonplaats;

        xhr.open("POST", "http://localhost:8082/api/admin/bedrijf/nieuw", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(JSON.stringify(bedrijfJSON));
    }
    if (traineeRadio.checked) {
        const traineeType = traineeRadio.value;
        const traineeNaam = document.getElementById("trainee-naam").value;
        const traineeEmail = document.getElementById("trainee-email").value;
        const traineeTelefoon = document.getElementById("trainee-telefoon").value;
        const traineeStraatNaamEnNr = document.getElementById("trainee-straatnaamennummer").value;
        const traineePostcode = document.getElementById("trainee-postcode").value;
        const traineeWoonPlaats = document.getElementById("trainee-woonplaats").value;
        const traineeStartDatum = document.getElementById("trainee-startdatum").value;
        const traineeEindDatum = document.getElementById("trainee-einddatum").value;

        let traineeJSON = {};
        traineeJSON.type = traineeType;
        traineeJSON.naam = traineeNaam;
        traineeJSON.emailadres = traineeEmail;
        traineeJSON.telefoonnr = traineeTelefoon;
        traineeJSON.straatNaamNr = traineeStraatNaamEnNr;
        traineeJSON.postcode = traineePostcode;
        traineeJSON.woonplaats = traineeWoonPlaats;
        traineeJSON.startDatum = traineeStartDatum;
        traineeJSON.eindDatum = traineeEindDatum;


        xhr.open("POST", "http://localhost:8082/api/admin/trainee/nieuw", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(JSON.stringify(traineeJSON));
    }
    if (contactPersoonRadio.checked) {
        const contactPersoonType = contactPersoonRadio.value;
        const contactPersoonNaam = document.getElementById("contactpersoon-naam").value;
        const contactPersoonEmail = document.getElementById("contactpersoon-email").value;
        const contactPersoonTelefoon = document.getElementById("contactpersoon-telefoon").value;

        let contactPersoonJSON = {};
        contactPersoonJSON.type = contactPersoonType;
        contactPersoonJSON.naam = contactPersoonNaam;
        contactPersoonJSON.emailadres = contactPersoonEmail;
        contactPersoonJSON.telefoonnr = contactPersoonTelefoon;

        xhr.open("POST", "http://localhost:8082/api/admin/klantcontactpersoon/nieuw", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(JSON.stringify(contactPersoonJSON));
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
            toevoegenGebruikerContainer.innerHTML = `<div class="interne-mw-form">
            <div class="row">
                <div class="col-4">
                    <div class="form-group">
                        <label for="trainee-naam">Naam</label>
                        <input type="text" class="form-control"
                            id="trainee-naam"
                            placeholder="Naam trainee" required="required">
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-group">
                        <label for="trainee-email">Email</label>
                        <input type="email" class="form-control"
                            id="trainee-email"
                            placeholder="trainee@mail.com">
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-group">
                        <label
                            for="trainee-telefoon">Telefoonnummer</label>
                        <input type="telnum" class="form-control"
                            id="trainee-telefoon"
                            placeholder="+31 6 00000000">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-4">
                    <div class="form-group">
                        <label
                            for="trainee-straatnaamennummer">Adres</label>
                        <input type="text" class="form-control"
                            id="trainee-straatnaamennummer"
                            placeholder="Atoomweg 350B">
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-group">
                        <label for="trainee-postcode">Postcode</label>
                        <input type="text" class="form-control"
                            id="trainee-postcode" placeholder="3542AB">
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-group">
                        <label
                            for="trainee-woonplaats">Woonplaats</label>
                        <input type="text" class="form-control"
                            id="trainee-woonplaats"
                            placeholder="Utrecht">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-4">
                    <div class="form-group">
                        <label
                            for="trainee-startdatum">Startdatum</label>
                        <input type="date" class="form-control"
                            id="trainee-startdatum" min="01-01-2020">
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-group">
                        <label for="trainee-einddatum">Einddatum</label>
                        <input type="date" class="form-control"
                            id="trainee-einddatum" min="01-01-2020">
                    </div>
                </div>
            </div>
        </div>`
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
                        <label for="bedrijf-email">Email</label>
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
                        <label for="bedrijf-woonplaats">Vestigingsplaats</label>
                        <input type="text" class="form-control"
                            id="bedrijf-woonplaats" placeholder="Utrecht">
                    </div>
                </div>
            </div>
        </div>`
        } else if (this.value == "ContactPersoon") {
            toevoegenGebruikerContainer.innerHTML = `<div class="contactpersoon-form">
            <div class="row">
                <div class="col-4">
                    <div class="form-group">
                        <label for="contactpersoon-naam">Naam</label>
                        <input type="text" class="form-control"
                            id="contactpersoon-naam"
                            placeholder="Naam contactpersoon">
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-group">
                        <label for="contactpersoon-email">Email</label>
                        <input type="email" class="form-control"
                            id="contactpersoon-email"
                            placeholder="contactpersoon@bedrijf.com">
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-group">
                        <label
                            for="contactpersoon-telefoon">Telefoonnummer</label>
                        <input type="telnum" class="form-control"
                            id="contactpersoon-telefoon"
                            placeholder="+31 6 00000000">
                    </div>
                </div>
            </div>`
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
                        <label for="interne-mw-email">Email</label>
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