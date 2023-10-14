import http from "node:http";
import fs from "node:fs";
import { analisarParametros, obterCores, obterEstilo, renderizarCSS } from "./util.js";

const server = http.createServer(function (req, res) {
	if (req.method == "GET") {
		let { caminho, consultas } = analisarParametros(req);

		if (caminho == "/") {
			/* Página */
			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			res.write(fs.readFileSync("pagina.html", { encoding: "utf-8" }));

			return res.end();
		} else if (caminho == "/cores") {
			/* API */
			let cores = obterCores(consultas.getAll("cores").concat(consultas.getAll("c")));

			if (cores.length) {
				let estilo = obterEstilo(consultas.get("estilo") ?? consultas.get("e"));

				const resultado = renderizarCSS(cores, estilo);

				res.writeHead(200, { "Content-Type": "text/css; charset=utf-8" });
				res.write(resultado.css);

				return res.end();
			} else {
				res.statusCode = 404;
				return res.end();
			}
		} else {
			res.statusCode = 400;
			return res.end();
		}
	} else {
		res.statusCode = 403;
		return res.end();
	}
});

server.listen(3000, () => {
	console.log("Listening");
});
