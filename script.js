async function getData(dateInput) {
    try {
        const response = await fetch(`https://api.carbonintensity.org.uk/intensity/date/${dateInput}`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.log(error);
        alert("Couldn't get data")
        return [];
    }
}


async function displayData(dateInput, loading=false) {
    try {
        if (loading) {
            document.getElementById('loading').style.display = "flex";
            document.getElementById('main').style.display = "none";
        }

        let data = await getData(dateInput);

        if (loading) {
            document.getElementById('main').style.display = "";
            document.getElementById('loading').style.display = "none";
        }

        document.getElementById('filterCard').style.display = "flex";
        document.getElementById('tableCard').style.display = "block";
        const table = document.getElementById('dataTable');
        const options = {
            // year: 'numeric', 
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };

        while (table.rows.length > 2) {
            table.deleteRow(2);
        }

        const filterValue = categoriesFilter.value;
        data = data.filter(element => {
            if (filterValue === 'all') return true

            return filterValue === element.intensity.index;
        })

        let count = 1;

        data.forEach(row => {
            const tr = document.createElement('tr');

            const no = document.createElement('td');
            no.innerText = count++;
            tr.appendChild(no);

            const time = document.createElement('td');
            time.innerText = (new Date(row.from)).toLocaleString('en-US', options) + " - " + (new Date(row.to)).toLocaleString('en-US', options);
            tr.appendChild(time);

            const forecast = document.createElement('td');
            forecast.innerText = row.intensity.forecast;
            tr.appendChild(forecast);

            const actual = document.createElement('td');
            actual.innerText = row.intensity.actual || "None";
            tr.appendChild(actual);

            const index = document.createElement('td');
            index.innerText = row.intensity.index;
            tr.appendChild(index);

            table.appendChild(tr)
        });
    } catch (error) {
        alert("Couldn't display data")
        console.log(error);
    }
}

let categoriesFilter = document.getElementById('categoriesFilter');

categoriesFilter.addEventListener('change', () => {
    let dateInput = document.getElementById('dateInput').value;
    displayData(dateInput);
})

document.getElementById('inputForm').addEventListener('submit', event => {
    event.preventDefault();

    let dateInput = document.getElementById('dateInput').value;

    // console.log(dateInput);
    displayData(dateInput, true);
});