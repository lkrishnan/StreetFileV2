<template>
  	<v-container>
    	<v-form v-model="valid" ref="form" v-if="new_stinfo">
			<v-row>
				<v-col cols="12">
					<v-card class="my-5 pa-5">
						<v-card-title>{{ title }}</v-card-title>
						<v-row>
              				<v-col cols="12">
                				<v-data-table 
									:headers="headers" 
									:items="new_stinfo" 
									:items-per-page="1" 
									hide-default-footer>
									<template v-slot:item.preaddrnum="{item}">
										<v-select
											v-model="item.preaddrnum"
											:items="prefixes"
											menu-props="auto"
											label="Select"
											hide-details
											single-line
											dense>
											<template slot="selection" slot-scope="data">
												{{ data.item.text }}
											</template>
											<template slot="item" slot-scope="data">
												{{ data.item.text }}
											</template>
										</v-select>
									</template>
									<template v-slot:item.streetname="{item}">
										<v-text-field 
											v-model="item.streetname"
											single-line
											dense
											class="pt-4"
											:rules="stname_rules"
											required>
										</v-text-field>
									</template>
									<template v-slot:item.streettype="{item}">
										<v-select
											v-model="item.streettype"
											:items="sttypes"
											menu-props="auto"
											label="Select"
											single-line>
											<template slot="selection" slot-scope="data">
												{{ data.item.text }}
											</template>
											<template slot="item" slot-scope="data">
												{{ data.item.text }}
											</template>
										</v-select>
									</template>
									<template v-slot:item.addrnumsuf="{item}">
										<v-select
											v-model="item.addrnumsuf"
											:items="suffixes"
											menu-props="auto"
											label="Select"
											single-line>
											<template slot="selection" slot-scope="data">
												{{ data.item.text }}
											</template>
											<template slot="item" slot-scope="data">
												{{ data.item.text }}
											</template>
										</v-select>
									</template> 
									<template v-slot:item.municipality="{item}">
										<v-select
											v-model="item.municipality"
											:items="juris"
											menu-props="auto"
											label="Select"
											single-line
											:rules="municipality_rules"
											@change="chgCitycode( )"
											required>
										</v-select> 
									</template>    
                				</v-data-table>
              				</v-col>
            			</v-row>
            			<v-row>
							<v-col cols="12">
								<v-data-table 
									:headers="headers2" 
									:items="new_stinfo" 
									:items-per-page="1"
									hide-default-footer>
									<template v-slot:item.lowerblock="{item}">
										<v-text-field 
											v-model="item.lowerblock"
											single-line
											dense
											class="pt-5">
										</v-text-field>
									</template>
									<template v-slot:item.upperblock="{item}">
										<v-text-field 
											v-model="item.upperblock"
											single-line
											dense
											class="pt-5">
										</v-text-field>
									</template>
									<template v-slot:item.addrnumbers="{item}">
										<v-select
											v-model="item.addrnumbers"
											:items="addrnumbers"
											menu-props="auto"
											label="Select"
											hide-details
											single-line
											dense>
											<template slot="selection" slot-scope="data">
												{{ data.item.text }}
											</template>
											<template slot="item" slot-scope="data">
												{{ data.item.text }}
											</template>
										</v-select>
									</template>
									<template v-slot:item.roadtype="{item}">
										<v-select
											v-model="item.roadtype"
											:items="roadtype"
											menu-props="auto"
											label="Select"
											hide-details
											single-line
											dense>
											<template slot="selection" slot-scope="data">
											{{ data.item.text }}
											</template>
											<template slot="item" slot-scope="data">
											{{ data.item.text }}
											</template>
										</v-select>
									</template>
									<template v-slot:item.staccess="{item}">
										<v-select
											v-model="item.staccess"
											:items="staccess"
											menu-props="auto"
											label="Select"
											hide-details
											single-line
											dense>
											<template slot="selection" slot-scope="data">
												{{ data.item.text }}
											</template>
											<template slot="item" slot-scope="data">
												{{ data.item.text }}
											</template>
										</v-select>
									</template>
									<template v-slot:item.stcontinuous="{item}">
										<v-select
											v-model="item.stcontinuous"
											:items="stcont"
											menu-props="auto"
											label="Select"
											hide-details
											single-line
											dense>
										</v-select>
									</template>
									<template v-slot:item.parcelsattached="{item}">
										<v-select
											v-model="item.parcelsattached"
											:items="parcelsattach"
											menu-props="auto"
											label="Select"
											hide-details
											single-line
											dense>
										</v-select>
									</template>
								</v-data-table> 
							</v-col>
            			</v-row>
            			<v-row>
              				<v-col cols="12">
								<v-data-table 
									:headers="headers3" 
									:items="new_stinfo" 
									:items-per-page="1"
									hide-default-footer>
									<template v-slot:item.directions="{item}">
										<v-textarea
											v-model="item.directions"
											dense>
										</v-textarea>
									</template>
									<template v-slot:item.comments="{item}">
										<v-textarea
											v-model="item.comments"
											dense>
										</v-textarea>
									</template>
									<template v-slot:item.reason="{item}">
										<v-select
											v-model="item.reason"
											:items="reason"
											menu-props="auto"
											label="Select"
											hide-details
											single-line
											dense>
										</v-select>
									</template>
								</v-data-table> 
              				</v-col>
            			</v-row>
					</v-card>
				</v-col>
			</v-row>
      		<v-row>
        		<v-col cols="12">
          			<v-alert
						dense
						outlined
						type="error"
						v-if="error_msgs.edit">
						{{ error_msgs.edit }}
					</v-alert>
					<v-btn 
						class="ma-2" 
						color="primary" 
						x-large
						@click="save( )">
						<v-icon left>mdi-content-save</v-icon>Save
					</v-btn>
					<v-btn 
						class="ma-2" 
						color="primary" 
						x-large
						@click="save( 'push_alias' )"
						v-if="route_name === 'Edit_Legal'">
						<v-icon left>mdi-content-save-move</v-icon>Push to Alias & Save
					</v-btn>
					<v-btn 
						class="ma-2" 
						color="primary" 
						x-large
						@click="cancel( )">
						<v-icon left>mdi-arrow-left-circle</v-icon>Cancel
					</v-btn>
        		</v-col>
      		</v-row>
		</v-form>
  	</v-container>
