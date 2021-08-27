import axios from "axios"
import router from "./router"
import Vue from "vue"
import Vuex from "vuex"

Vue.use( Vuex )

export default new Vuex.Store( {
  	state: {
    	ws: {
      		adm: "https://maps.mecklenburgcountync.gov/api/adm/",
      		gis: "https://maps.mecklenburgcountync.gov/api/gis/"
    	},
		admkey: null,
		blocks: [ ],
		block_selection: null,
		error_msgs: {
			login: null,
			edit: null
		
		},
		new_stinfo: null,
		progress: {
			login: 0
		
		},
		show_search: true,
		search_results: [ ],
		stinfo: { 
				"legal": [ ], 
				"alias": [ ] 
			},
		token: ""
  
	},
	getters: {
		admkey: state => state.admkey,
		auth: state => state.token,
		blocks: state => state.blocks,
		block_selection: state => state.block_selection,
		error_msgs: state => state.error_msgs,
		new_stinfo: state => state.new_stinfo,
		progress: state => state.progress,
		search_results: state => state.search_results,
		show_search: state => state.show_search,
		stinfo: state => state.stinfo,
		ws: state => state.ws
	
	},
	mutations: {
		admkey( state, payload ){
			state.admkey = payload
		
		},
		auth(state, token) {
			state.token = token
		
		},
		blocks( state, payload ){
			state.blocks = payload
		
		},
		block_selection( state, payload ){
			state.block_selection = payload
		
		},
		error_msgs( state, payload ){
			for( let key in payload ){
				state.error_msgs[ key ] = payload[ key ]
			
			}
		
		},
		new_stinfo( state, payload ){
			state.new_stinfo = payload
		
		},
		progress( state, payload ){
			for( let key in payload ){
				state.progress[ key ] = payload[ key ]
			
			}
		
		},
		search_results( state, payload ){
			state.search_results = payload

		},
		show_search( state, payload ){
			state.show_search = payload
		
		},
		stinfo( state, payload ){
			state.stinfo = payload
		
		}
		
	},
  	actions: {
		async login( { commit }, login_data ){
			//let reply = ( await axios.post( "https://maps.mecklenburgcountync.gov/auth/v1/login", login_data ) ).data;
			//let reply = ( await axios.post( "http://localhost:3000/v1/login", login_data ) ).data;
			let reply = ( await axios.post( "https://meckgisdev.mecklenburgcountync.gov/auth/v1/login", login_data ) ).data;

			if( reply.result === "success" ){
				if( reply.hasOwnProperty( "token") ){
					const now = new Date( ),
						item = {
							token: reply.token,
							expiry: now.getTime( ) + ( 4320000000 ) //expires in 12 hours
						};
				
					localStorage.setItem( "token", JSON.stringify( item ) )
					commit( "auth", reply.token )
					commit( "error_msgs", { login: null } )

				}else{
					commit( "error_msgs", { login: "Unable to login, try again." } )
					commit( "auth", "" )

				}
							
			}else if( reply.result === "failure" ){
				commit( "error_msgs", { login: reply.error })
				commit( "auth", "" )

			}

			commit( "progress", { login: 0 } )
		
			/*if( typeof token === 'object' && token !== null ){
				commit( "auth", "error_" + Math.floor( Math.random( ) * 1000 ) + 1 )

			}else{
				const now = new Date( ),
					item = {
						token: token,
						expiry: now.getTime( ) + ( 4320000000 ) //expires in 12 hours
					};
			
				localStorage.setItem( "token", JSON.stringify( item ) )
				commit( "auth", token )

			}*/

		}, 
		
		async update( { commit }, data ){
			let update_push_instance = axios.create( {
					headers: ( this.state.token.length > 0 ? { "Authorization": this.state.token } : { } )
				} ),
				insert_reply,
				update_reply;

			if( data.hasOwnProperty( "insert" ) ){
				//insert_reply = ( await update_push_instance.post( "https://maps.mecklenburgcountync.gov/auth/v1/insert", data.insert ) ).data
				//insert_reply = ( await update_push_instance.post( "http://localhost:3000/v1/insert", data.insert ) ).data
				insert_reply = ( await update_push_instance.post( "https://meckgisdev.mecklenburgcountync.gov/auth/v1/insert", data.insert ) ).data

			}

			//update_reply = ( await update_push_instance.post( "https://maps.mecklenburgcountync.gov/auth/v1/update", data.update ) ).data
			//update_reply = ( await update_push_instance.post( "http://localhost:3000/v1/update", data.update ) ).data
			update_reply = ( await update_push_instance.post( "https://meckgisdev.mecklenburgcountync.gov/auth/v1/update", data.update ) ).data

			if( data.hasOwnProperty( "insert" ) ){
				if( insert_reply.result === "success" && update_reply.result === "success" ){
					router.go( -1 )
				
				}

			}else{
				if( update_reply.result === "success" ){
					router.go( -1 )
				
				}

			}
		
		}, 

		async insert( { commit }, insert_data ){
			let insert_instance = axios.create( {
					headers: ( this.state.token.length > 0 ? { "Authorization": this.state.token } : { } )
				} ),
				//reply = ( await insert_instance.post( "https://maps.mecklenburgcountync.gov/auth/v1/insert", insert_data ) ).data;
				//reply = ( await insert_instance.post( "http://localhost:3000/v1/insert", insert_data ) ).data;
				reply = ( await insert_instance.post( "https://meckgisdev.mecklenburgcountync.gov/auth/v1/insert", insert_data ) ).data;
		
			if( reply.result === "success" ){
				router.replace( { name: "Detail", params: { stcode: reply.stcode } } )
			
			}else if( reply.result === "failure" ){
				console.log( reply.error)
				commit( "error_msgs", { edit: reply.error } )

			}

		}, 

		async delete( { commit }, delete_data ){
			let delete_instance = axios.create( {
					headers: ( this.state.token.length > 0 ? { "Authorization": this.state.token } : { } )
				} ),
				//reply = ( await delete_instance.post( "https://maps.mecklenburgcountync.gov/auth/v1/delete", delete_data ) ).data;
				//reply = ( await delete_instance.post( "http://localhost:3000/v1/delete", delete_data ) ).data;
				reply = ( await delete_instance.post( "https://meckgisdev.mecklenburgcountync.gov/auth/v1/delete", delete_data ) ).data;
		
			if( reply.result === "success" ){
				if( this.state.stinfo.legal[ 0 ].objectid === delete_data.filter ){
					this.state.search_results = [ ]
					router.replace( { name: "Search" } )
				
				}else{
					router.go( )

				}
			
			}

		}

  	}

} );