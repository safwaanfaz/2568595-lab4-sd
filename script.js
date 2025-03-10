const countryInput = document.getElementById('country-input');
const submitBtn = document.getElementById('submit-btn');
const countryInfoSection = document.getElementById('country-info');
const borderingCountriesSection = document.getElementById('bordering-countries');

submitBtn.addEventListener('click', () => {
    const countryName = countryInput.value;
    countryInfoSection.innerHTML = '<h2>Country Information</h2>';
    borderingCountriesSection.innerHTML = '<h2>Bordering Countries</h2>';

    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => response.json())
        .then(data => {
            const country = data[0];

            countryInfoSection.innerHTML = `
                <h2>${country.name.common}</h2>
                <img src="${country.flags.png}" width="100"> 
                <p>Capital: ${country.capital?.[0] || 'N/A'}</p> 
                <p>Population: ${country.population.toLocaleString()}</p>  
                <p>Region: ${country.region}</p> 
            `;

            borderingCountriesSection.innerHTML = '<h2>Bordering Countries</h2>';

            if (country.borders) {
                const borderPromises = country.borders.map(borderCode =>
                    fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`)
                        .then(response => response.json())
                );

                Promise.all(borderPromises)
                    .then(bordersData => {
                        bordersData.forEach(border => {
                            borderingCountriesSection.innerHTML += `
                                <div>
                                    <img src="${border[0].flags.png}" width="50">  
                                    <span>${border[0].name.common}</span>  
                                </div>
                            `;
                        });
                    })
                    .catch(() => {
                        borderingCountriesSection.innerHTML += '<p>Error fetching border countries</p>';
                    });
            } else {
                borderingCountriesSection.innerHTML += '<p>No bordering countries</p>';
            }
        })
        .catch(() => {
            countryInfoSection.innerHTML = '<p>Country not found, please try again</p>';
        });
});
