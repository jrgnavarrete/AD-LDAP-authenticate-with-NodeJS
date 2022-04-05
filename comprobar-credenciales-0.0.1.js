/* REQUISITOS: 
    1. Instalar NodeJS completo
    2. Ejecutar en Powershell como administrador: "npm install ldapjs"
*/
const ldap = require('ldapjs'); // Importar ldapjs, previamente instalado.

const client = ldap.createClient({
  url: ['ldap://127.0.0.1:389'] //URL del servidor LDAP junto al puerto.
});

client.on('error', (err) => {
  console.log("Error en la conexión :(" + err) // Capturar error de conexión al LDAP.
})

// Variables para usar como base de la búsqueda del DN, hay que cambiarlas por cada cliente según su AD/LDAP.
// Este ejemplo es para mi AD en el dominio navarrete.local.
let cnAD = 'Users';
let dcAD = 'navarrete';
let dcADpunto = 'local';

// Variables de credenciales de ejemplo, esto lo debería recibir del websocket.
let username = 'max';
let password = 'Cambiame!123';

client.bind(username, password, function (err) { // Inicio de bindeo de user y pass.
    if (err) {
        console.log('Ha ocurrido un error al bindear :('); // Capturar error credenciales incorrectos o error al bindear.
    } else {
        var base = 'cn=' + cnAD +',dc=' + dcAD +',dc='+ dcADpunto; // Variable con la base para formar el DN junto al CN del user.
        var search_options = { // Variable para guardar filtro de búsqueda
            scope: 'sub',
            filter: '(&(objectClass=*)(CN=' + username + '))', // En lugar de usar el CN (username), se podría buscar según email u otros, por ej.
            attrs: 'memberOf'
        };
        client.search(base, search_options, function (err, res) { // Método para buscar el usuario según el CN introducido.
            if (err) {
                console.log('Ha ocurrido un error al buscar el usuario');
            } else {
                res.on('searchEntry', function (entry) {
                    console.log('ENTRADA DE LA BÚSQUEDA:', entry.object); // Devuelve los datos del usuario buscado.
                    let jsonEnviar = JSON.stringify(entry.object); // Se guarda en la variable "jsonEnviar" los datos buscados en JSON.
                    
                });
                res.on('searchReference', function (referral) {
                    console.log('REFERRAL:', referral);
                });
                res.on('error', function (err) {
                    console.log('EL ERROR ES:', err);
                });
                res.on('end', function (result) {
                    console.log('EL RESULTADO ES: ', result);
                    // Devuelve el resultado del bindeo de credenciales
                });
            }
        });
    }
});