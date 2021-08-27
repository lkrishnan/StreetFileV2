<template>
	<v-app >
		<v-app-bar app color="primary" dark>
			<v-toolbar-title class="headline">
				<div class="d-none d-sm-flex">
					Street File Dictionary
				</div>
				<v-avatar class="d-flex d-sm-none">
					<v-img max-height="48" max-width="48" src="img/icons/48x48.png"></v-img>
				</v-avatar>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<!--Buttons for big screen -->
			<v-btn class="ma-2 d-none d-sm-flex" outlined color="white" v-if="( auth !== '' && [ 'Search', 'Detail' ].includes( route_name ) )" @click="takeAction( 'Add_Legal' )" >
				<v-icon left>mdi-plus-circle</v-icon>Add New Legal
			</v-btn>
			<v-btn class="ma-2 d-none d-sm-flex" outlined color="white" v-if="( auth === '' )" @click="takeAction( 'Login' )">
				<v-icon left>mdi-login-variant</v-icon>Login
			</v-btn>
			<v-btn class="ma-2 d-none d-sm-flex" outlined color="white" v-if="( auth !== '' )" @click="takeAction( 'Logout' )">
				<v-icon left>mdi-logout-variant</v-icon>Logout
			</v-btn>
			<!--Buttons for small screen -->
			<v-btn class="ma-2 d-flex d-sm-none" color="white" light v-if="( auth !== '' && [ 'Search', 'Detail' ].includes( route_name ) )" @click="takeAction( 'Add_Legal' )" >
				<v-icon>mdi-plus-circle</v-icon>
			</v-btn>
			<v-btn class="ma-2 d-flex d-sm-none" color="white" light v-if="( auth === '' )" @click="takeAction( 'Login' )">
				<v-icon>mdi-login-variant</v-icon>
			</v-btn>
			<v-btn class="ma-2 d-flex d-sm-none" color="white" light v-if="( auth !== '' )" @click="takeAction( 'Logout' )">
				<v-icon>mdi-logout-variant</v-icon>
			</v-btn>
		</v-app-bar>
		<v-main class="grey lighten-4">
			<router-view />
		</v-main>
		<v-snackbar bottom right :value="updateExists" :timeout="-1" color="primary">
    		An update is available
    		<v-btn text @click="refreshApp">Update</v-btn>
  		</v-snackbar>
	</v-app>
</template>

<script>
	export default {
    	name: "App",

		computed: {
        	auth( ){
          		return this.$store.state.token
        	},
			new_stinfo( ){
          		return this.$store.state.new_stinfo
        	},
			show_search( ){
				return this.$store.state.show_search

			},
			stinfo( ){
          		return this.$store.state.stinfo
        	},
			route_name( ){
				return this.$route.name; 
			}
      
      	},
    	
		created( ){
			// Listen for our custom event from the SW registration
			document.addEventListener( 'swUpdated', this.updateAvailable, { once: true } )
			
			// Prevent multiple refreshes
			if( "serviceWorker" in navigator ){
				navigator.serviceWorker.addEventListener( 'controllerchange', ( ) => {
					if( this.refreshing ) 
						return
					this.refreshing = true
					// Here the actual reload of the page occurs
					window.location.reload( )
			
				} )
			}

    	},
		
		data( ){
			return {
				drawer: false,
				items: [
					[ "mdi-information", "Information", "info" ],
					[ "mdi-plus-circle", "Add Street", "edit" ],
					[ "mdi-login-variant", "Login", "login" ]

				],
				tools: [
					{ title: "Add New Legal" },
					{ title: "Logout" }

				],
				// refresh variables
				refreshing: false,
				registration: null,
				updateExists: false,
			}

    	},

		methods: {
			takeAction( type ){
          		const _this = this

				switch( type ){
					case "Login":
						_this.$store.commit( "show_search", false )
						_this.$router.push( { name: type } )
						break

					case "Logout":
						localStorage.removeItem( "token" )
          				this.$store.commit( "auth", "" )
						
						if( [ "Edit_Legal", "Edit_Alias", "Add_Legal", "Add_Alias" ].includes( _this.$route.name ) ){
							_this.$router.push( { name: "Search" } )
						}
						
						break

					case "Add_Legal":
						_this.$store.commit( "new_stinfo", [ {
							preaddrnum: null, 
							streettype: null,
							addrnumsuf: null, 
							aliaslegalflag: "L", 
							staccess: "PUB", 
							addrnumbers: "B",
							parcelsattached: "N", 
							stcontinuous: "Y",
							roadtype: "Road",
							reason: null
						} ] )
						_this.$router.push( { name: type } )
						break

				}

        	},

			// Store the SW registration so we can send it a message
			// We use `updateExists` to control whatever alert, toast, dialog, etc we want to use
			// To alert the user there is an update they need to refresh for
			updateAvailable( event ){
				this.registration = event.detail
				this.updateExists = true
			
			},
		
			// Called when the user accepts the update
			refreshApp( ){
				console.debug("refreshing app")
				this.updateExists = false

				// Make sure we only send a 'skip waiting' message if the SW is waiting
				if( !this.registration || !this.registration.waiting ) 
					return
				// send message to SW to skip the waiting and activate the new SW
				this.registration.waiting.postMessage( { type: 'SKIP_WAITING' } )

			}

		}

  	}
</script>