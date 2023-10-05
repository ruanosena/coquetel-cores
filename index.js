import http from "node:http";
import qs from "node:querystring";

const server = http.createServer((req, res) => {
	if (req.method == "GET") {
		const consultas = Object.fromEntries(
			Object.entries(qs.parse(req.url || ""), "&", "=").map(([query, cor]) =>
				query.includes("?") ? [query.slice(query.indexOf("?") + 1), cor] : [query, cor]
			)
		);
    let cores = consultas.cores ?? [];
    if (cores.length) cores = cores.split(/,|\s/);
    if (consultas.cor) cores.push(consultas.cor);

    let unitario = consultas.separado ? true : false;

		console.log(cores.join("<>"), `\n${unitario}`);
		res.statusCode = 200;
		return res.end();
	} else {
		res.statusCode = 400;
		return res.end();
	}
});

server.listen(3000, () => {
	console.log("Listening");
});
