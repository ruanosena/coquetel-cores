import { URL } from "node:url";
import sass from "node-sass";

/**
 * @param {import("node:http").IncomingMessage} req
 */
export function analisarParametros(req) {
	let { pathname: caminho, searchParams: consultas } = new URL(req.url, `http://${req.headers["host"]}`);
	return { caminho, consultas };
}

export function obterEstilo(consulta) {
	const estilosSaida = ["compact", "compressed", "expanded", "nested"];
	return estilosSaida.includes(consulta) ? consulta : undefined;
}

export function obterCores(consulta) {
	/** @type {Array} */
	let cores = consulta.reduce((coresConsultadas, valor) => {
		// normaliza valores múltiplos em lista ou no mesmo texto
		if (typeof valor == "string" && /,|\s/.test(valor)) {
			valor = valor.trim();
			let valor = valor.split(/,|\s/);
		}
		if (Array.isArray(valor)) return [...coresConsultadas, ...valor];
		else {
			coresConsultadas.push(valor);
			return coresConsultadas;
		}
	}, []);

	return cores.filter(function (cor) {
		return coresPadroesNomeadas.includes(cor);
	});
}

export function renderizarCSS(cores, estilo) {
  return sass.renderSync({
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
}

const coresPadroesNomeadas = [
	"aliceblue",
	"antiquewhite",
	"aqua",
	"aquamarine",
	"azure",
	"beige",
	"bisque",
	"black",
	"blanchedalmond",
	"blue",
	"blueviolet",
	"brown",
	"burlywood",
	"cadetblue",
	"chartreuse",
	"chocolate",
	"coral",
	"cornflowerblue",
	"cornsilk",
	"crimson",
	"cyan",
	"darkblue",
	"darkcyan",
	"darkgoldenrod",
	"darkgray",
	"darkgreen",
	"darkgrey",
	"darkkhaki",
	"darkmagenta",
	"darkolivegreen",
	"darkorange",
	"darkorchid",
	"darkred",
	"darksalmon",
	"darkseagreen",
	"darkslateblue",
	"darkslategray",
	"darkslategrey",
	"darkturquoise",
	"darkviolet",
	"deeppink",
	"deepskyblue",
	"dimgray",
	"dimgrey",
	"dodgerblue",
	"firebrick",
	"floralwhite",
	"forestgreen",
	"fuchsia",
	"gainsboro",
	"ghostwhite",
	"gold",
	"goldenrod",
	"gray",
	"green",
	"greenyellow",
	"grey",
	"honeydew",
	"hotpink",
	"indianred",
	"indigo",
	"ivory",
	"khaki",
	"lavender",
	"lavenderblush",
	"lawngreen",
	"lemonchiffon",
	"lightblue",
	"lightcoral",
	"lightcyan",
	"lightgoldenrodyellow",
	"lightgray",
	"lightgreen",
	"lightgrey",
	"lightpink",
	"lightsalmon",
	"lightseagreen",
	"lightskyblue",
	"lightslategray",
	"lightslategrey",
	"lightsteelblue",
	"lightyellow",
	"lime",
	"limegreen",
	"linen",
	"magenta",
	"maroon",
	"mediumaquamarine",
	"mediumblue",
	"mediumorchid",
	"mediumpurple",
	"mediumseagreen",
	"mediumslateblue",
	"mediumspringgreen",
	"mediumturquoise",
	"mediumvioletred",
	"midnightblue",
	"mintcream",
	"mistyrose",
	"moccasin",
	"navajowhite",
	"navy",
	"oldlace",
	"olive",
	"olivedrab",
	"orange",
	"orangered",
	"orchid",
	"palegoldenrod",
	"palegreen",
	"paleturquoise",
	"palevioletred",
	"papayawhip",
	"peachpuff",
	"peru",
	"pink",
	"plum",
	"powderblue",
	"purple",
	"rebeccapurple",
	"red",
	"rosybrown",
	"royalblue",
	"saddlebrown",
	"salmon",
	"sandybrown",
	"seagreen",
	"seashell",
	"sienna",
	"silver",
	"skyblue",
	"slateblue",
	"slategray",
	"slategrey",
	"snow",
	"springgreen",
	"steelblue",
	"tan",
	"teal",
	"thistle",
	"tomato",
	"turquoise",
	"violet",
	"wheat",
	"white",
	"whitesmoke",
	"yellow",
	"yellowgreen",
];
