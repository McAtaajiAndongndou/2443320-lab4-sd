document.getElementById("search-btn").addEventListener("click", function() {
    let countryName = document.getElementById("country-input").value;
    
    fetch(`https://restcountries.com/v3.1/name/${countryName}?fields=name,capital,population,region,flags,borders`)
        .then(response => {
            if (!response.ok){
                throw new Error("Country not found");
            }
            
            return response.json();
        })
        .then(data => {
            let country = data[0];

            if(!country || !country.name || country.capital || !country.population){
                throw new Error("Invalid Country Data")
            }
            
            let countryInfo = document.getElementById("country-info");
            countryInfo.innerHTML = `
                <p>Capital: ${country.capital ? country.capital[0] : "N/A"}</p>
                <p>Population: ${country.population}</p>
                <p>Region: ${country.region}</p>
                <p>Flag:</p>
                <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="100">
            `;
            
            let borderingCountries = document.getElementById("bordering-countries");
            borderingCountries.innerHTML = "<h3>Bordering Countries:</h3>";
            
            let borders = country.borders || [];
            
            if (borders.length > 0) {
                fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(',')}&fields=name,flags`)
                    .then(response => response.json())
                    .then(borderData => {
                        borderData.forEach(borderCountry => {
                            borderingCountries.innerHTML += `
                                <p>${borderCountry.name.common}:</p>
                                <img src="${borderCountry.flags.svg}" alt="Flag of ${borderCountry.name.common}" width="50">
                            `;
                        });
                    });
            } else {
                borderingCountries.innerHTML += "<p>No bordering countries.</p>";
            }
        })
        .catch(error => {
            document.getElementById("country-info").innerHTML = "<p>Country not found. Please try again.</p>";
            document.getElementById("bordering-countries").innerHTML = "";
        });
});
