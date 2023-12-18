document.addEventListener('DOMContentLoaded', function () {
  // Fetch dormitories data
  fetch('/fetch-select-data/dormitories')
    .then(response => response.json())
    .then(data => {
      const dormitorySelect = document.getElementById('dormitory');
      data.forEach(dormitory => {
        const option = document.createElement('option');
        option.value = dormitory.dormitory_id;
        option.text = dormitory.name;
        dormitorySelect.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching dormitories:', error));



    function fetchRoomsByDormitory(dormitoryId) {
      fetch(`/fetch-select-data/rooms/${dormitoryId}`)
        .then(response => response.json())
        .then(data => {
          const roomSelect = document.getElementById('room');
          roomSelect.innerHTML = ''; // Clear previous options
          data.forEach(room => {
            const option = document.createElement('option');
            option.value = room.room_id;
            option.text = room.room_number.toString(); // Using room_number from rooms table
            roomSelect.appendChild(option);
          });
        })
        .catch(error => console.error('Error fetching rooms:', error));
    }
  
    // Event listener for dormitory selection to fetch related rooms
    document.getElementById('dormitory').addEventListener('change', function() {
      const selectedDormitoryId = this.value;
      fetchRoomsByDormitory(selectedDormitoryId);
    });

  // Function to fetch specialties based on selected faculty
  document.getElementById('filterStudents').addEventListener('submit', function (event) {
    event.preventDefault();

    const lastName = document.getElementById('lastName').value;
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const date_of_birth = document.getElementById('date_of_birth').value;
    const dormitory = document.getElementById('dormitory').value;
    const room = document.getElementById('room').value;

    const searchData = {
        lastName,
        firstName,
        middleName,
        date_of_birth,
        dormitory,
        room
    };

    fetch('/search-students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
    })
        .then(response => response.json())
        .then(foundStudents => {
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = '';

            foundStudents.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.last_name}</td>
                    <td>${student.first_name}</td>
                    <td>${student.middle_name}</td>
                    <td>${student.date_of_birth}</td>
                    <td>${student.Dormitory.name}</td>
                    <td>${student.Room.room_number}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error searching students:', error));
});
  

});
