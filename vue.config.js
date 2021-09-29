const CopyPlugin = require('copy-webpack-plugin');
const jsapi = '@arcgis/core';

module.exports = {
	publicPath: process.env.NODE_ENV === "production" ? "/stfile/" : "/",
	
	css: {
	  sourceMap: true,
  	},
  	
	productionSourceMap: false,
  	
	transpileDependencies: [
	  	"vuetify"
	],

	configureWebpack: {
		plugins: [
		  	new CopyPlugin( {
				patterns: [
					// arcgis assets
					{
						context: 'node_modules',
						from: `${jsapi}/assets`,
						to: './assets',
						globOptions: {
							// ignore the webscene spec folder, sass files,
							ignore: ['**/webscene/spec/**', '**/*.scss', '**/*.css'],
						
						}

					}
					
				]

		  	} )

		]

	},
  	
	chainWebpack: config => {
	  	config
			.plugin( "html" )
			.tap( args => {
				args[ 0 ].title = "Street File Dictionary";	// Replace your title here
				args[ 0 ].themecolor = "#F5F5F5";  
				return args;

			} )
				  
  	},
  	
	pwa: {
	  	manifestOptions: {
			name: "Street File Dictionary",
			short_name:"Street File",
			theme_color: "#F5F5F5",
			background_color:"#000000",
			start_url:".",
			display:"standalone",
			icons: [
				{
					"src":"./img/icons/16x16.png",
					"sizes":"16x16",
					"type":"image/png"
				},{
					"src":"./img/icons/32x32.png",
					"sizes":"32x32",
					"type":"image/png"
				},{
					"src":"./img/icons/48x48.png",
					"sizes":"48x48",
					"type":"image/png"
				},{
					"src":"./img/icons/72x72.png",
					"sizes":"72x72",
					"type":"image/png"
				},{
					"src":"./img/icons/76x76.png",
					"sizes":"76x76",
					"type":"image/png"
				},{
					"src":"./img/icons/96x96.png",
					"sizes":"96x96",
					"type":"image/png"
				},{
					"src":"./img/icons/120x120.png",
					"sizes":"120x120",
					"type":"image/png"
				},{
					"src":"./img/icons/144x144.png",
					"sizes":"144x144",
					"type":"image/png"
				},{
					"src":"./img/icons/152x152.png",
					"sizes":"152x152",
					"type":"image/png"
				},{
					"src":"./img/icons/180x180.png",
					"sizes":"180x180",
					"type":"image/png"
				},{
					"src":"./img/icons/192x192.png",
					"sizes":"192x192",
					"type":"image/png"
				},{
					"src":"./img/icons/270x270.png",
					"sizes":"270x270",
					"type":"image/png"
				},{
					"src":"./img/icons/512x512.png",
					"sizes":"512x512",
					"type":"image/png"
				},{
					"src":"./img/icons/48x48-maskable.png",
					"sizes":"48x48",
					"type":"image/png",
					"purpose":"maskable"
				},{
					"src":"./img/icons/72x72-maskable.png",
					"sizes":"72x72",
					"type":"image/png",
					"purpose":"maskable"
				},{
					"src":"./img/icons/96x96-maskable.png",
					"sizes":"96x96",
					"type":"image/png",
					"purpose":"maskable"
				},{
					"src":"./img/icons/144x144-maskable.png",
					"sizes":"144x144",
					"type":"image/png",
					"purpose":"maskable"
				},{
					"src":"./img/icons/192x192-maskable.png",
					"sizes":"192x192",
					"type":"image/png",
					"purpose":"maskable"
				},{
					"src":"./img/icons/512x512-maskable.png",
					"sizes":"512x512",
					"type":"image/png",
					"purpose":"maskable"
				}
			
			]
	
		},
	  	workboxPluginMode: "InjectManifest",
	  	workboxOptions: {
			swSrc: "service-worker.js",
		  	exclude: [ /\.htaccess$/, /web\.config$/, /\.(?:scss)$/ ]
	  	
		},
	  
	}

}