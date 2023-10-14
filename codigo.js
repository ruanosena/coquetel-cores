import http from "node:http";
import qs from "node:querystring";
import sass from "node-sass";
import fs from "node:fs";

const server = http.createServer(function (req, res) {
	if (req.method == "GET") {
		// seleciona o caminho e separa da consulta, iniciada com '?' no url
		let caminho = req.url.indexOf("?") > -1 ? req.url.slice(0, req.url.indexOf("?")) : req.url;

		if (caminho == "/") {
			/* Página */
			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			res.write(fs.readFileSync("pagina.html", { encoding: "utf-8" }));

			return res.end();
		} else if (caminho == "/cores") {
			/* API */
			const estilosSaida = ["compact", "compressed", "expanded", "nested"];
			let estilo = undefined;

			let consultaAnalizada = qs.parse(req.url);
			if ("estilo" in consultaAnalizada) {
				if (estilosSaida.includes(consultaAnalizada["estilo"])) {
					estilo = consultaAnalizada["estilo"];
				}
				delete consultaAnalizada["estilo"];
			} else if (`${caminho}?estilo` in consultaAnalizada) {
				if (estilosSaida.includes(consultaAnalizada[`${caminho}?estilo`])) {
					estilo = consultaAnalizada[`${caminho}?estilo`];
				}
				delete consultaAnalizada[`${caminho}?estilo`];
			}

			// identifica todos valores sendo cores
			let cores = Object.values(consultaAnalizada);

			if (cores.length) {
				// TODO: adicionar filtro de cores nomeadas do css
				// normaliza valores múltiplos
				cores = cores.reduce((coresConsultadas, valor) => {
					if (typeof valor == "string" && /,|\s/.test(valor)) {
						valor = valor.trim();
						let valor = valor.split(/,|\s/);
					}
					return Array.isArray(valor) ? [...coresConsultadas, ...valor] : [...coresConsultadas, valor];
				}, []);

				const resultado = sass.renderSync({
					outputStyle: estilo,
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
