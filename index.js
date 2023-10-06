import http from "node:http";
import qs from "node:querystring";
import sass from "node-sass";

const server = http.createServer(function (req, res) {
	if (req.method == "GET") {
		const consultas = Object.fromEntries(
			Object.entries(qs.parse(req.url || ""), "&", "=").map(([query, cor]) =>
				query.includes("?") ? [query.slice(query.indexOf("?") + 1), cor] : [query, cor]
			)
		);
		let cores = consultas.cores ?? [];
		if (cores.length) cores = cores.split(/,|\s/);
		if (consultas.cor) cores.push(consultas.cor);

		// TODO: adcionar resposta minificada, resumida em uma linha

		if (cores.length) {
			sass.render(
				{
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
				},
				function (erro, resultado) {
					res.statusCode = 200;
					res.setHeader("Content-Type", "text/css");

					res.write(resultado.css);
					return res.end();
				}
			);
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
