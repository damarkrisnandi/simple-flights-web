let flights = [];
let airlines = [];
let airports = [];

let sortMenuShow = false;

let sortBy = '';
let filterBy = '';

async function getAirLinesData() {
    const result = await dataFetch('http://localhost:8081/airlines.json')
    return result;
}

async function getAirportData() {
    const result = await dataFetch('http://localhost:8081/airport.json')
    return result;
}

async function getFlightData() {
    const result = await dataFetch('http://localhost:8081/flight.json')
    return result;
}

async function dataFetch(url) {
    const resp = await fetch(url,{
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin':'*',
          'Content-type': 'application/json'
        }
      });
    if (resp.ok) {
        const jsonData = await resp.json();
        return jsonData; 
    }
    return [];
}

function append(flight) {
    let result = `
    <div class="row">
        <div class="card text-bg-success mb-3">
            <div class="card-body">
                <div style="display: flex; justify-content: space-between; align-items: center">
                    <h6 class="card-title" style="width: 100px; margin: 0px">${flight.airlines}</h6>
                    <div style="width: 200px; font-size: 9px; display: flex; justify-content: space-between; align-items: center">
                        <div>
                            <p style="margin: 0px">${flight.departure_airport}</p>
                            ${setFlightTime(flight.departure_time)}
                        </div>
                        <h4>
                            <i class="fa-solid fa-plane"></i>
                        </h4> 
                        <div>
                            <p style="margin: 0px">${flight.arival_airport}</p>
                            ${setFlightTime(flight.arival_time)}
                        </div>    
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    document.querySelector("#flights").innerHTML += result;
}

function setAirLine(airline) {
    return airlines.airlines_data.find(o => o.Code == airline).Name || "-"
}

function setAirport(airport) {
    return airports.airport_data.find(o => o.Code == airport).City || "-"
}

function setFlightTime(time) {
    const hours = new Date(time).getHours();
    const minutes = new Date(time).getMinutes();
    const date = new Date(time).getDate();
    const month = new Date(time).getMonth();

    return `
    <h5 style="margin: 0px">${ hours < 10 ? '0' : '' }${hours}:${ minutes < 10 ? '0' : '' }${minutes}</h5>
    <p style="margin: 0px">${setMonth(month)} ${ date < 10 ? '0' : '' }${date}</p>
    `
}

function setMonth(month) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'August', 'September', 'October', 'November', 'December'];

    return months[month]
}

async function main() {
    airlines = await getAirLinesData();
    airports = await getAirportData();
    flights = await getFlightData()

    for (let flight of flights) {
        flight.airlines = setAirLine(flight.airlines);
        flight.departure_airport = setAirport(flight.departure_airport);
        flight.arival_airport = setAirport(flight.arival_airport);
    }

    if (sortBy == 'date') {
        flights.sort((a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime())
    }

    if (sortBy == 'name') {
        flights.sort((a, b) => {
            const nameA = a.airlines.toUpperCase(); // ignore upper and lowercase
            const nameB = b.airlines.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        });
    }

    
    flights = flights.filter(data => data.airlines.toLowerCase().includes(filterBy.toLowerCase()))

    render();

}

function render() {
    for (let flight of flights) {
        append(flight);
    }
}

function clearData() {
    document.querySelector("#flights").innerHTML = '';
    flights = [];
}


document.getElementById("noSort").addEventListener('click', () => {
    sortBy = '';
    document.getElementById("dropdown-menu-text").innerText = "Sort by: None"
    clearData();
    main();
})

document.getElementById("sortByDepartureTime").addEventListener('click', () => {
    sortBy = 'date';
    document.getElementById("dropdown-menu-text").innerText = "Sort by: Departure time"
    clearData();
    main();
})
document.getElementById("sortByAirlines").addEventListener('click', () => {
    sortBy = 'name';
    document.getElementById("dropdown-menu-text").innerText = "Sort by: Airlines"
    clearData();
    main();
})

document.getElementById("dropdown-menu").addEventListener('click', () => {
    sortMenuShow = !sortMenuShow;
    document.getElementById("dropdown-options").style.display = sortMenuShow ? "block" : "none";
})

document.getElementById("searchText").addEventListener('keyup', (evt) => {
    filterBy = evt.target.value;
    clearData();
    main();
})

main();
