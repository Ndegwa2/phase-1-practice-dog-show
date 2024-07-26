document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/dogs';
    const tableBody = document.getElementById('table-body');
    const form = document.getElementById('dog-form');
    let currentDogId = null;

    // Function to render the list of dogs
    function renderDogs() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(dogs => {
                tableBody.innerHTML = ''; // Clear existing table rows
                dogs.forEach(dog => {
                    const row = tableBody.insertRow();
                    row.innerHTML = `
                        <td>${dog.name}</td>
                        <td>${dog.breed}</td>
                        <td>${dog.sex}</td>
                        <td><button class="btn btn-primary btn-sm" data-id="${dog.id}">Edit</button></td>
                    `;
                });

                // Attach click event listener to each Edit button
                tableBody.querySelectorAll('button').forEach(button => {
                    button.addEventListener('click', () => {
                        currentDogId = button.getAttribute('data-id');
                        fetch(`${apiUrl}/${currentDogId}`)
                            .then(response => response.json())
                            .then(dog => {
                                form.name.value = dog.name;
                                form.breed.value = dog.breed;
                                form.sex.value = dog.sex;
                            });
                    });
                });
            });
    }

    // Handle form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const updatedDog = {
            name: form.name.value,
            breed: form.breed.value,
            sex: form.sex.value
        };

        fetch(`${apiUrl}/${currentDogId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedDog)
        })
        .then(() => {
            // Refresh the dog list after updating
            renderDogs();
            form.reset();
            currentDogId = null;
        });
    });

    // Initial rendering of dogs
    renderDogs();
});
