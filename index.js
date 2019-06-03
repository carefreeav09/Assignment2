
var xmlData = '';
var cartData = [];

function loadXMLDoc() {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            xmlData = this;
            if (window.location.href === "http://localhost:8080/cars/") {
                populateTable();
            }
            if (window.location.href === "http://localhost:8080/cars/shoppingCart.html") {
                showCart();
            }
            if(window.location.href=== "http://localhost:8080/cars/forms.html"){
                getPaymentAmount();
            }
        }
    };
    xmlhttp.open("GET", "cars.xml", true);
    xmlhttp.send();
}


function populateTable() {
    var i;
    var carsRows = '';
    var xmlDoc = xmlData.responseXML;
    var x = xmlDoc.getElementsByTagName("Vehicle");
    for (i = 0; i < x.length; i++) {

        var carsData = "<div class='col-md-3 mb-3'>" +
            "<div class='card-deck'><div class='card'>" +
            "<img class='card-img-top' src='img/" + x[i].getElementsByTagName("Image")[0].childNodes[0].nodeValue + "' alt='Card image cap'>" +
            "<div class='card-body'>" +
            "<h5 class='card-title'>" + x[i].getElementsByTagName("Brand")[0].childNodes[0].nodeValue + "-" + x[i].getElementsByTagName("Model")[0].childNodes[0].nodeValue + "</h5>" +
            "<p class='card-text my-0'><span class='font-weight-bold'>Mileage</span> : "
            + x[i].getElementsByTagName("Mileage")[0].childNodes[0].nodeValue +
            "</p>" +
            "<p class='card-text my-0'><span class='font-weight-bold'>FuelType</span> : "
            + x[i].getElementsByTagName("FuelType")[0].childNodes[0].nodeValue +
            "</p>" +
            "<p class='card-text my-0'><span class='font-weight-bold'>Seats</span> : "
            + x[i].getElementsByTagName("Seats")[0].childNodes[0].nodeValue +
            "</p>" +
            "<p class='card-text my-0'><span class='font-weight-bold'>PricePerDay</span> : "
            + x[i].getElementsByTagName("PricePerDay")[0].childNodes[0].nodeValue +
            "</p>" +
            "<p class='card-text my-0'><span class='font-weight-bold'>Availability</span> : "
            + x[i].getElementsByTagName("Availability")[0].childNodes[0].nodeValue +
            "</p>" +
            "<p class='card-text mt-4'><span class='font-weight-bold'>description</span> : "
            + x[i].getElementsByTagName("Description")[0].childNodes[0].nodeValue +
            "</p>" +
            "<a href='#' class='btn btn-primary' onclick='addToCart(" + i + ")'>Add To Cart</a>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        carsRows = carsRows + carsData;

    }

    document.getElementById("dataHere").innerHTML = carsRows;

}

function addToCart(data) {
    var selectedData = xmlData.responseXML;
    var x = selectedData.getElementsByTagName("Vehicle");
    var isAvailable = x[data].getElementsByTagName('Availability')[0].childNodes[0].nodeValue;

    if (isAvailable === 'True') {
        alert('Add To the cart successfully');
        if (cartData.indexOf(data) === -1) {
            cartData.push(data);
        }
    } else {
        alert('Sorry, the car is not available now. Please try other cars')
    }
    sessionStorage.setItem('cartArray', JSON.stringify(cartData));
}

function showCart() {
    var sessionCartData = JSON.parse(window.sessionStorage.getItem('cartArray'));
    var cartTableData = '';
    var cartData = '';
    var xmlDoc = xmlData.responseXML;
    var x = xmlDoc.getElementsByTagName("Vehicle");
    if (sessionCartData) {
        for (var i = 0; i < sessionCartData.length; i++) {
            cartData = "<tr>" +
                "<td><img class='card-img-top' style='height: 100px;width: 100px ' src='img/" + x[sessionCartData[i]].getElementsByTagName("Image")[0].childNodes[0].nodeValue + "' alt='Card image cap'>" + "</td>" +
                "<td>" + x[sessionCartData[i]].getElementsByTagName("ModelYear")[0].childNodes[0].nodeValue + "-" + x[sessionCartData[i]].getElementsByTagName("Brand")[0].childNodes[0].nodeValue + "-" + x[sessionCartData[i]].getElementsByTagName("Model")[0].childNodes[0].nodeValue + "</td>" +
                "<td>" + x[sessionCartData[i]].getElementsByTagName("PricePerDay")[0].childNodes[0].nodeValue + "</td>" +
                "<td><input type='number' id='" + sessionCartData[i] + "' class='form-control inputFields'/></td>" +
                "<td><button type='button' id='deleteData" + sessionCartData[i] + "' onclick='deleteData(" + sessionCartData[i] + ")' class='btn btn-primary btn-sm'> Delete </button></td>" +
                "</tr>";
            cartTableData = cartTableData + cartData;
        }
        document.getElementById('proceedButton').innerHTML = "<div ><button class='btn btn-primary float-right mb-3' onclick='proceedToCheckout()'>Proceeding to checkout</button></div>";
    } else {
        cartTableData = "<div>There are no items in the cart</div>"
    }
    document.getElementById('cartItems').innerHTML = cartTableData;
}

function deleteData(id) {
    var sessionCartData = JSON.parse(window.sessionStorage.getItem('cartArray'));
    for (var i = 0; i < sessionCartData.length; i++) {
        if (sessionCartData[i] === id) {
            sessionCartData.splice(i, 1);
        }
    }
    sessionStorage.setItem('cartArray', JSON.stringify(sessionCartData));
    if (JSON.parse(sessionStorage.getItem('cartArray')).length === 0) {
        sessionStorage.clear();
    }
    window.location.reload();
}

function proceedToCheckout() {
    var sessionCartData = JSON.parse(window.sessionStorage.getItem('cartArray'));
    var inputFields = document.querySelectorAll('.inputFields');
    var finalCarsArray = [];
    for (var i = 0; i < inputFields.length; i++) {
        var carsObject = {
            id: inputFields[i].id,
            value: inputFields[i].value,
        };
        finalCarsArray.push(carsObject)
    }
    if (sessionCartData.length > 0) {
        sessionStorage.setItem('submittedArray', JSON.stringify(finalCarsArray));
        setTimeout(function () {
            window.location.replace('http://localhost:8080/cars/forms.html')
        }, 500)
    } else {
        alert('No car has been reserved');
    }
}

function getPaymentAmount(){
    var sessionCartData = JSON.parse(window.sessionStorage.getItem('submittedArray'));
    var totalAmount = 0;
    var xmlDoc = xmlData.responseXML;
    console.log(xmlDoc);
    var x = xmlDoc.getElementsByTagName("Vehicle");
    for(var i =0 ; i < sessionCartData.length ; i++)
    {
        totalAmount = totalAmount + (parseInt(x[sessionCartData[i].id].getElementsByTagName("PricePerDay")[0].childNodes[0].nodeValue) * parseInt(sessionCartData[i].value));
    }

    document.getElementById('paymentAmount').innerHTML = totalAmount;

}


