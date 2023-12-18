function fetchDataAndPopulateTable(url, tableId) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(data => {
      const table = document.getElementById(tableId);
      if (!table) {
        console.error(`Table with ID '${tableId}' not found.`);
        return;
      }
      table.innerHTML = '';

      data.forEach(item => {
        const row = table.insertRow();
        row.insertCell(0).textContent = item.name; // Відображаємо name для користувача
        // Додайте інші дані, які ви хочете вивести
      });
    })
    .catch(error => console.error('Помилка Fetch:', error));
}


function populateTableWithData(data) {
  const table = document.getElementById('applications_table');
  table.innerHTML = '';

  data.forEach(application => {
    const row = table.insertRow();
    row.insertCell(0).textContent = application.application_id;
    row.insertCell(1).textContent = application.first_name;
    row.insertCell(2).textContent = application.last_name;
    row.insertCell(3).textContent = application.date_of_birth;
    row.insertCell(4).textContent = application.home_address;
    row.insertCell(5).textContent = application.home_street_number;
    row.insertCell(6).textContent = application.home_campus_number;
    row.insertCell(7).textContent = application.home_city;
    row.insertCell(8).textContent = application.home_region;
    row.insertCell(9).textContent = application.phone_number;
    row.insertCell(10).textContent = application.email;
    row.insertCell(11).textContent = application.BenefitName;
    row.insertCell(12).textContent = application.FacultyName;
    row.insertCell(13).textContent = application.SpecialtyName;
    // Додайте інші дані, які ви хочете вивести
  });
}

fetch('/fetch-select-data/applications')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return response.json();
  })
  .then(data => {
    populateTableWithData(data);
  })
  .catch(error => console.error('Помилка отримання даних про заявки:', error));

  fetchDataAndPopulateTable('/fetch-select-data/faculties', 'faculty_name');
  fetchDataAndPopulateTable('/fetch-select-data/benefits', 'benefit_name');
  fetchDataAndPopulateTable('/fetch-select-data/specialties', 'specialty_name');
  