</template>

<script>
  	import FormatADMKey from "../js/formatADMKey"
	import GetInfoByOID from "../js/getInfoByOID"
	import GetInfoByStCode from "../js/getInfoByStCode"
	import ObjDiffs from "../js/objdiffs"
	import ObjToUppercase from "../js/objtouppercase"
  	
  	export default {
    	name: "edit",

		beforeRouteEnter( to, from, next ){
			next( async vm => {
    			switch( to.name ){
					case "Edit_Legal": case "Edit_Alias":
						if( !vm.new_stinfo ){ //fill new_stinfo with data to display on the edit form 
							vm.new_stinfo = await GetInfoByOID( to.params.oid )
							vm.stcode = vm.new_stinfo[ 0 ].countystcode

							if( vm.stinfo.legal.length === 0 && vm.stinfo.alias.length === 0 ){ //fill stinfo with data for doing edit comparison
								vm.stinfo = await GetInfoByStCode( vm.stcode )

							}

						}else{
							vm.stcode = vm.new_stinfo[ 0 ].countystcode
							
						}
						
						break

					case "Add_Legal": case "Add_Alias":
						if( !vm.new_stinfo ){
							vm.new_stinfo = [ {
									preaddrnum: null, 
									streettype: null,
									addrnumsuf: null, 
									aliaslegalflag: ( to.name === "Add_Legal" ? "L" : "A" ), 
									staccess: "PUB", 
									addrnumbers: "B",
									parcelsattached: "N", 
									stcontinuous: "Y",
									roadtype: "Road",
									reason: null
								} ]

							if( to.name === "Add_Alias" ){
								vm.new_stinfo[ 0 ].countystcode = to.params.stcode 
							}
						
						}
						
						break
				
				}

				//hide or show the countystcode header 
				vm.chngHeader( to.name )

  			} )
		
		},
    	
		data: ( ) => ( {
      		headers: [
				{ text: "Dir", value: "preaddrnum", sortable: false },
				{ text: "Street Name", value: "streetname", sortable: false },
				{ text: "Street Type", value: "streettype", sortable: false },
				{ text: "Street Suffix", value: "addrnumsuf", sortable: false },
				{ text: "Jurisdiction", value: "municipality", sortable: false },
				{ text: "County Code", value: "countystcode", sortable: false },
				{ text: "City Code", value: "citystcode", sortable: false }
			],
			headers2: [
				{ text: "Lower Block", value: "lowerblock", sortable: false },
				{ text: "Upper Block", value: "upperblock", sortable: false },
				{ text: "Parity", value: "addrnumbers", sortable: false },
				{ text: "Type", value: "roadtype", sortable: false },
				{ text: "Access", value: "staccess", sortable: false },
				{ text: "Continuous", value: "stcontinuous", sortable: false },
				{ text: "Parcels Attached", value: "parcelsattached", sortable: false }
			
			],
			headers3: [
				{ text: "Directions to Street", value: "directions", sortable: false },
				{ text: "Comments", value: "comments", sortable: false },
				{ text: "Reason for Name Change", value: "reason", sortable: false }
			
			],
			addrnumbers: [
				{ value: "B", text: "ODD AND EVEN" },
				{ value: "E", text: "EVEN ONLY" },
				{ value: "O", text: "ODD ONLY" }
			
			],
			staccess: [
				{ value: "PUB", text: "PUBLIC" },
				{ value: "PVT", text: "PRIVATE" }
			
			],
			roadtype: [
				{ value: "Road", text: "ROAD" },
				{ value: "NamedDriveway", text: "DRIVEWAY" }
			
			],
			reason: [
				{ value: "AL", text: "ALIAS NAME ONLY" },
				{ value: "AX", text: "ANNEXATION" },
				{ value: "CC", text: "COUNTY COMMISSION" },
				{ value: "NC", text: "NAME CHANGE" },
				{ value: "PC", text: "PLANNING COMMISSION" },
				{ value: "SD", text: "SUBDIVISION" },
				{ value: null, text: "NA" }
			
			],
			prefixes: [
				{ value: "N", text: "N" },
				{ value: "S", text: "S" },
				{ value: "W", text: "W" },
				{ value: "E", text: "E" },
				{ value: null, text: "" }

			],
			sttypes: [ 
				{ value: "AL", text: "AL" }, 
				{ value: "AV", text: "AV" },
				{ value: "BV", text: "BV" },
				{ value: "BY", text: "BY" },
				{ value: "CR", text: "CR" },
				{ value: "CS", text: "CS" },
				{ value: "CT", text: "CT" },
				{ value: "CV", text: "CV" },
				{ value: "DR", text: "DR" },
				{ value: "EP", text: "EP" },
				{ value: "EX", text: "EX" },
				{ value: "FR", text: "FR" },
				{ value: "HY", text: "HY" },
				{ value: "LN", text: "LN" },
				{ value: "LP", text: "LP" },
				{ value: "PL", text: "PL" },
				{ value: "PY", text: "PY" },
				{ value: "RA", text: "RA" },
				{ value: "RD", text: "RD" },
				{ value: "RN", text: "RN" },
				{ value: "RW", text: "RW" },
				{ value: "ST", text: "ST" },
				{ value: "TC", text: "TC" },
				{ value: "TL", text: "TL" },
				{ value: "TR", text: "TR" },
				{ value: "WY", text: "WY" },
				{ value: null, text: "" }
			
			],
			suffixes: [ 
				{ value: "N", text: "N" },
				{ value: "NW", text: "NW" },
				{ value: "SE", text: "SE" },
				{ value: "W", text: "W" },
				{ value: "E", text: "E" },
				{ value: "NE", text: "NE" },
				{ value: "S", text: "S" },
				{ value: "SW", text: "SW" },
				{ value: "EXT", text: "EXT" },
				{ value: "NB", text: "NB" },
				{ value: "SB", text: "SB" },
				{ value: "EB", text: "EB" },
				{ value: "WB", text: "WB" },
				{ value: "CONN", text: "CONN" },
				{ value: null, text: "" } 
			
			],
			juris: [ "MECK", "CHAR", "CORN", "DAVI", "HUNT", "MATT", "MINT", "PINE", "STAL", "OTHER" ],
			parcelsattach: [ "Y", "N" ],
			stcont: [ "Y", "N" ],
			valid: false,
			stname_rules: [
				v => !!v || 'Street Name is required'
			
			],
			municipality_rules: [
				v => !!v || 'Municipality is required'
			
			],
			citystcode_rules: [
				v => !!v || 'City Code is required'
			
			],
			stcode: null

    	} ),

    	computed: {
			error_msgs: {
      			set( error_msgs ){
					this.$store.commit( "error_msgs", error_msgs )
									
				},
      			get( ){
					return this.$store.state.error_msgs
      			
				}
							
			},
			new_stinfo: {
      			set( new_stinfo ){
					this.$store.commit( "new_stinfo", new_stinfo )
									
				},
      			get( ){
					return this.$store.state.new_stinfo
      			
				}
							
			},
			stinfo: {
      			set( stinfo ){
					this.$store.commit( "stinfo", stinfo )
									
				},
      			get( ){
					return this.$store.state.stinfo
      			
				}
							
			},
			route_name( ){
				return this.$route.name; 
			},
			title( ){
				return this.$route.meta.title
			}

    	},

    	methods: {
      		save( type = null ){
        		const _this = this;

				_this.error_msgs.edit = null

				if( _this.$refs.form.validate( ) ){
					switch( _this.route_name ){
						case "Edit_Legal": case "Edit_Alias":
							_this.edit( type )
						break

						case "Add_Legal": case "Add_Alias":
							_this.add( )
						break

					}
				
				}

      		},

			edit( type ){
        		const _this = this,
					change_row = ObjDiffs( 
						( _this.route_name == "Edit_Alias" ? _this.stinfo.alias.find( x => x.objectid === _this.new_stinfo[ 0 ].objectid ) : _this.stinfo.legal[ 0 ] ), //old value
						_this.new_stinfo[ 0 ] ); //new value

        		if( Object.keys( change_row ).length > 0 ){
          			_this.error_msgs.edit = null

					let update_row = { },
						insert_row ={ },
						dispatch_data = { },
						add_admkey = Object.keys( change_row ).some( key => { 
							return [ "preaddrnum", "streetname", "streettype", "addrnumsuf", "municipality", "staccess", "roadtype" ].includes( key ) 
						} );

					update_row = { ...change_row };

					if( add_admkey ){
						update_row.admkey = FormatADMKey( _this.new_stinfo[ 0 ].preaddrnum, _this.new_stinfo[ 0 ].streetname, _this.new_stinfo[ 0 ].streettype,
							_this.new_stinfo[ 0 ].addrnumsuf, _this.new_stinfo[ 0 ].municipality, _this.new_stinfo[ 0 ].staccess, _this.new_stinfo[ 0 ].roadtype )
					
					}

					if( type === "push_alias" ){ //make the old legal street an alias
						const { objectid, ...temp } = _this.new_stinfo[ 0 ]

						insert_row = {  ...temp }

						insert_row.aliaslegalflag = "A"

					}

					if( Object.keys( insert_row ).length > 0 ){
						dispatch_data.insert = { 
								data: JSON.stringify( ObjToUppercase( insert_row ) )
							}  
					
					} 
					
					if( Object.keys( update_row ).length > 0 ){
						dispatch_data.update = {
								filter: _this.new_stinfo[ 0 ].objectid, 
								data: JSON.stringify( ObjToUppercase( update_row ) ) 
							}
					}
					
					//update the specific row
					this.$store.dispatch( "update", dispatch_data );
					
        		}else{
          			_this.error_msgs.edit = "No edits were detected. Make some changes before saving or push Cancel to exit."

        		}

      		},

			add( ){
				const _this = this;

				if( _this.$refs.form.validate( ) ){
					let insert_row = { ..._this.new_stinfo[ 0 ] };

					insert_row.admkey = FormatADMKey( _this.new_stinfo[ 0 ].preaddrnum, _this.new_stinfo[ 0 ].streetname, _this.new_stinfo[ 0 ].streettype,
						_this.new_stinfo[ 0 ].addrnumsuf, _this.new_stinfo[ 0 ].municipality, _this.new_stinfo[ 0 ].staccess, _this.new_stinfo[ 0 ].roadtype ); 

					if( Object.keys( insert_row ).length > 0 ){
						//insert the new legal row
						_this.$store.dispatch( "insert", { 
							data: JSON.stringify( ObjToUppercase( insert_row ) ) 
						} );
					
					}

				}

      		},
      		
			cancel( ){
				const _this = this

				_this.error_msgs.edit = null
        		_this.$router.go( -1 )
			
			},

			chgCitycode( ){
				const _this = this

				switch( _this.route_name ){
					case "Edit_Legal":
						const lookup = {
								"MECK" : "0",
								"CHAR" : "1",
								"DAVI" : "2",
								"CORN" : "3",
								"PINE" : "4",
								"MATT" : "5",
								"HUNT" : "6",
								"MINT" : "7",
								"STAL" : "8"
				
							},
							citystcode = _this.stinfo.legal[ 0 ].citystcode,
							muni = _this.new_stinfo[ 0 ].municipality; 	
						
						if( citystcode ){ //if the citystcode was null it will be generated by the backend
							_this.new_stinfo[ 0 ].citystcode = ( muni === "OTHER" ? null : ( lookup[ muni ] + citystcode.substring( 1 ) ) ) 
						
						}

						break

				}
						
			},

			chngHeader( route ){
        		const _this = this
				
					switch( route ){
						case "Add_Legal":
							[ "countystcode", "citystcode" ].forEach( key => { 
								const idx = _this.headers.findIndex( ( { value } ) => value === key )
								if( idx > -1 ){
									_this.headers.splice( idx, 1 );
								}

							} )
							
							break
						default:
							if( _this.headers.findIndex( ( { value } ) => value === "countystcode" ) == -1 ){
								_this.headers.splice( _this.headers.length, 0, { text: "County Code", value: countystcode, sortable: false } );
							
							}

							if( _this.headers.findIndex( ( { value } ) => value === "citystcode" ) == -1 ){
								_this.headers.splice( _this.headers.length, 0, { text: "City Code", value: countystcode, sortable: false } );
							
							}

							break
					
				}
    		
			}
      		
		}

  	}
</script>