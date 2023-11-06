const http = require('http');
const os = require('os');
const readline = require('readline');
const fs = require('fs');

const configFilePath = 'config.json';
let config = {
	interval: 10000,
};

if (fs.existsSync(configFilePath)) {
	const configFile = fs.readFileSync(configFilePath, 'utf8');
	config = JSON.parse(configFile);
}

const server = http.createServer((req, res) => {
	res.setHeader('Content-Type', 'text/plain; charset=utf-8');
	res.writeHead(200);
	res.end('Información del sistema:\n\nNode.js versión: ${process.version}\nSistema operativo: ${os.platform()}\n');

	console.log('Servidor iniciado en http://localhost:8080/');
});

server.listen(8080);

function mostrarInfo() {
	const cpuUsage = process.cpuUsage();
	const memoryUsage = process.memoryUsage();
	console.log('Uso de CPU : ${process.cpuUsage().user / 1000} ms, System ${cpuUsage.system / 1000} ms');
	console.log(`Uso de memoria: RSS ${Math.round(memoryUsage.rss / (1024 * 1024))} MB, Heap Total ${Math.round(memoryUsage.heapTotal / (1024 * 1024))} MB, Heap Used ${Math.round(memoryUsage.heapUsed / (1024 * 1024))} MB`);
  	console.log(`Tiempo que el sistema lleva activo: ${Math.floor(os.uptime() / 60)} minutos`);
  	console.log(`Tiempo que lleva ejecutándose Node.js: ${Math.floor(process.uptime() / 60)} minutos`);
  	console.log('\n');
}

setInterval(mostrarInfo, config.interval);

// Configurar la frecuencia de actualización desde el archivo de configuración
const rl = readline.createInterface({
	input: process.stdin,
  	output: process.stdout,
});

rl.question('¿Cada cuántos segundos quieres mostrar la información? ', (answer) => {
  	config.interval = parseInt(answer) * 1000;
  	fs.writeFileSync(configFilePath, JSON.stringify(config));
  	console.log(`Frecuencia actualizada a ${parseInt(answer)} segundos.`);
  	rl.close();
});
