const countryInput = document.getElementById('country-input');
const submitBtn = document.getElementById('submit-btn');
const countryInfoSection = document.getElementById('country-info');
const borderingCountriesSection = document.getElementById('bordering-countries');

submitBtn.addEventListener('click', fetchCountryData);

function fetchCountryData() {
    const countryName = countryInput.value.trim();

    countryInfoSection.innerHTML = '<h2>Country Information</h2>';
    borderingCountriesSection.innerHTML = '<h2>Bordering Countries</h2>';

    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Country not found');
            }
            return response.json();
        })
        .then(data => {
            const country = data[0];

            countryInfoSection.innerHTML += `
                <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="100">
                <p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
                <p>Population: ${country.population.toLocaleString()}</p>
                <p>Region: ${country.region}</p>
            `;

            if (country.borders && country.borders.length > 0) {
                fetch(`https://restcountries.com/v3.1/alpha?codes=${country.borders.join(',')}`)
                    .then(response => response.json())
                    .then(borderCountries => {
                        borderCountries.forEach(borderCountry => {
                            borderingCountriesSection.innerHTML += `
                                <div>
                                    <img src="${borderCountry.flags.png}" alt="Flag of ${borderCountry.name.common}" width="50">
                                    <span>${borderCountry.name.common}</span>
                                </div>
                            `;
                        });
                    });
            } else {
                borderingCountriesSection.innerHTML += '<p>No bordering countries</p>';
            }
        })
        .catch(error => {
            countryInfoSection.innerHTML += `<p>Error: ${error.message}</p>`;
        });
}