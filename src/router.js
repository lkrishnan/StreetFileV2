import Information from "./components/Information.vue"
import store from "./store"
import Vue from "vue"
import VueRouter from "vue-router"

Vue.use( VueRouter )

	const routes = [
		{
			path: "/",
			name: "Search",
			component: Information

		}, {
			path: "/:stcode",
			name: "Detail",
			component: Information

		}, {
			path: "/login",
			name: "Login",
			component: ( ) => import( /* webpackChunkName: "login" */ "./components/Login.vue" ),
			beforeEnter( to, from, next ){
				if( store.getters[ "auth" ] === '' ){ //user not logged show the login page
					next( )
				}else{ // user logged in so show the info page //
					next( {	name: "Detail" } );

				}
				
			}
		
		}, {
			path: '/add',
			name: 'Add',
			component: () => import( /* webpackChunkName: "edit" */ "./components/Edit.vue" ),
			children: [
				{
					name: "Add_Legal",
					path: "legal",
					meta: {
						title: "Add new Legal Street Name"
					}
					
				}, {
					name: "Add_Alias",
					path: "alias/:stcode",
					meta: {
						title: "Add Alias Street Name"
					}
				
				}
		
			]
		
		}, {
			path: '/edit',
			name: 'Edit',
			component: () => import( /* webpackChunkName: "edit" */ "./components/Edit.vue" ),
			children: [
				{
					name: "Edit_Legal",
					path: "legal/:oid",
					meta: {
						title: "Edit Legal Street Name"
					}
					
				}, {
					name: "Edit_Alias",
					path: "alias/:oid",
					meta: {
						title: "Edit selected Alias Street Name"
					}
				
				}
		
			]
						
		}

	],

	router = new VueRouter( {  
			routes
		} );

router.beforeEach( ( to, from, next ) => {
	
	//auto login
	if( store.getters[ "auth" ] === '' && localStorage.getItem( "token" ) ){
		const item = JSON.parse( localStorage.getItem( "token" ) ), 
			now = new Date( )

		// compare the expiry time of the item with the current time
		if( now.getTime( ) > item.expiry ){
			// If the item is expired, delete the item from storage
			// and return null
			localStorage.removeItem( "token" )
			store.commit( "auth", "" )
		
		}else{
			store.commit( "auth", item.token )
		
		}

	}

	switch( to.name ){
		case "Edit_Legal": case "Edit_Alias": case "Add_Legal": case "Add_Alias":
			if( store.getters[ "auth" ] === '' ){ //user not logged show the login page
				next( {	name: "Login" } );
			
			}else{
				next( )
			
			}

			break

		default: 
			next( )
	
	}	

} )

export default router