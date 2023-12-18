document.addEventListener('DOMContentLoaded', () => {
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

  document.getElementById('dormitory').addEventListener('change', function () {
    const selectedDormitoryId = this.value;
    fetchRoomsByDormitory(selectedDormitoryId); // Pass only dormitoryId
  });

  document.getElementById('accept_application_form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const application_id = document.getElementById('application_id').value;
    const dormitoryName = document.getElementById('dormitory').value;
    const roomNumber = document.getElementById('room_number').value;

    try {
      const dormitoryResponse = await fetch(`/fetch-select-data/dormitories?name=${dormitoryName}`);
      const dormitoryData = await dormitoryResponse.json();

      if (!dormitoryData || dormitoryData.length === 0) {
        throw new Error('Dormitory not found');
      }

      const dormitory_id = dormitoryData[0].dormitory_id;

      const formData = {
        application_id,
        dormitory_id,
        room_id: roomNumber,
        // Add other necessary data for server processing
      };

      const response = await fetch('http://localhost:5500/accept_application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Server response:', data);
      // Add code to display or handle the received data
    } catch (error) {
      console.error('Error occurred:', error);
      // Add code to display error on the page
    }
  });
});
