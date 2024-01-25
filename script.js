const baseUri = 'https://shoppinglistweb.azurewebsites.net/api/items'
const unitTypes = ["stk", "g", "kg", "liter", "pk", "bk", "ps"]

// Function to fetch items from an API
async function fetchItemsFromApi() {
    try {
        const response = await fetch(baseUri);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    }
}

// Function to create or update tables for each category
async function displayCategoryTablesFromApi() {
    const items = await fetchItemsFromApi();

    if (items.length === 0) {
        console.warn('No items fetched from the API.');
        return;
    }

    const categories = [...new Set(items.map(item => item.category))];
    const tablesContainer = document.getElementById('categoryTables');

    categories.forEach(category => {
        const categoryItems = items.filter(item => item.category === category);

        // Check if a table for the category already exists
        const existingTable = tablesContainer.querySelector(`table[data-category="${category}"]`);

        if (existingTable) {
            // Add the new item to the existing table
            const tableBody = existingTable.querySelector('tbody');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${categoryItems[0].name}</td>
                <td>${categoryItems[0].quantity}</td>
                <td>${categoryItems[0].unitType}</td>
                <td><span class="delete-button" onclick="deleteItem('${categoryItems[0].name}')">Delete</span></td>
            `;
            tableBody.appendChild(row);
        } else {
            // Create a heading for the category
            const categoryHeading = document.createElement('h2');
            categoryHeading.textContent = category;
            tablesContainer.appendChild(categoryHeading);
            // Create a new table for the current category
            const table = document.createElement('table');
            table.dataset.category = category;
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Unit Type</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${categoryItems[0].name}</td>
                        <td>${categoryItems[0].quantity}</td>
                        <td>${categoryItems[0].unitType}</td>
                        <td><button class="btn btn-danger" onclick="deleteItem('${categoryItems[0].name}')">Delete</button></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td><input class="form-control" type="text" id="nameInput"></td>
                        <td><input class="form-control" type="text" id="quantityInput"></td>
                        <td>
                            <select class="form-control" id="unitTypeInput"></select>
                        </td>
                        <td><button class="btn btn-success" onclick="addItem('${category}')">Add</button></td>
                    </tr>
                </tfoot>
            `;

            // Populate the dropdown with options from the unitTypes array
            populateUnitTypeOptions(table);

            tablesContainer.appendChild(table);
        }
    });
}

// Function to populate the unit type options in the dropdown
function populateUnitTypeOptions(table) {
    const unitTypeInput = table.querySelector('#unitTypeInput');
    unitTypes.forEach(unitType => {
        const option = document.createElement('option');
        option.value = unitType;
        option.textContent = unitType;
        unitTypeInput.appendChild(option);
    });
}

// Function to add a new item
async function addItem(category) {
    const nameInput = document.getElementById('nameInput');
    const quantityInput = document.getElementById('quantityInput');
    const unitTypeInput = document.getElementById('unitTypeInput');

    const itemName = nameInput.value;
    const itemQuantity = quantityInput.value;
    const itemUnitType = unitTypeInput.value;

    // Validate input values
    if (!itemName || !itemQuantity || !itemUnitType) {
        alert('Please fill out all fields before adding.');
        return;
    }

    // Make a POST request to add the new item to the API
    try {
        const response = await fetch(baseUri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers needed for your API
            },
            body: JSON.stringify({
                name: itemName,
                quantity: itemQuantity,
                unitType: itemUnitType,
                category: category
            })
        });

        if (response.ok) {
            console.log('Item added successfully.');
            // Optionally, you can refresh the UI or update the tables after adding
            // For simplicity, you can reload the page or fetch the updated data from the API
            displayCategoryTablesFromApi();
        } else {
            console.error('Failed to add item:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error adding item:', error);
    }

    // Clear input fields after adding
    nameInput.value = '';
    quantityInput.value = '';
    unitTypeInput.value = '';
}

// Function to delete an item (replace with actual delete logic)
function deleteItem(itemName) {
    // Add your delete logic here (e.g., make a delete request to the API)
    console.log(`Deleting item: ${itemName}`);
}

// Display the category tables on page load
displayCategoryTablesFromApi();