import http from "node:http";
import qs from "node:querystring";
import sass from "node-sass";
import fs from "node:fs";

const server = http.createServer(function (req, res) {
	console.log(qs.parse(req.url));

	if (req.method == "GET") {
		// separa o caminho da consulta, iniciada com '?' no url
		let caminho = req.url.indexOf("?") > -1 ? req.url.slice(0, req.url.indexOf("?")) : req.url;

		if (caminho == "/") {
			/* Página */
			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			res.write(fs.readFileSync("pagina.html", { encoding: "utf-8" }));

			return res.end();
		} else if (caminho == "/cores") {
			/* API */

			// indexa a consulta e normaliza a chave do objeto junto ao caminho
			const consultas = Object.fromEntries(
				Object.entries(qs.parse(req.url || ""), "&", "=").map(([consulta, valor], i) =>
					i == 0 ? [consulta.slice(caminho.length + 1 /* '?' */), valor] : [consulta, valor]
				)
			);

			console.log(caminho, consultas);
			// TODO: adicionar filtro de cores nomeadas do css
			let cores = consultas.c ?? [];

			// TODO: adicionar resposta minificada, resumida em uma linha

			if (cores.length) {
				cores = cores.split(/,|\s/);

				const resultado = sass.renderSync({
					data: cores.reduce(function (estilos, cor) {
						// aplica o tom branco de 80 para 20 porcento
						// define meio dos tons, a cor principal
						// aplica o tom preto de 20 para 80 porcento
						return (
							estilos +
							`
						@for $i from 20 through 80 {
							@if $i % 20 == 0 {
								$porcentagem: $i*1%;
								--${cor}-#{$i / 2} {
									color: mix(white, ${cor}, 100% - $porcentagem);
								}
							}
						}
						--${cor}-50 {
							color: ${cor};
						}
						@for $i from 20 through 80 {
							@if $i % 20 == 0 {
								$porcentagem: $i*1%;
								--${cor}-#{50 + ($i / 2)} {	
									color: mix(black, ${cor}, $porcentagem);
								}
							}
						}
						`
						);
					}, ""),
				});

				res.writeHead(200, { "Content-Type": "text/css; charset=utf-8" });
				res.write(resultado.css);

				return res.end();
			} else {
				// TODO: servir todas cores da internet em tonalidades
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
