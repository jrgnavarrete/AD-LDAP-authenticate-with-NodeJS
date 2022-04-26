/* REQUIREMENTS: 
    1. NodeJS installation
    2. In Powershell: "npm install ldapjs"
*/
const ldap = require('ldapjs'); // Import LDAPJS, you have to install it first con NPM.

const client = ldap.createClient({
  url: ['ldap://127.0.0.1:389'] //CHANGE THIS TO THE LDAP SERVER URL, RIGHT NOW IS LOCALHOST.
});

client.on('error', (err) => {
  // If the connection is not done correctly...
  console.log("Error en la conexión :(" + err) 
})

// Change this to the correct AD/LDAP domain.
// This is an example for "navarrete.local".
let cnAD = 'Users';
let dcAD = 'navarrete';
let dcADpunto = 'local';

// Username and password to validate.
let username = 'max';
let password = 'Cambiame!123';

client.bind(username, password, function (err) { // Bind start.
    if (err) {
        // If the credentials are incorrect or the bind is not correct...
        console.log('Ha ocurrido un error al bindear :('); 
    } else {
        var base = 'cn=' + cnAD +',dc=' + dcAD +',dc='+ dcADpunto; // var to save the DN of the user.
        var search_options = { // Search filter
            scope: 'sub',
            filter: '(&(objectClass=*)(CN=' + username + '))', // Here I'm searching with the CN (username), you can use other attributes.
            attrs: 'memberOf'
        };
        client.search(base, search_options, function (err, res) { // Searching the user with that CN.
            if (err) {
                // If the user doesn't exist:
                console.log('Ha ocurrido un error al buscar el usuario');
            } else {
                res.on('searchEntry', function (entry) {
                    console.log('ENTRADA DE LA BÚSQUEDA:', entry.object); // Print the user attributes.
                    let jsonEnviar = JSON.stringify(entry.object); // You can save this data in a JSON to do whatever you want with it.
                    
                });
                res.on('searchReference', function (referral) {
                    console.log('REFERRAL:', referral);
                });
                res.on('error', function (err) {
                    // If we have an error while binding:
                    console.log('EL ERROR ES:', err);
                });
                res.on('end', function (result) {
                    console.log('EL RESULTADO ES: ', result);
                    // Print bind result
                });
            }
        });
    }
});
